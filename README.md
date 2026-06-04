<<<<<<< HEAD
# AI Resume Analyzer

A professional web application that analyzes resumes against job descriptions using advanced NLP and machine learning techniques.

## Features

- **Smart Text Extraction**: Extracts text from PDF and DOCX files
- **AI-Powered Analysis**: Uses sentence transformers for semantic similarity
- **Skill Matching**: Identifies matched and missing skills
- **Professional UI**: Clean, modern interface with Tailwind CSS
- **Real-time Feedback**: Instant analysis with detailed suggestions
- **Comprehensive Results**: Match scores, skill breakdown, and improvement suggestions

## Tech Stack

### Backend
- **Flask**: Web framework
- **sentence-transformers**: Semantic similarity analysis
- **spaCy**: Natural language processing
- **pdfplumber**: PDF text extraction
- **python-docx**: DOCX text extraction
- **scikit-learn**: Machine learning utilities

### Frontend
- **React**: User interface
- **Tailwind CSS**: Styling
- **Lucide React**: Icons
- **React Dropzone**: File upload
- **Axios**: HTTP client

## Installation

### Prerequisites
- Python 3.8+
- Node.js 14+
- Git

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
```

3. Activate the virtual environment:
```bash
# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Download spaCy model:
```bash
python -m spacy download en_core_web_sm
```

6. Start the backend server:
```bash
python app.py
```

The backend will be running on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will be running on `http://localhost:3000`

## Usage

1. **Upload Resume**: Click "Browse Files" or drag and drop a PDF/DOCX file
2. **Add Job Description**: Paste the job description in the text area
3. **Analyze**: Click "Analyze Resume Match" to get results
4. **Review Results**: View match score, skill analysis, and suggestions

## API Endpoints

### POST /api/analyze
Analyzes resume against job description.

**Request:**
- `resume`: File (PDF/DOCX)
- `job_description`: Text

**Response:**
```json
{
  "match_score": 78.5,
  "matched_skills": ["python", "sql", "react"],
  "missing_skills": ["aws", "kubernetes"],
  "resume_skills": ["python", "sql", "react", "javascript"],
  "jd_skills": ["python", "sql", "react", "aws", "kubernetes"],
  "suggestions": ["Consider adding AWS experience if you have it"],
  "resume_text_length": 2500,
  "jd_text_length": 1200
}
```

### GET /api/health
Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "models_loaded": true
}
```

## Project Structure

```
ai-resume-analyzer/
├── backend/
│   ├── app.py              # Main Flask application
│   ├── requirements.txt     # Python dependencies
│   └── uploads/            # Temporary file storage
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.js
│   │   │   ├── FileUpload.js
│   │   │   ├── JobDescription.js
│   │   │   └── Results.js
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

## Configuration

### Environment Variables

Create a `.env` file in the frontend directory:

```env
REACT_APP_API_URL=http://localhost:5000
```

### Customization

- **Skills Database**: Edit the `SKILLS_DATABASE` list in `backend/app.py`
- **UI Colors**: Modify the Tailwind config in `frontend/tailwind.config.js`
- **Models**: Change the sentence transformer model in `backend/app.py`

## Performance Considerations

- **File Size Limit**: 16MB maximum file size
- **Text Truncation**: Long texts are truncated to 8000 characters for optimal processing
- **Timeout**: 30-second API timeout
- **Memory**: Models are loaded once at startup

## Troubleshooting

### Common Issues

1. **Model Download Failed**: Ensure internet connection for first-time setup
2. **spaCy Model Missing**: Run `python -m spacy download en_core_web_sm`
3. **CORS Issues**: Backend runs on port 5000, frontend on 3000
4. **Memory Issues**: Restart the backend server if memory usage is high

### Error Messages

- "No resume file uploaded": Please select a file
- "File type not supported": Use PDF or DOCX only
- "Could not extract text": File may be corrupted or password-protected
- "Job description is required": Please provide job description text

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request


## Future Enhancements

- [ ] Multiple resume comparison
- [ ] Resume ranking system
- [ ] Keyword highlighting
- [ ] ATS score simulation
- [ ] Export results to PDF
- [ ] User authentication
- [ ] Resume templates
- [ ] Interview preparation tips
- [ ] Salary estimation
- [ ] Career path recommendations
=======
# AI-Resume-Analyzer
>>>>>>> 4eb3fcb05481efef2028b0b7cb5798031014c347
