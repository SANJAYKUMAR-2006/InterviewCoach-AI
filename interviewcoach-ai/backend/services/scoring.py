def calculate_final_score(
    fluency_score: float,
    vocabulary_score: float,
    relevance_score: float,
    grammar_score: float or None,
    filler_control_score: float
) -> dict:
    """
    Combines 5 sub-scores into a final overall score (0-100).
    Formula:
      confidence_score = 0.30 * fluency + 0.20 * vocabulary + 0.20 * relevance + 0.15 * grammar + 0.15 * filler_control
    
    If grammar_score is None, it adjusts weights dynamically:
      fluency: 30/85 ≈ 0.3529
      vocabulary: 20/85 ≈ 0.2353
      relevance: 20/85 ≈ 0.2353
      filler_control: 15/85 ≈ 0.1765
    """
    default_weights = {
        "fluency": 0.30,
        "vocabulary": 0.20,
        "relevance": 0.20,
        "grammar": 0.15,
        "filler_control": 0.15
    }

    if grammar_score is not None:
        # Standard scoring
        confidence_score = (
            default_weights["fluency"] * fluency_score +
            default_weights["vocabulary"] * vocabulary_score +
            default_weights["relevance"] * relevance_score +
            default_weights["grammar"] * grammar_score +
            default_weights["filler_control"] * filler_control_score
        )
        
        formula_str = (
            f"0.30 * fluency ({fluency_score}) + "
            f"0.20 * vocabulary ({vocabulary_score}) + "
            f"0.20 * relevance ({relevance_score}) + "
            f"0.15 * grammar ({grammar_score}) + "
            f"0.15 * filler_control ({filler_control_score})"
        )
        
        weights_used = default_weights
    else:
        # Adjusted scoring without grammar
        remaining_sum = 0.30 + 0.20 + 0.20 + 0.15 # 0.85
        adj_fluency = round(0.30 / remaining_sum, 4)
        adj_vocab = round(0.20 / remaining_sum, 4)
        adj_relevance = round(0.20 / remaining_sum, 4)
        adj_filler = round(0.15 / remaining_sum, 4)

        confidence_score = (
            adj_fluency * fluency_score +
            adj_vocab * vocabulary_score +
            adj_relevance * relevance_score +
            adj_filler * filler_control_score
        )

        formula_str = (
            f"LanguageTool offline. Adjusted formula: "
            f"{adj_fluency} * fluency ({fluency_score}) + "
            f"{adj_vocab} * vocabulary ({vocabulary_score}) + "
            f"{adj_relevance} * relevance ({relevance_score}) + "
            f"{adj_filler} * filler_control ({filler_control_score})"
        )

        weights_used = {
            "fluency": adj_fluency,
            "vocabulary": adj_vocab,
            "relevance": adj_relevance,
            "grammar": 0.0,
            "filler_control": adj_filler
        }

    return {
        "confidence_score": round(confidence_score, 1),
        "formula_breakdown": {
            "weights": weights_used,
            "formula_description": "Standard Weighted Average" if grammar_score is not None else "Adjusted Weighted Average (Grammar Excluded)",
            "calculation_string": formula_str
        }
    }
