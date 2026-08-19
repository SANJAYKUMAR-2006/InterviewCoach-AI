import os
import re

# Dictionary mapping common technical skills to specific question templates
SKILLS_MAP = {
    "react": { 
        "question": "Your resume highlights experience with React. Can you explain a challenging React component you designed, and how you managed state or performance optimization?", 
        "expected_keywords": ["react", "state", "component", "hooks", "performance"] 
    },
    "python": { 
        "question": "I see Python listed on your resume. Explain your experience with it, and talk about a time you had to optimize Python code or manage concurrency.", 
        "expected_keywords": ["python", "concurrency", "optimization", "library", "framework"] 
    },
    "docker": { 
        "question": "Your resume mentions Docker. How have you utilized containerization in your workflow, and what are the benefits of Docker over virtual machines?", 
        "expected_keywords": ["docker", "container", "image", "deployment", "isolate"] 
    },
    "sql": { 
        "question": "Database skills (SQL/NoSQL) are mentioned in your profile. How do you design database schemas for scalability, and how would you optimize a slow database query?", 
        "expected_keywords": ["sql", "query", "index", "database", "optimize"] 
    },
    "javascript": { 
        "question": "Your resume mentions Javascript/TypeScript. Can you discuss your understanding of asynchronous Javascript, such as promises and event loops?", 
        "expected_keywords": ["javascript", "typescript", "async", "promise", "event loop"] 
    },
    "typescript": { 
        "question": "You list TypeScript in your skills. What are the key advantages of using TypeScript over vanilla JavaScript in larger projects?", 
        "expected_keywords": ["typescript", "static", "type", "compile", "interface"] 
    },
    "node": { 
        "question": "Your resume mentions Node.js. Can you explain how Node.js handles concurrent client requests using its event-driven non-blocking I/O model?", 
        "expected_keywords": ["node", "event-driven", "non-blocking", "asynchronous", "express"] 
    },
    "aws": { 
        "question": "You have listed AWS (Amazon Web Services) experience. Can you describe the architecture of an application you deployed to AWS, including services used?", 
        "expected_keywords": ["aws", "cloud", "s3", "ec2", "deployment"] 
    },
    "kubernetes": { 
        "question": "Your resume lists Kubernetes. Can you explain your experience with container orchestration and how Kubernetes manages pods and scaling?", 
        "expected_keywords": ["kubernetes", "orchestration", "pod", "scaling", "deployment"] 
    },
    "machine learning": { 
        "question": "I see Machine Learning listed on your resume. Can you describe a model you built, how you evaluated its performance, and how you prepared the data?", 
        "expected_keywords": ["machine learning", "model", "data", "accuracy", "training"] 
    },
    "git": { 
        "question": "You list Git/version control. How do you handle branching strategies (like Git Flow) and resolve merge conflicts in a team environment?", 
        "expected_keywords": ["git", "branch", "merge", "conflict", "commit"] 
    }
}

def parse_resume_and_generate_questions(file_path: str) -> list:
    """
    Parses a PDF or TXT resume and generates a list of custom interview questions based on its content.
    """
    text = ""
    ext = os.path.splitext(file_path)[1].lower()

    if ext == ".pdf":
        try:
            from pypdf import PdfReader
            reader = PdfReader(file_path)
            for page in reader.pages:
                text += page.extract_text() or ""
        except Exception as e:
            print(f"ResumeParser: PDF text extraction failed: {e}")
            text = ""
    else:
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                text = f.read()
        except Exception as e:
            print(f"ResumeParser: TXT text read failed: {e}")
            text = ""

    # Normalize text for simple parsing
    text_lower = text.lower()
    matched_questions = []

    # 1. Scan for technology skill keyword matches
    for skill, item in SKILLS_MAP.items():
        pattern = re.compile(rf"\b{re.escape(skill)}\b", re.IGNORECASE)
        if pattern.search(text_lower):
            matched_questions.append(item.copy())

    # 2. Look for project names under standard Project headers
    projects_found = []
    project_headers = ["projects", "personal projects", "academic projects", "key projects", "experience"]
    lines = text.split("\n")
    is_project_section = False

    for line in lines:
        clean_line = line.strip().lower()
        # Toggle section check
        if any(header in clean_line for header in project_headers) and len(clean_line) < 30:
            is_project_section = True
            continue

        # Disable section check if another section heading is encountered
        if is_project_section and any(header in clean_line for header in ["skills", "education", "certificates", "awards", "languages"]):
            is_project_section = False

        if is_project_section and line.strip():
            # Match list-based items containing possible project names (capitalized terms, short lines)
            match = re.match(r"^[\-\*\u2022\d\.\s]+([a-zA-Z0-9\s]{4,25})", line.strip())
            if match:
                proj_title = match.group(1).strip()
                # Exclude bullets containing common descriptive verbs
                if len(proj_title) > 4 and not any(verb in proj_title.lower() for verb in ["developed", "worked", "created", "built", "implemented", "using"]):
                    projects_found.append(proj_title)
                    if len(projects_found) >= 2:  # Capture top 2 projects
                        break

    # Append project-specific question templates
    for proj in projects_found:
        matched_questions.append({
            "question": f"Your resume mentions the project '{proj}'. Can you describe the project's architecture, your specific role, and the technical decisions you made during development?",
            "expected_keywords": [proj.lower(), "architecture", "decisions", "role", "tech stack"]
        })

    # 3. Fallback generic questions
    fallback_questions = [
        {
            "question": "Based on the projects and experience in your resume, can you describe a time when you encountered a technical blocker and how you resolved it?",
            "expected_keywords": ["project", "blocker", "resolution", "problem", "learned"]
        },
        {
            "question": "How do your skills and projects listed in your resume align with the role of a professional software engineer?",
            "expected_keywords": ["skills", "projects", "alignment", "role", "goals"]
        }
    ]

    # Combine questions, ensuring custom matches take priority
    all_questions = matched_questions + fallback_questions
    
    # Format questions as standard question bank entries and limit to 5
    final_questions = []
    for idx, q in enumerate(all_questions[:5]):
        final_questions.append({
            "id": 10001 + idx,
            "mode": "Resume Mode",
            "difficulty": "Medium",
            "question": q["question"],
            "expected_keywords": q["expected_keywords"]
        })

    return final_questions
