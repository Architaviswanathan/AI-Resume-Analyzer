import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X, CheckCircle, AlertCircle } from 'lucide-react';

const FileUpload = ({ onFileSelect, selectedFile }) => {
  const [error, setError] = useState('');
  const [isDragActive, setIsDragActive] = useState(false);

  const onDrop = (acceptedFiles, fileRejections) => {
    setError('');
    
    if (fileRejections.length > 0) {
      setError('Please upload only PDF or DOCX files');
      return;
    }
    
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (file.size > 16 * 1024 * 1024) {
        setError('File size must be less than 16MB');
        return;
      }
      onFileSelect(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive: dropzoneActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc']
    },
    maxSize: 16 * 1024 * 1024,
    multiple: false,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
  });

  const removeFile = () => {
    onFileSelect(null);
    setError('');
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName) => {
    if (fileName?.endsWith('.pdf')) {
      return <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
        <FileText className="w-6 h-6 text-white" />
      </div>;
    } else if (fileName?.endsWith('.docx') || fileName?.endsWith('.doc')) {
      return <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
        <FileText className="w-6 h-6 text-white" />
      </div>;
    }
    return <div className="w-12 h-12 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl flex items-center justify-center">
      <FileText className="w-6 h-6 text-white" />
    </div>;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center" style={{ color: '#000000' }}>
          <Upload className="w-5 h-5 mr-2 gradient-text" />
          Upload Resume
        </h2>
        {selectedFile && (
          <div className="flex items-center text-green-600 text-sm font-medium">
            <CheckCircle className="w-4 h-4 mr-1" />
            Ready
          </div>
        )}
      </div>
      
      {!selectedFile ? (
        <div
          {...getRootProps()}
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
            isDragActive || dropzoneActive
              ? 'border-blue-500 bg-blue-50/50 scale-[1.02] shadow-lg shadow-blue-500/20'
              : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50/50 hover:shadow-md'
          }`}
        >
          <input {...getInputProps()} />
          
          <div className="space-y-4">
            <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center transition-all duration-300 ${
              isDragActive || dropzoneActive
                ? 'bg-gradient-to-br from-blue-500 to-blue-600 scale-110'
                : 'bg-gradient-to-br from-gray-400 to-gray-500'
            }`}>
              <Upload className="w-8 h-8 text-white" />
            </div>
            
            <div>
              <p className="text-lg font-semibold text-gray-900 mb-2 card-title">
                {isDragActive || dropzoneActive
                  ? 'Drop your resume here'
                  : 'Click to upload or drag and drop'
                }
              </p>
              <p className="text-sm text-gray-600 card-description">
                PDF or DOCX files (Max 16MB)
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                PDF
              </span>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
                DOCX
              </span>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                16MB max
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="card-glow">
          <div className="flex items-start space-x-4">
            {getFileIcon(selectedFile.name)}
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="font-semibold text-gray-900 truncate card-title">
                    {selectedFile.name}
                  </p>
                  <p className="text-sm text-gray-600 card-text-secondary">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
                
                <button
                  onClick={removeFile}
                  className="ml-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="mt-3 flex items-center space-x-2">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-slide-up" style={{ width: '100%' }} />
                </div>
                <span className="text-xs text-green-600 font-medium">Uploaded</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {error && (
        <div className="flex items-center p-3 bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-xl text-red-700 animate-slide-up">
          <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
          <span className="text-sm error-text">{error}</span>
        </div>
      )}
      
      {!selectedFile && !error && (
        <div className="text-center">
          <p className="text-xs text-gray-500 card-text-muted">
            Your resume will be analyzed using advanced AI to match job requirements
          </p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
