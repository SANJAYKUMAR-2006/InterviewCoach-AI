import requests

def analyze_grammar(transcript: str) -> dict:
    """
    Sends transcript to the public LanguageTool API to check for grammar/spelling errors.
    Returns:
    - grammar_score (None if API is unreachable, else 0-100)
    - issue_count (number of grammar/spelling issues)
    - issues (list of details for the first few issues)
    - error_note (str or None)
    """
    if not transcript or not transcript.strip():
        return {
            "grammar_score": 100.0,
            "issue_count": 0,
            "issues": [],
            "error_note": None
        }

    url = "https://api.languagetool.org/v2/check"
    data = {
        "text": transcript,
        "language": "en-US"
    }

    try:
        # Use a 4-second timeout so we don't hold up the API response if LanguageTool is slow
        response = requests.post(url, data=data, timeout=4.0)
        
        if response.status_code == 200:
            result = response.json()
            matches = result.get("matches", [])
            issue_count = len(matches)
            
            # Format and extract details for top 5 matches
            formatted_issues = []
            for match in matches[:5]:
                context_info = match.get("context", {})
                formatted_issues.append({
                    "message": match.get("message"),
                    "short_message": match.get("shortMessage", ""),
                    "context_text": context_info.get("text", ""),
                    "offset": match.get("offset"),
                    "length": match.get("length"),
                    "replacements": [rep.get("value") for rep in match.get("replacements", [])[:3]]
                })
            
            # Deduct 5 points per issue, capped at 0
            grammar_score = max(0.0, 100.0 - (issue_count * 5.0))
            
            return {
                "grammar_score": round(grammar_score, 1),
                "issue_count": issue_count,
                "issues": formatted_issues,
                "error_note": None
            }
        else:
            return {
                "grammar_score": None,
                "issue_count": 0,
                "issues": [],
                "error_note": f"LanguageTool API returned status code {response.status_code}."
            }

    except Exception as e:
        # Fall back to None without throwing an exception or crashing the app
        return {
            "grammar_score": None,
            "issue_count": 0,
            "issues": [],
            "error_note": f"LanguageTool API unreachable: {str(e)}"
        }
