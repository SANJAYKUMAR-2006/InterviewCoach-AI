import re

def analyze_fillers(transcript: str) -> dict:
    """
    Scans the transcript for standard filler words and calculates:
    - total filler count
    - filler density (filler count / total words)
    - filler control score (max(0, 100 - (density * 500)))
    """
    if not transcript or not transcript.strip():
        return {
            "filler_count": 0,
            "filler_density": 0.0,
            "filler_control_score": 100.0
        }

    # Normalize transcript
    clean_text = transcript.strip().lower()
    
    # Tokenize words to get count (ignoring punctuation)
    words = re.findall(r"\b[a-zA-Z']+\b", clean_text)
    total_words = len(words)
    
    if total_words == 0:
        return {
            "filler_count": 0,
            "filler_density": 0.0,
            "filler_control_score": 100.0
        }

    # Define fillers to detect
    # 'you know' is treated as a single filler phrase
    fillers = [r"\bum\b", r"\buh\b", r"\blike\b", r"\bactually\b", r"\bbasically\b", r"\bliterally\b", r"\byou\s+know\b"]
    
    filler_count = 0
    for filler in fillers:
        matches = re.findall(filler, clean_text)
        filler_count += len(matches)

    filler_density = filler_count / total_words
    # Penalty of 5 points for every 1% density (density of 0.20 = 100% penalty)
    filler_control_score = max(0.0, min(100.0, 100.0 - (filler_density * 500.0)))

    return {
        "filler_count": filler_count,
        "filler_density": round(filler_density, 4),
        "filler_control_score": round(filler_control_score, 1)
    }
