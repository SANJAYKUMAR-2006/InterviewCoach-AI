import os
import json
import random
import shutil
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional

# Import database helpers
from models.database import get_db, Attempt

# Import analysis services
from services.speech_to_text import transcribe_audio
from services.filler_analysis import analyze_fillers
from services.fluency_analysis import analyze_fluency
from services.vocabulary_analysis import analyze_vocabulary
from services.grammar_analysis import analyze_grammar
from services.relevance_analysis import analyze_relevance
from services.scoring import calculate_final_score
from services.report_generator import generate_suggestions

router = APIRouter()

# Load questions bank helper
QUESTIONS_FILE = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "data",
    "questions.json"
)

def load_questions():
    try:
        with open(QUESTIONS_FILE, "r") as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading questions: {e}")
        return []

# Pydantic schemas for request validation
class StartRequest(BaseModel):
    mode: str
    difficulty: str

class AnalyzeRequest(BaseModel):
    question_id: int
    transcript: str
    duration_seconds: float

# Routes
@router.post("/interview/start")
def start_interview(payload: StartRequest):
    questions = load_questions()
    
    # Filter questions matching mode and difficulty (case-insensitive)
    filtered = [
        q for q in questions
        if q.get("mode", "").lower() == payload.mode.lower() and 
           q.get("difficulty", "").lower() == payload.difficulty.lower()
    ]
    
    if not filtered:
        # Fallback filter just on mode
        filtered = [q for q in questions if q.get("mode", "").lower() == payload.mode.lower()]
        
    if not filtered:
        # Complete fallback to all questions
        filtered = questions

    if not filtered:
        raise HTTPException(status_code=500, detail="Question bank is empty or could not be loaded.")

    selected_question = random.choice(filtered)
    
    return {
        "question_id": selected_question["id"],
        "question_text": selected_question["question"]
    }

@router.post("/interview/submit-audio")
async def submit_audio(file: UploadFile = File(...)):
    # Verify file upload
    if not file:
        raise HTTPException(status_code=400, detail="No audio file uploaded.")

    # Create temporary directory inside workspace for audio files
    temp_dir = os.path.join(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 
        "temp"
    )
    os.makedirs(temp_dir, exist_ok=True)
    
    # Determine extension and save temporarily
    file_ext = os.path.splitext(file.filename)[1] or ".wav"
    temp_file_path = os.path.join(temp_dir, f"audio_upload{file_ext}")
    
    try:
        with open(temp_file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Run speech-to-text
        res = transcribe_audio(temp_file_path)
        return {
            "transcript": res["transcript"],
            "duration_seconds": res["duration_seconds"],
            "method_used": res["method_used"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Audio processing failed: {str(e)}")
    finally:
        # Clean up audio file
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)

@router.post("/interview/analyze")
def analyze_interview(payload: AnalyzeRequest, db: Session = Depends(get_db)):
    questions = load_questions()
    
    # Find matching question
    target_q = next((q for q in questions if q["id"] == payload.question_id), None)
    if not target_q:
        raise HTTPException(status_code=404, detail="Question ID not found in question bank.")

    expected_keywords = target_q.get("expected_keywords", [])
    
    # Run analysis services
    filler_res = analyze_fillers(payload.transcript)
    fluency_res = analyze_fluency(payload.transcript, payload.duration_seconds)
    vocab_res = analyze_vocabulary(payload.transcript)
    grammar_res = analyze_grammar(payload.transcript)
    relevance_res = analyze_relevance(payload.transcript, expected_keywords)
    
    # Run scoring service
    scoring_res = calculate_final_score(
        fluency_score=fluency_res["fluency_score"],
        vocabulary_score=vocab_res["vocabulary_score"],
        relevance_score=relevance_res["relevance_score"],
        grammar_score=grammar_res["grammar_score"],
        filler_control_score=filler_res["filler_control_score"]
    )
    
    # Generate suggestions
    suggestions = generate_suggestions(
        fluency_score=fluency_res["fluency_score"],
        vocabulary_score=vocab_res["vocabulary_score"],
        relevance_score=relevance_res["relevance_score"],
        grammar_score=grammar_res["grammar_score"],
        filler_control_score=filler_res["filler_control_score"],
        words_per_minute=fluency_res["words_per_minute"]
    )

    # Save to SQLite database
    attempt = Attempt(
        question_id=payload.question_id,
        question_text=target_q["question"],
        mode=target_q["mode"],
        difficulty=target_q["difficulty"],
        transcript=payload.transcript,
        duration_seconds=payload.duration_seconds,
        confidence_score=scoring_res["confidence_score"],
        fluency_score=fluency_res["fluency_score"],
        vocabulary_score=vocab_res["vocabulary_score"],
        grammar_score=grammar_res["grammar_score"],
        relevance_score=relevance_res["relevance_score"],
        filler_control_score=filler_res["filler_control_score"],
        filler_count=filler_res["filler_count"],
        words_per_minute=fluency_res["words_per_minute"]
    )
    # Set properties (handles serialization automatically)
    attempt.suggestions = suggestions
    attempt.formula_breakdown = scoring_res["formula_breakdown"]

    try:
        db.add(attempt)
        db.commit()
        db.refresh(attempt)
    except Exception as e:
        db.rollback()
        print(f"Failed to save attempt in database: {e}")

    # Return full report JSON mapping API requirements
    return {
        "attempt_id": attempt.id,
        "date": attempt.timestamp.isoformat(),
        "question_text": attempt.question_text,
        "mode": attempt.mode,
        "difficulty": attempt.difficulty,
        "transcript": attempt.transcript,
        "duration_seconds": attempt.duration_seconds,
        "confidence_score": attempt.confidence_score,
        "fluency_score": attempt.fluency_score,
        "vocabulary_score": attempt.vocabulary_score,
        "grammar_score": attempt.grammar_score,
        "relevance_score": attempt.relevance_score,
        "filler_control_score": attempt.filler_control_score,
        "filler_count": attempt.filler_count,
        "words_per_minute": attempt.words_per_minute,
        "suggestions": suggestions,
        "formula_breakdown": scoring_res["formula_breakdown"]
    }

@router.get("/history")
def get_history(db: Session = Depends(get_db)):
    attempts = db.query(Attempt).order_by(Attempt.id.desc()).all()
    
    res = []
    for a in attempts:
        res.append({
            "attempt_id": a.id,
            "date": a.timestamp.isoformat(),
            "question_text": a.question_text,
            "mode": a.mode,
            "difficulty": a.difficulty,
            "transcript": a.transcript,
            "duration_seconds": a.duration_seconds,
            "confidence_score": a.confidence_score,
            "fluency_score": a.fluency_score,
            "vocabulary_score": a.vocabulary_score,
            "grammar_score": a.grammar_score,
            "relevance_score": a.relevance_score,
            "filler_control_score": a.filler_control_score,
            "filler_count": a.filler_count,
            "words_per_minute": a.words_per_minute,
            "suggestions": a.suggestions,
            "formula_breakdown": a.formula_breakdown
        })
    return res
