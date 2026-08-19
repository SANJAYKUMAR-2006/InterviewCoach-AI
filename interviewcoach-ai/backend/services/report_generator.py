def generate_suggestions(
    fluency_score: float,
    vocabulary_score: float,
    relevance_score: float,
    grammar_score: float or None,
    filler_control_score: float,
    words_per_minute: float
) -> list:
    """
    Looks at the two lowest sub-scores and maps them to actionable, pre-written tips.
    Handles None grammar scores gracefully.
    """
    scores = [
        ("fluency", fluency_score),
        ("vocabulary", vocabulary_score),
        ("relevance", relevance_score),
        ("filler_control", filler_control_score)
    ]
    
    if grammar_score is not None:
        scores.append(("grammar", grammar_score))

    # Sort scores in ascending order to find the lowest ones
    scores.sort(key=lambda x: x[1])

    # Select the lowest two areas
    lowest_categories = [item[0] for item in scores[:2]]

    # Detailed suggestions map
    suggestions_map = {
        "filler_control": "Try pausing briefly instead of saying filler words like 'um', 'like', or 'actually'. A silence is better than a filler.",
        "vocabulary": "Try varying your word choice instead of repeating the same terms. Use synonyms to show your communication depth.",
        "relevance": "Make sure to mention skills, projects, and goals directly related to the question keywords to stay on-topic.",
        "grammar": "Watch out for sentence structure and spelling errors. Speak in complete sentences and review verb tenses."
    }

    # Custom fluency suggestion based on speed
    if words_per_minute < 110:
        suggestions_map["fluency"] = "Aim to speak a bit faster and keep your thoughts flowing. Try to reduce long silences (ideal: 110-160 WPM)."
    else:
        suggestions_map["fluency"] = "Aim to slow down slightly and speak in shorter sentences. Rushing can make it difficult for interviewers to follow."

    return [suggestions_map[cat] for cat in lowest_categories]
