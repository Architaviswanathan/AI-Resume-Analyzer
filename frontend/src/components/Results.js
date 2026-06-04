import React, { useState } from 'react';
import { 
  TrendingUp, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Target,
  BookOpen,
  Lightbulb,
  Clock,
  Star,
  Award,
  TrendingDown,
  Users,
  Code,
  GraduationCap,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  BarChart3,
  PieChart,
  Zap,
  Shield,
  Rocket,
  Target as TargetIcon
} from 'lucide-react';

const Results = ({ results }) => {
  const [expandedSections, setExpandedSections] = useState({
    analysis: false,
    learning: false,
    experience: false,
    recommendations: false
  });

  const {
    match_score,
    matched_skills,
    missing_skills,
    resume_skills,
    jd_skills,
    detailed_analysis
  } = results;

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'from-emerald-500 to-green-600';
    if (score >= 60) return 'from-amber-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'from-emerald-50 to-green-100';
    if (score >= 60) return 'from-amber-50 to-orange-100';
    return 'from-red-50 to-pink-100';
  };

  const getScoreMessage = (score) => {
    if (score >= 80) return 'Excellent Match!';
    if (score >= 60) return 'Good Match';
    if (score >= 40) return 'Moderate Match';
    return 'Needs Improvement';
  };

  const getScoreIcon = (score) => {
    if (score >= 60) return <CheckCircle className="w-8 h-8" />;
    return <AlertCircle className="w-8 h-8" />;
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'border-red-200 bg-red-50 text-red-700';
      case 'medium': return 'border-amber-200 bg-amber-50 text-amber-700';
      case 'low': return 'border-green-200 bg-green-50 text-green-700';
      default: return 'border-gray-200 bg-gray-50 text-gray-700';
    }
  };

  const getPriorityBadgeColor = (priority) => {
    switch(priority) {
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-amber-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const renderScoreCard = () => {
    return (
      <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${getScoreBgColor(match_score)} p-8 shadow-2xl`}>
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
        
        <div className="relative z-10 text-center">
          {/* Score circle */}
          <div className="relative inline-block mb-6">
            <div className={`w-32 h-32 rounded-full bg-gradient-to-br ${getScoreColor(match_score)} flex items-center justify-center shadow-xl`}>
              <div className="text-white text-center">
                <div className="text-4xl font-bold">{match_score}%</div>
                <div className="text-xs opacity-90">MATCH</div>
              </div>
            </div>
            {/* Animated ring */}
            <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${getScoreColor(match_score)} animate-ping opacity-20`} />
          </div>
          
          {/* Score message */}
          <div className="space-y-2">
            <h3 className={`text-2xl font-bold bg-gradient-to-r ${getScoreColor(match_score)} bg-clip-text text-transparent`}>
              {getScoreMessage(match_score)}
            </h3>
            <div className="flex items-center justify-center text-white/80">
              {getScoreIcon(match_score)}
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="mt-6">
            <div className="w-full bg-white/30 rounded-full h-3 backdrop-blur-sm">
              <div 
                className={`h-3 rounded-full bg-gradient-to-r ${getScoreColor(match_score)} transition-all duration-1000 ease-out shadow-lg`}
                style={{ width: `${Math.min(match_score, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSkillsOverview = () => {
    const totalSkills = jd_skills.length;
    const matchedPercentage = totalSkills > 0 ? Math.round((matched_skills.length / totalSkills) * 100) : 0;
    
    return (
      <div className="grid md:grid-cols-3 gap-6">
        {/* Matched Skills */}
        <div className="card-glow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg text-gray-900">Matched Skills</h3>
            <div className="flex items-center text-emerald-600">
              <CheckCircle className="w-5 h-5 mr-1" />
              <span className="font-semibold">{matched_skills.length}</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Coverage</span>
              <span className="font-bold text-emerald-600">{matchedPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="h-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full transition-all duration-1000"
                style={{ width: `${matchedPercentage}%` }}
              />
            </div>
          </div>
          
          {matched_skills.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {matched_skills.slice(0, 6).map((skill, index) => (
                <span key={index} className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-green-500 text-white text-xs font-medium rounded-full shadow-md">
                  {skill}
                </span>
              ))}
              {matched_skills.length > 6 && (
                <span className="px-3 py-1 bg-gray-200 text-gray-600 text-xs font-medium rounded-full">
                  +{matched_skills.length - 6} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Missing Skills */}
        <div className="card-glow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg text-gray-900">Missing Skills</h3>
            <div className="flex items-center text-red-600">
              <XCircle className="w-5 h-5 mr-1" />
              <span className="font-semibold">{missing_skills.length}</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Gap</span>
              <span className="font-bold text-red-600">{100 - matchedPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="h-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-full transition-all duration-1000"
                style={{ width: `${100 - matchedPercentage}%` }}
              />
            </div>
          </div>
          
          {missing_skills.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {missing_skills.slice(0, 6).map((skill, index) => (
                <span key={index} className="px-3 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-medium rounded-full shadow-md">
                  {skill}
                </span>
              ))}
              {missing_skills.length > 6 && (
                <span className="px-3 py-1 bg-gray-200 text-gray-600 text-xs font-medium rounded-full">
                  +{missing_skills.length - 6} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Total Skills */}
        <div className="card-glow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg text-gray-900">Total Required</h3>
            <div className="flex items-center text-blue-600">
              <TargetIcon className="w-5 h-5 mr-1" />
              <span className="font-semibold">{totalSkills}</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Your Skills</span>
              <span className="font-bold text-blue-600">{resume_skills.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Required</span>
              <span className="font-bold text-purple-600">{jd_skills.length}</span>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-xl">
            <div className="flex items-center text-blue-700 text-sm">
              <BarChart3 className="w-4 h-4 mr-2" />
              <span>Skills Analysis Complete</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderLowScoreAnalysis = () => {
    if (!detailed_analysis?.low_score_reasons?.length) return null;
    
    return (
      <div className="card-elevated border-l-4 border-red-500">
        <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection('analysis')}>
          <h3 className="text-xl font-bold flex items-center text-red-700">
            <TrendingDown className="w-6 h-6 mr-3" />
            Why Your Score is Low
          </h3>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full">
              {detailed_analysis.low_score_reasons.length} Issues
            </span>
            {expandedSections.analysis ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </div>
        
        {expandedSections.analysis && (
          <div className="mt-6 space-y-3">
            {detailed_analysis.low_score_reasons.map((reason, index) => (
              <div key={index} className="flex items-start p-4 bg-red-50 rounded-xl">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-4 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-gray-800 font-medium">{reason}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderSkillGapAnalysis = () => {
    if (!detailed_analysis?.skill_gap_analysis) return null;
    
    const { skill_gap_analysis } = detailed_analysis;
    
    return (
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card-elevated">
          <h3 className="text-xl font-bold mb-6 flex items-center text-gray-900">
            <PieChart className="w-6 h-6 mr-3 text-blue-600" />
            Skill Gap Analysis
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
              <span className="text-gray-700 font-medium">Skills Missing</span>
              <span className="font-bold text-red-600">{skill_gap_analysis.missing_skills_count} / {skill_gap_analysis.required_skills_count}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
              <span className="text-gray-700 font-medium">Gap Percentage</span>
              <span className={`font-bold ${skill_gap_analysis.gap_percentage > 50 ? 'text-red-600' : 'text-amber-600'}`}>
                {skill_gap_analysis.gap_percentage}%
              </span>
            </div>
            
            {/* Visual progress */}
            <div className="relative">
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="h-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-full transition-all duration-1000 shadow-lg"
                  style={{ width: `${skill_gap_analysis.gap_percentage}%` }}
                />
              </div>
              <div className="mt-2 text-center">
                <span className="text-sm text-gray-600">
                  {skill_gap_analysis.gap_percentage > 50 ? 'Significant Gap' : 'Moderate Gap'}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="card-elevated">
          <h3 className="text-xl font-bold mb-6 flex items-center text-gray-900">
            <Star className="w-6 h-6 mr-3 text-amber-600" />
            Critical Missing Skills
          </h3>
          
          {skill_gap_analysis.critical_missing?.length > 0 ? (
            <div className="space-y-3">
              {skill_gap_analysis.critical_missing.map((skill, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-amber-50 rounded-xl border border-amber-200">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-amber-500 rounded-full mr-3" />
                    <span className="font-bold text-amber-800">{skill}</span>
                  </div>
                  <span className="px-2 py-1 bg-amber-500 text-white text-xs font-bold rounded-full">
                    CRITICAL
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-2xl flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-gray-600 font-medium">No critical skills missing!</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderImprovementRecommendations = () => {
    if (!detailed_analysis?.improvement_recommendations?.length) return null;
    
    return (
      <div className="card-elevated">
        <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection('recommendations')}>
          <h3 className="text-xl font-bold flex items-center text-gray-900">
            <Lightbulb className="w-6 h-6 mr-3 text-yellow-600" />
            Improvement Recommendations
          </h3>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm font-medium rounded-full">
              {detailed_analysis.improvement_recommendations.length} Areas
            </span>
            {expandedSections.recommendations ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </div>
        
        {expandedSections.recommendations && (
          <div className="mt-6 space-y-4">
            {detailed_analysis.improvement_recommendations.map((rec, index) => (
              <div key={index} className={`border rounded-2xl p-5 ${getPriorityColor(rec.priority)} hover:shadow-lg transition-all duration-200`}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-lg">{rec.category}</h4>
                  <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full ${getPriorityBadgeColor(rec.priority)}`}>
                    {rec.priority} priority
                  </span>
                </div>
                <ul className="space-y-2">
                  {rec.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start">
                      <ArrowRight className="w-4 h-4 mr-3 mt-1 flex-shrink-0 text-gray-400" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderLearningPaths = () => {
    if (!detailed_analysis?.learning_paths?.length) return null;
    
    return (
      <div className="card-elevated">
        <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection('learning')}>
          <h3 className="text-xl font-bold flex items-center text-gray-900">
            <GraduationCap className="w-6 h-6 mr-3 text-purple-600" />
            Learning Paths
          </h3>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-medium rounded-full">
              {detailed_analysis.learning_paths.length} Skills
            </span>
            {expandedSections.learning ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </div>
        
        {expandedSections.learning && (
          <div className="mt-6 space-y-4">
            {detailed_analysis.learning_paths.map((path, index) => (
              <div key={index} className="border rounded-2xl p-5 hover:shadow-lg transition-all duration-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-lg text-gray-900">{path.skill}</h4>
                  <div className="flex items-center space-x-3">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                      {path.difficulty}
                    </span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {path.time_estimate}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <p className="font-semibold text-gray-700 flex items-center">
                    <BookOpen className="w-4 h-4 mr-2 text-gray-400" />
                    Learning Resources
                  </p>
                  <ul className="space-y-2">
                    {path.resources.map((resource, resIndex) => (
                      <li key={resIndex} className="flex items-start text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                        <span>{resource}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderPriorityActions = () => {
    if (!detailed_analysis?.priority_actions?.length) return null;
    
    return (
      <div className="card-elevated">
        <h3 className="text-xl font-bold mb-6 flex items-center text-gray-900">
          <Rocket className="w-6 h-6 mr-3 text-indigo-600" />
          Priority Action Plan
        </h3>
        
        <div className="space-y-4">
          {detailed_analysis.priority_actions.map((action, index) => (
            <div key={index} className={`border rounded-2xl p-5 ${getPriorityColor(action.priority)} hover:shadow-lg transition-all duration-200`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${getPriorityBadgeColor(action.priority)}`}>
                      <span className="text-white font-bold text-sm">{index + 1}</span>
                    </div>
                    <p className="font-bold text-gray-900">{action.action}</p>
                  </div>
                  <p className="text-gray-600 ml-11">{action.reason}</p>
                </div>
                <span className={`ml-4 px-3 py-1 text-xs font-bold uppercase rounded-full ${getPriorityBadgeColor(action.priority)}`}>
                  {action.priority}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Score Card - Full Width */}
      {renderScoreCard()}
      
      {/* Skills Overview - Full Width */}
      {renderSkillsOverview()}
      
      {/* Two-Column Layout for Analysis Sections */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-8">
          {/* Low Score Analysis - Only show for low scores */}
          {match_score < 70 && renderLowScoreAnalysis()}
          
          {/* Experience Analysis */}
          {detailed_analysis?.experience_analysis && (
            <div className="card-elevated">
              <h3 className="text-xl font-bold mb-6 flex items-center text-gray-900">
                <Users className="w-6 h-6 mr-3 text-blue-600" />
                Experience Analysis
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-xl">
                  <p className="text-sm text-blue-600 font-medium mb-1">Your Experience</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {detailed_analysis.experience_analysis.resume_experience ? 
                      `${detailed_analysis.experience_analysis.resume_experience} years` : 
                      'Not specified'
                    }
                  </p>
                  <p className="text-sm text-blue-700 mt-1">
                    Level: {detailed_analysis.experience_analysis.seniority_level || 'Unspecified'}
                  </p>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-xl">
                  <p className="text-sm text-purple-600 font-medium mb-1">Required Experience</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {detailed_analysis.experience_analysis.required_experience ? 
                      `${detailed_analysis.experience_analysis.required_experience} years` : 
                      'Not specified'
                    }
                  </p>
                  <p className="text-sm text-purple-700 mt-1">
                    Level: {detailed_analysis.experience_analysis.required_seniority || 'Unspecified'}
                  </p>
                </div>
              </div>
              
              {detailed_analysis.experience_analysis.gap_description && (
                <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-200">
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-amber-600 mr-3 mt-0.5" />
                    <div>
                      <p className="font-semibold text-amber-800">Experience Gap</p>
                      <p className="text-amber-700 mt-1">{detailed_analysis.experience_analysis.gap_description}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Detailed Skills Breakdown */}
          <div className="card-compact">
            <h3 className="text-lg font-bold mb-4 flex items-center text-gray-900">
              <Code className="w-5 h-5 mr-2 text-blue-600" />
              Your Skills ({resume_skills.length})
            </h3>
            
            {resume_skills.length > 0 ? (
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2">
                {resume_skills.map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-medium rounded-full shadow-md">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 mx-auto bg-gray-100 rounded-xl flex items-center justify-center mb-3">
                  <Code className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-gray-500 text-sm">No skills detected</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Right Column */}
        <div className="space-y-8">
          {/* Skill Gap Analysis */}
          {renderSkillGapAnalysis()}
          
          {/* Required Skills */}
          <div className="card-compact">
            <h3 className="text-lg font-bold mb-4 flex items-center text-gray-900">
              <TargetIcon className="w-5 h-5 mr-2 text-purple-600" />
              Required Skills ({jd_skills.length})
            </h3>
            
            {jd_skills.length > 0 ? (
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2">
                {jd_skills.map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-medium rounded-full shadow-md">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 mx-auto bg-gray-100 rounded-xl flex items-center justify-center mb-3">
                  <TargetIcon className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-gray-500 text-sm">No skills detected in job description</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Full Width Sections */}
      <div className="space-y-8">
        {/* Improvement Recommendations */}
        {renderImprovementRecommendations()}
        
        {/* Learning Paths */}
        {renderLearningPaths()}
        
        {/* Priority Actions */}
        {renderPriorityActions()}
        
        {/* Score Breakdown */}
        <div className="card-compact bg-gradient-to-br from-gray-50 to-gray-100">
          <h3 className="text-lg font-bold mb-4 flex items-center text-gray-900">
            <BarChart3 className="w-5 h-5 mr-2 text-gray-600" />
            Analysis Summary
          </h3>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-xl">
              <p className="text-2xl font-bold text-emerald-600">
                {jd_skills.length > 0 ? Math.round((matched_skills.length / jd_skills.length) * 100) : 0}%
              </p>
              <p className="text-sm text-gray-600 mt-1">Skills Match</p>
            </div>
            
            <div className="text-center p-4 bg-white rounded-xl">
              <p className="text-2xl font-bold text-blue-600">{match_score}%</p>
              <p className="text-sm text-gray-600 mt-1">Semantic Similarity</p>
            </div>
            
            <div className="text-center p-4 bg-white rounded-xl">
              <p className="text-2xl font-bold text-purple-600">
                {matched_skills.length} / {jd_skills.length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Skills Coverage</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
