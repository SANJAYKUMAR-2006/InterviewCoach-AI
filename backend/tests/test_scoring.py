import pytest
from services.scoring import calculate_final_score
from services.filler_analysis import analyze_fillers
from services.fluency_analysis import analyze_fluency
from services.vocabulary_analysis import analyze_vocabulary
from services.relevance_analysis import analyze_relevance

def test_standard_scoring_calculation():
    # Test overall confidence score with standard scores
    res = calculate_final_score(
        fluency_score=90.0,
        vocabulary_score=80.0,
        relevance_score=100.0,
        grammar_score=95.0,
        filler_control_score=85.0
    )
    
    # 0.30*90 + 0.20*80 + 0.20*100 + 0.15*95 + 0.15*85
    # = 27 + 16 + 20 + 14.25 + 12.75 = 90.0
    assert res["confidence_score"] == 90.0
    assert res["formula_breakdown"]["formula_description"] == "Standard Weighted Average"
    assert res["formula_breakdown"]["weights"]["grammar"] == 0.15


def test_missing_grammar_score_adjustment():
    # Test dynamic weight adjustment when grammar score is None
    res = calculate_final_score(
        fluency_score=90.0,
        vocabulary_score=80.0,
        relevance_score=100.0,
        grammar_score=None,
        filler_control_score=85.0
    )
    
    # Weights sum to 0.85. Adjusted weights:
    # fluency = 0.30 / 0.85 ≈ 0.3529
    # vocabulary = 0.20 / 0.85 ≈ 0.2353
    # relevance = 0.20 / 0.85 ≈ 0.2353
    # filler_control = 0.15 / 0.85 ≈ 0.1765
    # Expected: 0.3529*90 + 0.2353*80 + 0.2353*100 + 0.1765*85
    # = 31.761 + 18.824 + 23.53 + 15.0025 = 89.1175 -> round to 1 decimal = 89.1
    assert res["confidence_score"] == 89.1
    assert res["formula_breakdown"]["formula_description"] == "Adjusted Weighted Average (Grammar Excluded)"
    assert res["formula_breakdown"]["weights"]["grammar"] == 0.0


def test_filler_analysis_logic():
    # Transcript with high density of filler words
    transcript = "Um, actually, I am like preparing for the, you know, interview."
    # Total words: "um" (1), "actually" (2), "i" (3), "am" (4), "like" (5), "preparing" (6), "for" (7), "the" (8), "you" (9), "know" (10), "interview" (11).
    # Total word tokens: 11
    # Fillers matched: um, actually, like, you know
    # Count: 4. Density: 4/11 ≈ 0.3636.
    # Score = 100 - (0.3636 * 500) = 100 - 181.8 = -81.8 -> max(0, -81.8) = 0.0
    res = analyze_fillers(transcript)
    assert res["filler_count"] == 4
    assert res["filler_control_score"] == 0.0

    # Transcript with zero filler words
    transcript_clean = "I am a computer science student with strong programming skills."
    res_clean = analyze_fillers(transcript_clean)
    assert res_clean["filler_count"] == 0
    assert res_clean["filler_control_score"] == 100.0


def test_fluency_pace_scoring():
    # Speaking speed within the ideal range: 125 WPM
    # 25 words in 12 seconds = (25 / 12) * 60 = 125 WPM
    transcript = "I have worked on several frontend applications using React and Tailwind CSS for my academic project which went very well and the client was happy."
    res = analyze_fluency(transcript, 12.0)
    assert res["words_per_minute"] == 125.0
    assert res["fluency_score"] == 100.0

    # Speaking too fast: 200 WPM
    # 40 words in 12 seconds = (40 / 12) * 60 = 200 WPM
    # Score = 100 - (200 - 160) * 1.0 = 60.0
    res_fast = analyze_fluency("word " * 40, 12.0)
    assert res_fast["words_per_minute"] == 200.0
    assert res_fast["fluency_score"] == 60.0


def test_vocabulary_diversity():
    # Repetitive transcript
    transcript = "I love code because code is my code code is nice"
    # Words: I (1), love (1), code (4), because (1), is (2), my (1), nice (1)
    # Total: 11 words. Unique: 7. Lexical diversity = 7/11 ≈ 0.636
    res = analyze_vocabulary(transcript)
    assert "code" in res["most_repeated_words"]
    assert res["total_words"] == 11
    assert res["vocabulary_score"] < 100.0


def test_relevance_keyword_matching():
    expected = ["skills", "experience", "team", "project"]
    transcript = "I have developed my skills through college projects and team collaboration."
    # Matches: skills, project, team -> 3 out of 4 = 75.0
    res = analyze_relevance(transcript, expected)
    assert len(res["matched_keywords"]) == 3
    assert res["relevance_score"] == 75.0
