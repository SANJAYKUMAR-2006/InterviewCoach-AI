import re
from collections import Counter

# Set of standard English stop words to filter out when calculating top repetitions
STOP_WORDS = {
    'the', 'a', 'an', 'and', 'or', 'but', 'if', 'then', 'else', 'to', 'of', 'in', 'on', 'at', 'by', 
    'for', 'with', 'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 
    'above', 'below', 'from', 'up', 'down', 'out', 'off', 'over', 'under', 'again', 'further', 
    'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 
    'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 
    'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'should', 'now', 'i', 'me', 'my', 
    'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 'yours', 'yourself', 'yourselves', 
    'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 'herself', 'it', 'its', 'itself', 'they', 
    'them', 'their', 'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'this', 'that', 
    'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 
    'had', 'having', 'do', 'does', 'did', 'doing', 'would', 'could', 'should'
}

def analyze_vocabulary(transcript: str) -> dict:
    """
    Analyzes lexical richness:
    - total words, unique words
    - lexical diversity (unique / total)
    - top repeated meaningful words
    - vocabulary score (scaled from lexical diversity benchmark of 0.65)
    """
    if not transcript or not transcript.strip():
        return {
            "total_words": 0,
            "unique_words": 0,
            "lexical_diversity": 0.0,
            "most_repeated_words": {},
            "vocabulary_score": 100.0
        }

    # Tokenize words
    words = re.findall(r"\b[a-zA-Z']+\b", transcript.strip().lower())
    total_words = len(words)

    if total_words == 0:
        return {
            "total_words": 0,
            "unique_words": 0,
            "lexical_diversity": 0.0,
            "most_repeated_words": {},
            "vocabulary_score": 100.0
        }

    unique_words_set = set(words)
    unique_words_count = len(unique_words_set)
    lexical_diversity = unique_words_count / total_words

    # Calculate vocabulary score
    # Benchmarked at 0.65 lexical diversity for a standard conversational response.
    # If >= 0.65, user gets 100. Otherwise, scale down.
    vocabulary_score = min(100.0, (lexical_diversity / 0.65) * 100.0)

    # Find repeated meaningful words (excluding stop words)
    meaningful_words = [w for w in words if w not in STOP_WORDS]
    
    # If no meaningful words, default back to all words to find repetitions
    words_to_count = meaningful_words if meaningful_words else words
    counter = Counter(words_to_count)
    
    # Extract words repeated 2 or more times, sorted by frequency
    repeated = {word: count for word, count in counter.most_common(5) if count > 1}

    return {
        "total_words": total_words,
        "unique_words": unique_words_count,
        "lexical_diversity": round(lexical_diversity, 4),
        "most_repeated_words": repeated,
        "vocabulary_score": round(vocabulary_score, 1)
    }
