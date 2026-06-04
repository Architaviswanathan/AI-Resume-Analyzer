import React, { useState } from 'react';
import { Briefcase, FileText, Globe, Type } from 'lucide-react';

const JobDescription = ({ value, onChange, onInputChangeType, inputType }) => {
  const [jdFile, setJdFile] = useState(null);
  const [jobUrl, setJobUrl] = useState('');
  const [urlError, setUrlError] = useState('');

  const handleTextChange = (e) => {
    onChange(e.target.value);
  };

  const handleFileSelect = (file) => {
    setJdFile(file);
    setUrlError('');
    onChange(file); // Pass file to parent
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setJobUrl(url);
    setUrlError('');
    
    // Basic URL validation
    if (url && !isValidUrl(url)) {
      setUrlError('Please enter a valid URL (e.g., https://example.com)');
    } else {
      onChange(url); // Pass URL to parent
    }
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const wordCount = typeof value === 'string' ? value.trim().split(/\s+/).filter(word => word.length > 0).length : 0;
  const characterCount = typeof value === 'string' ? value.length : 0;

  const renderInputTypeSelector = () => (
    <div className="flex space-x-2 mb-4">
      <button
        onClick={() => onInputChangeType('text')}
        className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
          inputType === 'text'
            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        <Type className="w-4 h-4 inline mr-2" />
        Text
      </button>
      <button
        onClick={() => onInputChangeType('file')}
        className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
          inputType === 'file'
            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        <FileText className="w-4 h-4 inline mr-2" />
        File
      </button>
      <button
        onClick={() => onInputChangeType('url')}
        className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
          inputType === 'url'
            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        <Globe className="w-4 h-4 inline mr-2" />
        URL
      </button>
    </div>
  );

  const renderTextInput = () => (
    <div>
      <textarea
        value={value}
        onChange={handleTextChange}
        placeholder="Paste the job description here...

Example:
We are looking for a Senior Software Engineer with experience in React, Node.js, and cloud technologies. The ideal candidate should have strong problem-solving skills and experience with agile development methodologies."
        className="input-field min-h-[200px] resize-none"
        rows={8}
      />
      
      <div className="flex justify-between items-center text-sm text-gray-600 mt-3">
        <span>
          {wordCount} {wordCount === 1 ? 'word' : 'words'}
        </span>
        <span>
          {characterCount} {characterCount === 1 ? 'character' : 'characters'}
        </span>
      </div>
      
      {value.length > 0 && value.length < 50 && (
        <div className="text-sm text-amber-700 bg-amber-50 p-3 rounded-lg mt-3">
          <p className="font-medium">Tip:</p>
          <p>Consider adding more details to the job description for better analysis results.</p>
        </div>
      )}
      
      {value.length > 10000 && (
        <div className="text-sm text-amber-700 bg-amber-50 p-3 rounded-lg mt-3">
          <p className="font-medium">Note:</p>
          <p>Very long job descriptions may be truncated for optimal processing.</p>
        </div>
      )}
    </div>
  );

  const renderFileInput = () => (
    <div>
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
          jdFile ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
        }`}
        onClick={() => document.getElementById('jd-file-input').click()}
      >
        <input
          id="jd-file-input"
          type="file"
          accept=".pdf,.txt"
          onChange={(e) => handleFileSelect(e.target.files[0])}
          className="hidden"
        />
        
        {jdFile ? (
          <div className="space-y-2">
            <FileText className="w-12 h-12 text-green-600 mx-auto" />
            <p className="font-medium text-gray-900 card-title">{jdFile.name}</p>
            <p className="text-sm text-gray-600 card-text-secondary">
              {(jdFile.size / 1024).toFixed(1)} KB
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <FileText className="w-12 h-12 text-gray-400 mx-auto" />
            <p className="text-lg font-medium text-gray-700 card-title">
              Click to upload job description file
            </p>
            <p className="text-sm text-gray-500 card-text-muted">
              Supported formats: PDF, TXT (Max 16MB)
            </p>
          </div>
        )}
      </div>
      
      {jdFile && (
        <div className="mt-3">
          <button
            onClick={() => {
              setJdFile(null);
              onChange(null);
            }}
            className="text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Remove file
          </button>
        </div>
      )}
    </div>
  );

  const renderUrlInput = () => (
    <div>
      <div className="space-y-3">
        <input
          type="url"
          value={jobUrl}
          onChange={handleUrlChange}
          placeholder="Enter job posting URL (e.g., https://linkedin.com/jobs/view/...)"
          className="input-field"
        />
        
        {urlError && (
          <div className="text-sm text-red-700 bg-red-50 p-3 rounded-lg">
            {urlError}
          </div>
        )}
        
        {jobUrl && !urlError && (
          <div className="text-sm text-green-700 bg-green-50 p-3 rounded-lg">
            <p className="font-medium">URL detected!</p>
            <p>We'll extract the job description from this webpage automatically.</p>
          </div>
        )}
        
        <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded-lg">
          <p className="font-medium mb-1">Supported websites:</p>
          <p>LinkedIn, Indeed, Glassdoor, company career pages, and most job boards.</p>
          <p className="mt-2">Note: Some sites may block automated access.</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4 flex items-center" style={{ color: '#000000' }}>
        <Briefcase className="w-5 h-5 mr-2 gradient-text" />
        Job Description
      </h2>
      
      {renderInputTypeSelector()}
      
      <div className="mt-4">
        {inputType === 'text' && renderTextInput()}
        {inputType === 'file' && renderFileInput()}
        {inputType === 'url' && renderUrlInput()}
      </div>
    </div>
  );
};

export default JobDescription;
