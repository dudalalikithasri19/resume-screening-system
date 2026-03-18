from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import io
import PyPDF2
import docx
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import re

app = FastAPI(title="Resume Screening API")

# Configure CORS for the frontend Vite server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with exact frontend URL like ["http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def extract_text_from_pdf(file_bytes: bytes) -> str:
    try:
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"
        return text
    except Exception as e:
        print(f"Error reading PDF: {e}")
        return ""

def extract_text_from_docx(file_bytes: bytes) -> str:
    try:
        doc = docx.Document(io.BytesIO(file_bytes))
        text = "\n".join([para.text for para in doc.paragraphs])
        return text
    except Exception as e:
        print(f"Error reading DOCX: {e}")
        return ""

def extract_keywords(text: str) -> List[str]:
    # Simple regex based keyword extraction (words > 2 chars)
    words = re.findall(r'\b[a-zA-Z]{3,}\b', text.lower())
    return list(set(words))

@app.get("/")
async def root():
    return {"message": "Welcome to the Resume Screening API"}

@app.post("/api/v1/analyze")
async def analyze_resumes(
    job_description: str = Form(...),
    resumes: List[UploadFile] = File(...)
):
    if not job_description:
        raise HTTPException(status_code=400, detail="Job description is required")
    if not resumes:
        raise HTTPException(status_code=400, detail="At least one resume is required")

    job_desc_lower = job_description.lower()
    job_keywords = extract_keywords(job_desc_lower)
    
    results = []
    vectorizer = TfidfVectorizer(stop_words='english')
    
    for idx, resume in enumerate(resumes):
        file_content = await resume.read()
        text = ""
        
        # Extract Text
        filename_lower = resume.filename.lower()
        if filename_lower.endswith('.pdf'):
            text = extract_text_from_pdf(file_content)
        elif filename_lower.endswith('.docx') or filename_lower.endswith('.doc'):
            text = extract_text_from_docx(file_content)
        else:
            try:
                text = file_content.decode('utf-8')
            except:
                pass

        if not text.strip():
            results.append({
                "id": idx,
                "name": resume.filename,
                "score": 0,
                "matches": [],
                "missing": ["Could not extract text file content"]
            })
            continue

        resume_text_lower = text.lower()
        resume_keywords = extract_keywords(resume_text_lower)
        
        # Calculate TF-IDF Cosine Similarity
        try:
            tfidf_matrix = vectorizer.fit_transform([job_desc_lower, resume_text_lower])
            similarity_score = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
            # Convert to percentage and bump slightly for friendlier UI if non-zero
            score = round(similarity_score * 100)
            if score > 0:
                score = min(100, score + 15)
        except Exception as e:
            print(f"Error calculating similarity: {e}")
            score = 0

        # Exact keyword matching for the UI tags
        matched_skills = [kw for kw in job_keywords if kw in resume_keywords][:5] 
        missing_skills = [kw for kw in job_keywords if kw not in resume_keywords][:4] 

        # Baseline score fallback if TF-IDF similarity is very low but keywords match
        if score < 20 and len(matched_skills) > 0:
            score = min(100, len(matched_skills) * 12)

        results.append({
            "id": idx,
            "name": resume.filename,
            "score": score,
            "matches": matched_skills,
            "missing": missing_skills
        })
        
    # Sort by score descending
    results.sort(key=lambda x: x["score"], reverse=True)
        
    return results

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
