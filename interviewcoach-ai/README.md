# InterviewCoach AI

InterviewCoach AI is an AI-based mock interview practice and communication assessment system. It transcribes spoken answers and scores speaking performance across five key, explainable metrics:
1. **Fluency / Pace** (Words Per Minute mapping)
2. **Vocabulary Diversity** (Unique/total word ratio & repetitions)
3. **Grammar & Sentence Structure** (LanguageTool grammar checker)
4. **Keyword Relevance** (Overlap with question expected terms)
5. **Filler Word Control** (Um, uh, like, actually, basically, you know, literally)

---

## Folder Structure

```
interviewcoach-ai/
  frontend/                  # React + Vite (Tailwind CSS, Recharts, Lucide Icons)
  backend/                   # FastAPI (SQLite database via SQLAlchemy)
  README.md
```

---

## Setup & Running the Backend

### Prerequisites
- Python 3.10+ (tested on Python 3.14)

### Installation Steps

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   # On Windows (PowerShell):
   .\venv\Scripts\Activate.ps1
   # On Linux/macOS:
   source venv/bin/activate
   ```

3. Upgrade pip and install dependencies:
   ```bash
   python -m pip install --upgrade pip
   pip install -r requirements.txt
   ```

4. Start the FastAPI development server:
   ```bash
   python main.py
   ```
   The backend server starts on **`http://127.0.0.1:8000`**. You can view the interactive swagger API documentation at `http://127.0.0.1:8000/docs`.

### Running Backend Unit Tests
With the virtual environment activated, run pytest in the `backend` folder:
```bash
python -m pytest tests/test_scoring.py
```

---

## Setup & Running the Frontend

### Prerequisites
- Node.js (version 18+ recommended)
- npm (version 9+)

### Installation Steps

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
   The frontend application is now active at **`http://localhost:5173/`**.

---



## Service Configurations & Fallbacks

### Speech-to-Text (`backend/services/speech_to_text.py`)
To offer a system that is fully demoable **with zero paid API keys** and offline resilience:
- **First Attempt**: Tries to load `faster-whisper` locally using a CPU-quantized tiny model (approx. 70MB).
- **Second Attempt**: Tries standard local `openai-whisper` package.
- **Third Attempt**: Falls back to the standard Python `SpeechRecognition` library, which calls Google's free online Speech API.
- **Final Fallback**: If offline and no local model libraries are installed, it returns a high-quality mock text representing standard HR responses to let you test the analysis workflow without crashes.

### Grammar Analysis (`backend/services/grammar_analysis.py`)
- Communicates with the public, free LanguageTool API at `https://api.languagetool.org/v2/check`.
- If the endpoint times out or is offline, the grammar score defaults to `None`, and the grading weight is dynamically redistributed across the remaining 4 metrics so the overall score continues calculation correctly.
