import React from 'react';
import { FileText, Brain, Sparkles, ArrowRight } from 'lucide-react';

const Header = () => {
  return (
    <header className="relative overflow-hidden">
      {/* Background gradient with glass effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 backdrop-blur-sm" />
      
      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 gradient-text text-shadow-lg animate-fade-in">
            AI Resume Analyzer
          </h1>
          
          <p className="text-xl md:text-2xl text-white/95 font-medium mb-10 max-w-3xl mx-auto leading-relaxed animate-slide-up header-text">
            Transform your career with AI-powered resume analysis
          </p>
          
          {/* Key features */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <div className="flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white/95 font-medium header-text">
              <Sparkles className="w-4 h-4 mr-2 text-yellow-300" />
              Smart Analysis
            </div>
            <div className="flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white/95 font-medium header-text">
              <FileText className="w-4 h-4 mr-2 text-blue-300" />
              Multiple Formats
            </div>
            <div className="flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white/95 font-medium header-text">
              <ArrowRight className="w-4 h-4 mr-2 text-green-300" />
              Actionable Insights
            </div>
          </div>
          
          {/* Subtle call-to-action */}
          <div className="text-white/90 text-sm animate-fade-in header-text">
            Upload your resume and get instant AI-powered insights
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
