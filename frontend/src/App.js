import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import JobDescription from './components/JobDescription';
import Results from './components/Results';
import Header from './components/Header';
import { analyzeResume } from './utils/api';
import { FileText, Briefcase, TrendingUp } from 'lucide-react';

function App() {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [jdInputType, setJdInputType] = useState('text'); // 'text', 'file', or 'url'
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

  const handleFileSelect = (file) => {
    setResumeFile(file);
    setError('');
    updateStep(file, jobDescription, jdInputType);
  };

  const handleJobDescriptionChange = (value) => {
    setJobDescription(value);
    setError('');
    updateStep(resumeFile, value, jdInputType);
  };

  const handleInputChangeType = (type) => {
    setJdInputType(type);
    setJobDescription(''); // Clear previous input
    setError('');
    updateStep(resumeFile, '', type);
  };

  const updateStep = (resume, jd, inputType) => {
    if (!resume) {
      setCurrentStep(1);
    } else if (!jd && inputType === 'text') {
      setCurrentStep(2);
    } else if (!jd && inputType === 'file') {
      setCurrentStep(2);
    } else if (!jd && inputType === 'url') {
      setCurrentStep(2);
    } else {
      setCurrentStep(3);
    }
  };

  const handleAnalyze = async () => {
    // Validate inputs based on type
    if (!resumeFile) {
      setError('Please upload a resume');
      return;
    }

    if (jdInputType === 'text' && !jobDescription.trim()) {
      setError('Please provide a job description');
      return;
    }

    if (jdInputType === 'file' && !jobDescription) {
      setError('Please upload a job description file');
      return;
    }

    if (jdInputType === 'url' && !jobDescription.trim()) {
      setError('Please provide a job URL');
      return;
    }

    setLoading(true);
    setError('');
    setResults(null);

    try {
      const result = await analyzeResume(resumeFile, jobDescription, jdInputType);
      setResults(result);
      setCurrentStep(4);
    } catch (err) {
      setError(err.message || 'An error occurred during analysis');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResumeFile(null);
    setJobDescription('');
    setJdInputType('text');
    setResults(null);
    setError('');
    setLoading(false);
    setCurrentStep(1);
  };

  const getAnalyzeButtonDisabled = () => {
    if (loading) return true;
    if (!resumeFile) return true;
    if (jdInputType === 'text' && !jobDescription.trim()) return true;
    if (jdInputType === 'file' && !jobDescription) return true;
    if (jdInputType === 'url' && !jobDescription.trim()) return true;
    return false;
  };

  const getAnalyzeButtonText = () => {
    if (loading) {
      return (
        <div className="flex items-center">
          <div className="loading-spinner w-5 h-5 mr-2"></div>
          Analyzing...
        </div>
      );
    }
    
    const inputTypeText = {
      'text': 'Text',
      'file': 'File',
      'url': 'URL'
    };
    
    return `Analyze Resume vs ${inputTypeText[jdInputType]}`;
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-center space-x-4 md:space-x-8">
            {[
              { step: 1, label: 'Upload Resume', icon: '📄' },
              { step: 2, label: 'Job Description', icon: '💼' },
              { step: 3, label: 'Analyze', icon: '🔍' },
              { step: 4, label: 'Results', icon: '📊' }
            ].map((item, index) => (
              <React.Fragment key={item.step}>
                <div className={`flex items-center transition-all duration-300 ${
                  currentStep >= item.step ? 'scale-105' : 'scale-95 opacity-60'
                }`}>
                  <div className={`relative flex items-center justify-center w-12 h-12 rounded-full font-bold text-sm transition-all duration-300 ${
                    currentStep >= item.step
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                      : 'bg-white/80 text-gray-600 border border-gray-200'
                  }`}>
                    {currentStep >= item.step && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-pulse opacity-30" />
                    )}
                    <span className="relative z-10">{item.icon}</span>
                  </div>
                  <span className="ml-3 font-medium text-sm hidden md:inline transition-colors duration-300" style={{ color: '#000000' }}>
                    {item.label}
                  </span>
                </div>
                
                {index < 3 && (
                  <div className={`w-8 md:w-16 h-1 rounded-full transition-all duration-500 ${
                    currentStep > item.step
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600'
                      : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-6 bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-2xl text-red-800 animate-slide-up shadow-lg shadow-red-500/10">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">!</span>
                </div>
              </div>
              <div className="ml-3">
                <p className="font-semibold">Error</p>
                <p className="text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="space-y-12 mt-8">
          {/* Input Section - Only show when no results */}
          {!results && (
            <div className="grid lg:grid-cols-2 gap-8 items-start">
              {/* Left Column - Input */}
              <div className="space-y-8">
                <div className="card-glow">
                  <FileUpload onFileSelect={handleFileSelect} selectedFile={resumeFile} />
                </div>
                
                <div className="card-glow">
                  <JobDescription 
                    value={jobDescription}
                    onChange={handleJobDescriptionChange}
                    onInputChangeType={handleInputChangeType}
                    inputType={jdInputType}
                  />
                </div>
                
                {/* Analyze Button */}
                <div className="flex justify-center">
                  <button
                    onClick={handleAnalyze}
                    disabled={getAnalyzeButtonDisabled()}
                    className="btn-gradient-black disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-2xl min-w-[200px]"
                  >
                    {getAnalyzeButtonText()}
                  </button>
                </div>

                {/* Reset Button */}
                {(resumeFile || jobDescription || results) && !loading && (
                  <div className="flex justify-center">
                    <button
                      onClick={handleReset}
                      className="btn-ghost hover-lift"
                    >
                      Start Over
                    </button>
                  </div>
                )}
              </div>

              {/* Right Column - Empty state */}
              <div className="flex items-center justify-center">
                <div className="card-elevated w-full max-w-md">
                  <div className="text-center space-y-6 p-8">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center">
                      <TrendingUp className="w-10 h-10 gradient-text" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3 card-title">Ready to Analyze</h3>
                      <p className="text-gray-700 leading-relaxed card-description">
                        Upload your resume and provide a job description (text, file, or URL) to see your match score and detailed analysis.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Results Section - Full width when results are available */}
          {results && (
            <div className="animate-fade-in">
              <Results results={results} />
              
              {/* Reset Button - Show below results */}
              <div className="flex justify-center mt-12">
                <button
                  onClick={handleReset}
                  className="btn-ghost hover-lift"
                >
                  Start New Analysis
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Features Section */}
        {!results && (
          <div className="mt-20 grid md:grid-cols-3 gap-8">
            <div className="card-compact hover-lift text-center group">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-3 text-gray-900">Multiple Input Options</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Paste text, upload PDF/TXT files, or provide URLs from job boards with intelligent content extraction
              </p>
            </div>
            
            <div className="card-compact hover-lift text-center group">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-3 text-gray-900">Smart Content Analysis</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Advanced AI automatically extracts and analyzes content from websites and documents
              </p>
            </div>
            
            <div className="card-compact hover-lift text-center group">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-3 text-gray-900">AI-Powered Insights</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Get detailed improvement recommendations and learning paths for career advancement
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
