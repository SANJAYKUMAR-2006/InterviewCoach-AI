import os
import wave
import speech_recognition as sr

def transcribe_audio(file_path: str) -> dict:
    """
    Transcribes a WAV file and calculates the duration.
    Fallback order:
      1. faster-whisper (local offline tiny model)
      2. whisper (standard local offline tiny model)
      3. speech_recognition (online Google speech wrapper, free, no keys)
      4. Mock transcript fallback if all libraries or calls fail
    """
    # Calculate audio duration using native wave module
    duration_seconds = 0.0
    try:
        with wave.open(file_path, 'rb') as wav_file:
            frames = wav_file.getnframes()
            rate = wav_file.getframerate()
            duration_seconds = frames / float(rate)
    except Exception as e:
        print(f"Native wave duration read failed: {e}")
        # Default fallback duration estimate if file is unreadable by wave module
        duration_seconds = 10.0

    transcript = ""
    method_used = ""

    # 1. Try faster-whisper
    try:
        from faster_whisper import WhisperModel
        print("SpeechToText: Attempting faster-whisper local tiny model...")
        # Tiny model is lightweight (around 70MB)
        model = WhisperModel("tiny", device="cpu", compute_type="int8")
        segments, info = model.transcribe(file_path, beam_size=5)
        transcript = " ".join([segment.text for segment in segments])
        method_used = "faster-whisper (local)"
    except Exception as e:
        print(f"SpeechToText: faster-whisper not available: {e}")

    # 2. Try standard whisper
    if not transcript:
        try:
            import whisper
            print("SpeechToText: Attempting openai-whisper local tiny model...")
            model = whisper.load_model("tiny")
            result = model.transcribe(file_path)
            transcript = result.get("text", "")
            method_used = "openai-whisper (local)"
        except Exception as e:
            print(f"SpeechToText: openai-whisper not available: {e}")

    # 3. Try SpeechRecognition (Google API Wrapper, free, no key needed)
    if not transcript:
        try:
            print("SpeechToText: Attempting SpeechRecognition (Google Web API)...")
            r = sr.Recognizer()
            with sr.AudioFile(file_path) as source:
                audio_data = r.record(source)
            transcript = r.recognize_google(audio_data)
            method_used = "SpeechRecognition (Google API)"
        except Exception as e:
            print(f"SpeechToText: SpeechRecognition Google API failed: {e}")

    # 4. Fallback mock transcription
    if not transcript:
        print("SpeechToText: All transcription methods failed/offline. Falling back to mock text.")
        # Provide a general mock transcript that matches standard HR interview answers
        transcript = (
            "I would like to tell you about myself. I have a background in computer science "
            "and enjoy working on web development projects. My strengths include communication, "
            "teamwork, and problem solving. I am highly motivated to contribute to this company."
        )
        method_used = "Mock Fallback"

    return {
        "transcript": transcript.strip(),
        "duration_seconds": round(max(0.5, duration_seconds), 2),
        "method_used": method_used
    }
