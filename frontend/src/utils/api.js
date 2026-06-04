import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
});

// Request interceptor to add CORS headers if needed
api.interceptors.request.use(
  (config) => {
    config.headers['Content-Type'] = 'multipart/form-data';
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please try again.');
    }
    
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.error || 'Server error occurred';
      throw new Error(message);
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('Network error. Please check your connection.');
    } else {
      // Something else happened
      throw new Error('An unexpected error occurred.');
    }
  }
);

export const analyzeResume = async (resumeFile, jobDescription, jdInputType = 'text') => {
  const formData = new FormData();
  formData.append('resume', resumeFile);
  formData.append('jd_input_type', jdInputType);
  
  if (jdInputType === 'text') {
    formData.append('job_description', jobDescription);
  } else if (jdInputType === 'file') {
    formData.append('jd_file', jobDescription);
  } else if (jdInputType === 'url') {
    formData.append('job_url', jobDescription);
  }

  try {
    const response = await api.post('/api/analyze', formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const healthCheck = async () => {
  try {
    const response = await api.get('/api/health');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default api;
