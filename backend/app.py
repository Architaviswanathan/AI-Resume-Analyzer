from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import tempfile
from werkzeug.utils import secure_filename
import pdfplumber
import docx
import nltk
from nltk.corpus import stopwords
import string
import re
from sentence_transformers import SentenceTransformer, util
import spacy
import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse

app = Flask(__name__)
CORS(app)

# Download required NLTK data
try:
    nltk.data.find('tokenizers/punkt')
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('punkt')
    nltk.download('stopwords')

# Load models
try:
    model = SentenceTransformer('all-MiniLM-L6-v2')
    nlp = spacy.load("en_core_web_sm")
except OSError:
    print("Please install spacy model: python -m spacy download en_core_web_sm")
    model = None
    nlp = None

# Configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf', 'docx'}
JD_ALLOWED_EXTENSIONS = {'pdf', 'txt'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Comprehensive skills list
SKILLS_DATABASE = [
    'python', 'java', 'javascript', 'react', 'node.js', 'sql', 'mongodb', 'mysql',
    'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'scikit-learn',
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'git', 'ci/cd', 'jenkins',
    'html', 'css', 'typescript', 'angular', 'vue.js', 'flask', 'django', 'fastapi',
    'data analysis', 'data science', 'pandas', 'numpy', 'matplotlib', 'tableau',
    'project management', 'agile', 'scrum', 'leadership', 'communication',
    'problem solving', 'teamwork', 'critical thinking', 'time management',
    'rest api', 'graphql', 'microservices', 'devops', 'linux', 'unix',
    'c++', 'c#', '.net', 'php', 'ruby', 'swift', 'kotlin', 'scala', 'go',
    'postgresql', 'redis', 'elasticsearch', 'hadoop', 'spark', 'kafka',
    'natural language processing', 'computer vision', 'ai', 'ml', 'nlp', 'cv',
    'blockchain', 'web3', 'cryptocurrency', 'cybersecurity', 'networking'
]

def allowed_file(filename, allowed_set):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_set

def is_valid_url(url):
    try:
        result = urlparse(url)
        return all([result.scheme, result.netloc])
    except:
        return False

def scrape_job_description(url):
    """Scrape job description from URL"""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Remove script and style elements
        for script in soup(["script", "style"]):
            script.decompose()
        
        # Try to find main content areas
        text_content = ""
        
        # Common job description selectors
        selectors = [
            'div.job-description',
            'div.description',
            'div.job-details',
            'div.job-content',
            'section.job-description',
            'article',
            'main',
            'div.content',
            'div.description-text'
        ]
        
        for selector in selectors:
            elements = soup.select(selector)
            if elements:
                text_content = ' '.join([elem.get_text(strip=True) for elem in elements])
                break
        
        # Fallback to body text if no specific content found
        if not text_content:
            text_content = soup.get_text(strip=True)
        
        # Clean up text
        lines = (line.strip() for line in text_content.splitlines())
        chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
        text_content = ' '.join(chunk for chunk in chunks if chunk)
        
        return text_content[:10000]  # Limit to 10000 characters
        
    except Exception as e:
        print(f"Error scraping URL {url}: {e}")
        return None

def extract_text_from_txt(file_path):
    """Extract text from TXT file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            return file.read()
    except UnicodeDecodeError:
        try:
            with open(file_path, 'r', encoding='latin-1') as file:
                return file.read()
        except Exception as e:
            print(f"Error reading TXT file: {e}")
            return ""
    except Exception as e:
        print(f"Error reading TXT file: {e}")
        return ""

def extract_text_from_pdf(file_path):
    text = ""
    try:
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
    except Exception as e:
        print(f"Error extracting PDF: {e}")
        return ""
    return text

def extract_text_from_docx(file_path):
    text = ""
    try:
        doc = docx.Document(file_path)
        for paragraph in doc.paragraphs:
            text += paragraph.text + "\n"
    except Exception as e:
        print(f"Error extracting DOCX: {e}")
        return ""
    return text

def preprocess_text(text):
    """Clean and preprocess text"""
    text = text.lower()
    # Remove special characters but keep spaces
    text = re.sub(r'[^a-zA-Z0-9\s]', ' ', text)
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def extract_skills(text):
    """Extract skills from text using keyword matching"""
    text_lower = text.lower()
    found_skills = []
    
    for skill in SKILLS_DATABASE:
        # Check for whole word matches
        pattern = r'\b' + re.escape(skill) + r'\b'
        if re.search(pattern, text_lower):
            found_skills.append(skill)
    
    return list(set(found_skills))

def calculate_semantic_similarity(resume_text, jd_text):
    """Calculate semantic similarity using sentence transformers"""
    if model is None:
        return 0.0
    
    try:
        # Truncate text if too long (model has token limits)
        max_length = 8000
        resume_truncated = resume_text[:max_length] if len(resume_text) > max_length else resume_text
        jd_truncated = jd_text[:max_length] if len(jd_text) > max_length else jd_text
        
        # Generate embeddings
        resume_embedding = model.encode(resume_truncated, convert_to_tensor=True)
        jd_embedding = model.encode(jd_truncated, convert_to_tensor=True)
        
        # Calculate cosine similarity
        similarity_score = util.cos_sim(resume_embedding, jd_embedding)
        return float(similarity_score[0][0]) * 100
    except Exception as e:
        print(f"Error calculating semantic similarity: {e}")
        return 0.0

def generate_detailed_analysis(resume_text, jd_text, match_score, matched_skills, missing_skills, resume_skills, jd_skills):
    """Generate detailed analysis with specific improvement recommendations"""
    
    analysis = {
        "low_score_reasons": [],
        "improvement_recommendations": [],
        "learning_paths": [],
        "experience_analysis": {},
        "skill_gap_analysis": {},
        "priority_actions": []
    }
    
    # Analyze why score is low
    if match_score < 40:
        analysis["low_score_reasons"].append("Critical skill mismatch - less than 40% of required skills found")
        analysis["low_score_reasons"].append("Significant experience gap detected")
        analysis["low_score_reasons"].append("Resume content doesn't align with job requirements")
    elif match_score < 60:
        analysis["low_score_reasons"].append("Moderate skill gap - several key skills missing")
        analysis["low_score_reasons"].append("Experience level may not meet requirements")
        analysis["low_score_reasons"].append("Resume needs better alignment with job description")
    elif match_score < 80:
        analysis["low_score_reasons"].append("Minor skill gaps - some specific skills missing")
        analysis["low_score_reasons"].append("Resume could be better optimized for this role")
    
    # Skill gap analysis
    skill_gap_ratio = len(missing_skills) / len(jd_skills) if jd_skills else 0
    analysis["skill_gap_analysis"] = {
        "missing_skills_count": len(missing_skills),
        "required_skills_count": len(jd_skills),
        "gap_percentage": round(skill_gap_ratio * 100, 1),
        "critical_missing": identify_critical_skills(missing_skills),
        "easily_acquirable": identify_easily_acquirable_skills(missing_skills)
    }
    
    # Experience level analysis
    analysis["experience_analysis"] = analyze_experience_level(resume_text, jd_text)
    
    # Generate specific improvement recommendations
    analysis["improvement_recommendations"] = generate_improvement_recommendations(
        missing_skills, matched_skills, resume_text, jd_text, match_score
    )
    
    # Generate learning paths
    analysis["learning_paths"] = generate_learning_paths(missing_skills)
    
    # Priority actions
    analysis["priority_actions"] = generate_priority_actions(
        missing_skills, match_score, analysis["skill_gap_analysis"]
    )
    
    return analysis

def identify_critical_skills(missing_skills):
    """Identify critical skills that are commonly required"""
    critical_keywords = [
        'python', 'java', 'javascript', 'react', 'node.js', 'sql', 
        'aws', 'azure', 'docker', 'kubernetes', 'machine learning',
        'data analysis', 'project management', 'agile', 'scrum'
    ]
    
    return [skill for skill in missing_skills 
            if any(keyword in skill.lower() for keyword in critical_keywords)]

def identify_easily_acquirable_skills(missing_skills):
    """Identify skills that can be learned relatively quickly"""
    easy_skills = [
        'git', 'rest api', 'html', 'css', 'json', 'xml', 'linux',
        'communication', 'teamwork', 'problem solving', 'time management'
    ]
    
    return [skill for skill in missing_skills 
            if any(keyword in skill.lower() for keyword in easy_skills)]

def analyze_experience_level(resume_text, jd_text):
    """Analyze experience level from resume and job description"""
    
    # Extract years of experience
    resume_exp = extract_years_of_experience(resume_text)
    jd_exp = extract_years_of_experience(jd_text)
    
    analysis = {
        "resume_experience": resume_exp,
        "required_experience": jd_exp,
        "experience_gap": max(0, jd_exp - resume_exp) if jd_exp and resume_exp else None,
        "seniority_level": estimate_seniority_level(resume_text),
        "required_seniority": estimate_seniority_level(jd_text)
    }
    
    if jd_exp and resume_exp and resume_exp < jd_exp:
        analysis["gap_description"] = f"Missing {jd_exp - resume_exp} years of required experience"
    elif not resume_exp:
        analysis["gap_description"] = "Experience level not clearly specified in resume"
    
    return analysis

def extract_years_of_experience(text):
    """Extract years of experience from text"""
    import re
    
    # Look for patterns like "5 years of experience", "5+ years", etc.
    patterns = [
        r'(\d+)\+?\s*years?\s*(?:of\s*)?(?:experience|work)',
        r'experience\s*:?\s*(\d+)\+?\s*years?',
        r'(\d+)\s*years?\s*(?:of\s*)?professional\s*experience',
        r'worked\s*(?:for\s*)?(\d+)\+?\s*years?'
    ]
    
    years = []
    for pattern in patterns:
        matches = re.findall(pattern, text.lower())
        years.extend([int(match) for match in matches if match.isdigit()])
    
    return max(years) if years else None

def estimate_seniority_level(text):
    """Estimate seniority level from text keywords"""
    text_lower = text.lower()
    
    senior_keywords = ['senior', 'lead', 'principal', 'staff', 'head', 'director', 'vp', 'chief']
    junior_keywords = ['junior', 'entry', 'associate', 'intern', 'trainee', 'beginner']
    mid_keywords = ['mid', 'intermediate', 'experienced', 'professional']
    
    if any(keyword in text_lower for keyword in senior_keywords):
        return 'senior'
    elif any(keyword in text_lower for keyword in junior_keywords):
        return 'junior'
    elif any(keyword in text_lower for keyword in mid_keywords):
        return 'mid'
    else:
        return 'unspecified'

def generate_improvement_recommendations(missing_skills, matched_skills, resume_text, jd_text, match_score):
    """Generate specific improvement recommendations"""
    
    recommendations = []
    
    # Skill-based recommendations
    if missing_skills:
        critical_missing = identify_critical_skills(missing_skills)
        if critical_missing:
            recommendations.append({
                "category": "Critical Skills",
                "priority": "high",
                "items": [
                    f"Focus on acquiring: {', '.join(critical_missing[:3])}",
                    "These skills are mentioned multiple times in the job description",
                    "Consider online courses or certifications for these technologies"
                ]
            })
        
        easy_missing = identify_easily_acquirable_skills(missing_skills)
        if easy_missing:
            recommendations.append({
                "category": "Quick Wins", 
                "priority": "medium",
                "items": [
                    f"Add these skills to highlight: {', '.join(easy_missing[:3])}",
                    "These can be learned quickly and will improve your match score",
                    "Update your resume to include any experience with these skills"
                ]
            })
    
    # Content-based recommendations
    if len(resume_text.split()) < 300:
        recommendations.append({
            "category": "Resume Content",
            "priority": "high", 
            "items": [
                "Your resume appears too brief - add more detail about your experience",
                "Include specific projects and achievements with metrics",
                "Expand on your technical skills and methodologies used"
            ]
        })
    
    # Experience-based recommendations
    if match_score < 60:
        recommendations.append({
            "category": "Experience Alignment",
            "priority": "high",
            "items": [
                "Tailor your resume to match the job description more closely",
                "Use similar terminology and keywords from the job posting",
                "Highlight relevant projects and achievements that match requirements"
            ]
        })
    
    # Format and structure recommendations
    if 'education' not in resume_text.lower():
        recommendations.append({
            "category": "Resume Structure",
            "priority": "medium",
            "items": [
                "Add your education background to your resume",
                "Include relevant certifications and training"
            ]
        })
    
    return recommendations

def generate_learning_paths(missing_skills):
    """Generate learning path suggestions for missing skills"""
    
    learning_resources = {
        'python': {
            "difficulty": "Beginner to Intermediate",
            "time_estimate": "2-3 months",
            "resources": [
                "Python.org official tutorial",
                "Coursera: Python for Everybody",
                "Udemy: Complete Python Bootcamp",
                "Practice: Build small projects and solve coding challenges"
            ]
        },
        'react': {
            "difficulty": "Intermediate",
            "time_estimate": "2-4 months", 
            "resources": [
                "React.js official documentation",
                "freeCodeCamp: React Course",
                "Udemy: Modern React with Redux",
                "Practice: Build a full-stack web application"
            ]
        },
        'aws': {
            "difficulty": "Intermediate to Advanced",
            "time_estimate": "3-6 months",
            "resources": [
                "AWS Training and Certification",
                "A Cloud Guru courses",
                "AWS Free Tier for hands-on practice",
                "Target: AWS Cloud Practitioner or Solutions Architect certification"
            ]
        },
        'docker': {
            "difficulty": "Intermediate",
            "time_estimate": "1-2 months",
            "resources": [
                "Docker official documentation",
                "Play with Docker interactive tutorials",
                "Udemy: Docker Mastery",
                "Practice: Containerize your existing applications"
            ]
        },
        'kubernetes': {
            "difficulty": "Advanced",
            "time_estimate": "3-4 months",
            "resources": [
                "Kubernetes official documentation",
                "CNCF training materials",
                "Udemy: Kubernetes for Developers",
                "Practice: Deploy applications on minikube or cloud Kubernetes"
            ]
        },
        'machine learning': {
            "difficulty": "Advanced",
            "time_estimate": "6-12 months",
            "resources": [
                "Coursera: Machine Learning by Andrew Ng",
                "Fast.ai practical deep learning course",
                "Books: 'Hands-On Machine Learning' by Aurélien Géron",
                "Practice: Kaggle competitions and personal projects"
            ]
        },
        'sql': {
            "difficulty": "Beginner",
            "time_estimate": "1-2 months",
            "resources": [
                "SQLBolt interactive tutorials",
                "LeetCode SQL problems",
                "Mode Analytics SQL tutorial",
                "Practice: Design and query databases for your projects"
            ]
        }
    }
    
    learning_paths = []
    
    for skill in missing_skills[:5]:  # Focus on top 5 missing skills
        skill_lower = skill.lower()
        matched_resource = None
        
        # Find matching learning resources
        for key, resource in learning_resources.items():
            if key in skill_lower or skill_lower in key:
                matched_resource = resource
                matched_resource["skill"] = skill
                break
        
        if matched_resource:
            learning_paths.append(matched_resource)
        else:
            # Generic learning path for unknown skills
            learning_paths.append({
                "skill": skill,
                "difficulty": "Varies",
                "time_estimate": "2-6 months",
                "resources": [
                    f"Search for '{skill}' tutorials on YouTube and Udemy",
                    "Look for official documentation and community forums",
                    "Find hands-on projects to practice the skill",
                    "Consider industry-recognized certifications if available"
                ]
            })
    
    return learning_paths

def generate_priority_actions(missing_skills, match_score, skill_gap_analysis):
    """Generate priority action items"""
    
    actions = []
    
    if match_score < 40:
        actions.append({
            "priority": "Immediate",
            "action": "Focus on acquiring 2-3 critical missing skills",
            "reason": "Your match score is quite low - immediate skill development needed"
        })
    
    if skill_gap_analysis.get("gap_percentage", 0) > 50:
        actions.append({
            "priority": "High",
            "action": "Consider if this role is the right fit for your current skill level",
            "reason": "More than half of required skills are missing"
        })
    
    critical_missing = identify_critical_skills(missing_skills)
    if critical_missing:
        actions.append({
            "priority": "High",
            "action": f"Prioritize learning: {', '.join(critical_missing[:2])}",
            "reason": "These are critical skills frequently mentioned in job descriptions"
        })
    
    easy_missing = identify_easily_acquirable_skills(missing_skills)
    if easy_missing:
        actions.append({
            "priority": "Medium",
            "action": f"Quick wins: Add {', '.join(easy_missing[:2])} to your skill set",
            "reason": "These skills can be learned quickly and will improve your match score"
        })
    
    actions.append({
        "priority": "Medium",
        "action": "Update your resume to better highlight your existing relevant skills",
        "reason": "Better presentation can improve your match score even without new skills"
    })
    
    return actions

@app.route('/api/analyze', methods=['POST'])
def analyze_resume():
    try:
        # Check if resume file was uploaded
        if 'resume' not in request.files:
            return jsonify({'error': 'No resume file uploaded'}), 400
        
        resume_file = request.files['resume']
        jd_input_type = request.form.get('jd_input_type', 'text')  # text, file, or url
        
        if resume_file.filename == '':
            return jsonify({'error': 'No resume file selected'}), 400
        
        if not allowed_file(resume_file.filename, ALLOWED_EXTENSIONS):
            return jsonify({'error': 'Resume file type not supported. Please upload PDF or DOCX files only.'}), 400
        
        # Get job description based on input type
        job_description = ""
        
        if jd_input_type == 'text':
            job_description = request.form.get('job_description', '')
            if not job_description.strip():
                return jsonify({'error': 'Job description text is required'}), 400
                
        elif jd_input_type == 'file':
            if 'jd_file' not in request.files:
                return jsonify({'error': 'No job description file uploaded'}), 400
            
            jd_file = request.files['jd_file']
            if jd_file.filename == '':
                return jsonify({'error': 'No job description file selected'}), 400
            
            if not allowed_file(jd_file.filename, JD_ALLOWED_EXTENSIONS):
                return jsonify({'error': 'Job description file type not supported. Please upload PDF or TXT files only.'}), 400
            
            # Save JD file temporarily
            jd_filename = secure_filename(jd_file.filename)
            temp_dir = tempfile.mkdtemp()
            jd_file_path = os.path.join(temp_dir, jd_filename)
            jd_file.save(jd_file_path)
            
            try:
                if jd_filename.lower().endswith('.pdf'):
                    job_description = extract_text_from_pdf(jd_file_path)
                else:  # TXT file
                    job_description = extract_text_from_txt(jd_file_path)
                
                if not job_description.strip():
                    return jsonify({'error': 'Could not extract text from the job description file'}), 400
            finally:
                # Clean up temporary JD file
                try:
                    os.remove(jd_file_path)
                    os.rmdir(temp_dir)
                except:
                    pass
                    
        elif jd_input_type == 'url':
            job_url = request.form.get('job_url', '').strip()
            if not job_url:
                return jsonify({'error': 'Job URL is required'}), 400
            
            if not is_valid_url(job_url):
                return jsonify({'error': 'Invalid URL provided'}), 400
            
            job_description = scrape_job_description(job_url)
            if not job_description:
                return jsonify({'error': 'Could not extract job description from the provided URL'}), 400
            
            if not job_description.strip():
                return jsonify({'error': 'No content found at the provided URL'}), 400
        
        else:
            return jsonify({'error': 'Invalid job description input type'}), 400
        
        # Save resume file temporarily
        resume_filename = secure_filename(resume_file.filename)
        temp_dir = tempfile.mkdtemp()
        resume_file_path = os.path.join(temp_dir, resume_filename)
        resume_file.save(resume_file_path)
        
        try:
            # Extract text from resume
            if resume_filename.lower().endswith('.pdf'):
                resume_text = extract_text_from_pdf(resume_file_path)
            else:
                resume_text = extract_text_from_docx(resume_file_path)
            
            if not resume_text.strip():
                return jsonify({'error': 'Could not extract text from the uploaded resume file'}), 400
            
            # Preprocess texts
            resume_processed = preprocess_text(resume_text)
            jd_processed = preprocess_text(job_description)
            
            # Calculate similarity score
            similarity_score = calculate_semantic_similarity(resume_processed, jd_processed)
            
            # Extract skills
            resume_skills = extract_skills(resume_processed)
            jd_skills = extract_skills(jd_processed)
            
            # Find matched and missing skills
            matched_skills = list(set(resume_skills) & set(jd_skills))
            missing_skills = list(set(jd_skills) - set(resume_skills))
            
            # Generate detailed analysis
            detailed_analysis = generate_detailed_analysis(
                resume_text, job_description, similarity_score, 
                matched_skills, missing_skills, resume_skills, jd_skills
            )
            
            # Prepare response
            result = {
                'match_score': round(similarity_score, 2),
                'matched_skills': sorted(matched_skills),
                'missing_skills': sorted(missing_skills),
                'resume_skills': sorted(resume_skills),
                'jd_skills': sorted(jd_skills),
                'detailed_analysis': detailed_analysis,
                'resume_text_length': len(resume_text),
                'jd_text_length': len(job_description),
                'jd_input_type': jd_input_type,
                'jd_source': job_url if jd_input_type == 'url' else f'{jd_input_type}_input'
            }
            
            return jsonify(result)
            
        finally:
            # Clean up temporary files
            try:
                os.remove(resume_file_path)
                os.rmdir(temp_dir)
            except:
                pass
    
    except Exception as e:
        return jsonify({'error': f'An error occurred during analysis: {str(e)}'}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'models_loaded': model is not None and nlp is not None})

if __name__ == '__main__':
    # Create uploads directory if it doesn't exist
    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.makedirs(app.config['UPLOAD_FOLDER'])
    
    app.run(debug=True, host='0.0.0.0', port=5000)
