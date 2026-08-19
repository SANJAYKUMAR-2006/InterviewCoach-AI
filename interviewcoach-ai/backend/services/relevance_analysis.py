import re

def analyze_relevance(transcript: str, expected_keywords: list) -> dict:
    """
    Computes keyword matching score between transcript and expected question keywords.
    Returns:
    - matched_keywords (list of keywords found in transcript)
    - relevance_score (0-100)
    """
    if not expected_keywords:
        return {
            "matched_keywords": [],
            "relevance_score": 100.0
        }

    if not transcript or not transcript.strip():
        return {
            "matched_keywords": [],
            "relevance_score": 0.0
        }

    # Normalize transcript text
    clean_text = transcript.strip().lower()

    matched = []
    for keyword in expected_keywords:
        kw_clean = keyword.strip().lower()
        # We do a basic word boundary check or substring match.
        # Substring match is highly robust for keyword stems (e.g., "project" matching "projects").
        # Using regex to match either exact word or word root.
        pattern = re.compile(rf"\b{re.escape(kw_clean)}", re.IGNORECASE)
        if pattern.search(clean_text):
            matched.append(keyword)

    relevance_score = (len(matched) / len(expected_keywords)) * 100.0

    return {
        "matched_keywords": matched,
        "relevance_score": round(relevance_score, 1)
    }
