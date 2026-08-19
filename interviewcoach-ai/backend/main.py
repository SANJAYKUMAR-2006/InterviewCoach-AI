import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models.database import init_db
from routes.interview import router as interview_router

app = FastAPI(
    title="InterviewCoach AI API",
    description="Backend API for speech transcription, communication skill analysis, and history tracking."
)

# Enable CORS for the React frontend (running on port 5173 by default)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for easy development and demos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database schemas
@app.on_event("startup")
def on_startup():
    init_db()
    print("Database tables initialized successfully.")

# Register interview routes
app.include_router(interview_router)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "InterviewCoach AI API",
        "documentation": "/docs"
    }

if __name__ == "__main__":
    # Start uvicorn server locally on port 8000
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
