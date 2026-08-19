const BASE_URL = 'http://127.0.0.1:8000';

/**
 * Initiates the interview session by picking a question matching the mode and difficulty.
 */
export async function startInterview(mode, difficulty) {
  const response = await fetch(`${BASE_URL}/interview/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mode, difficulty }),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.detail || 'Failed to start interview.');
  }
  return response.json();
}

/**
 * Uploads WAV audio Blob to the speech-to-text transcriber service.
 */
export async function submitAudio(audioBlob) {
  const formData = new FormData();
  // Name the uploaded file 'audio.wav' so the backend knows to treat it as WAV
  formData.append('file', audioBlob, 'audio.wav');

  const response = await fetch(`${BASE_URL}/interview/submit-audio`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.detail || 'Audio transcription failed.');
  }
  return response.json();
}

/**
 * Sends the final transcript, duration, and question ID for multi-dimensional grading.
 */
export async function analyzeInterview(questionId, transcript, durationSeconds) {
  const response = await fetch(`${BASE_URL}/interview/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      question_id: parseInt(questionId, 10),
      transcript,
      duration_seconds: parseFloat(durationSeconds)
    }),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.detail || 'Analysis service failed.');
  }
  return response.json();
}

/**
 * Retrieves the full SQLite attempt logs history.
 */
export async function getHistory() {
  const response = await fetch(`${BASE_URL}/history`);
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.detail || 'Failed to retrieve history logs.');
  }
  return response.json();
}

/**
 * Uploads a PDF/TXT resume and returns generated customized mock interview questions.
 */
export async function uploadResume(resumeFile) {
  const formData = new FormData();
  formData.append('file', resumeFile);

  const response = await fetch(`${BASE_URL}/interview/upload-resume`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.detail || 'Failed to parse resume.');
  }
  return response.json();
}
