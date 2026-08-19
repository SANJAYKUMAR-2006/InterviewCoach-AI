import re

def analyze_fluency(transcript: str, duration_seconds: float) -> dict:
    """
    Computes speaking pace in words per minute (WPM).
    Ideal WPM: 110 - 160.
    Returns:
    - words_per_minute
    - fluency_score
    """
    if not transcript or not transcript.strip() or duration_seconds <= 0:
        return {
            "words_per_minute": 0.0,
            "fluency_score": 0.0
        }

    # Extract words
    words = re.findall(r"\b[a-zA-Z']+\b", transcript.strip().lower())
    word_count = len(words)

    if word_count == 0:
        return {
            "words_per_minute": 0.0,
            "fluency_score": 0.0
        }

    # Calculate WPM
    words_per_minute = (word_count / duration_seconds) * 60

    # Calculate fluency score
    if 110 <= words_per_minute <= 160:
        fluency_score = 100.0
    elif words_per_minute < 110:
        # Slow pace penalty: linear scaling down to 0 WPM (which gives 0 score)
        fluency_score = (words_per_minute / 110.0) * 100.0
    else:
        # Fast pace penalty: deduct 1 point for every 1 WPM above 160
        # E.g., WPM of 260 gives 0 score.
        fluency_score = max(0.0, 100.0 - (words_per_minute - 160.0) * 1.0)

    return {
        "words_per_minute": round(words_per_minute, 1),
        "fluency_score": round(fluency_score, 1)
    }
