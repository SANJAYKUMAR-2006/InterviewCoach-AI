import React from 'react';
import { HelpCircle, ChevronRight, BookOpen, Clock, AlertTriangle, CheckCircle, Search } from 'lucide-react';

export default function ScoreCard({ 
  overallScore,
  subScores,
  wpm,
  fillerCount
}) {
  // Helpers to get styling based on score levels
  const getScoreColor = (score) => {
    if (score === null || score === undefined) return 'text-slate-400';
    if (score >= 80) return 'text-emerald-500';
    if (score >= 60) return 'text-amber-500';
    return 'text-red-500';
  };

  const getScoreBg = (score) => {
    if (score === null || score === undefined) return 'bg-slate-100 dark:bg-slate-800';
    if (score >= 80) return 'bg-emerald-50 dark:bg-emerald-950/20';
    if (score >= 60) return 'bg-amber-50 dark:bg-amber-950/20';
    return 'bg-red-50 dark:bg-red-950/20';
  };

  const getScoreBarColor = (score) => {
    if (score === null || score === undefined) return 'bg-slate-300 dark:bg-slate-700';
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };

  // Circular progress calculations
  const radius = 50;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallScore / 100) * circumference;

  const metrics = [
    { 
      name: 'Fluency', 
      score: subScores.fluency, 
      desc: 'Speaking rate (WPM) and pacing consistency', 
      icon: Clock,
      extra: `${wpm} WPM`
    },
    { 
      name: 'Vocabulary', 
      score: subScores.vocabulary, 
      desc: 'Lexical diversity and repetition control', 
      icon: BookOpen
    },
    { 
      name: 'Grammar', 
      score: subScores.grammar, 
      desc: 'Spelling, syntactical syntax & structure', 
      icon: CheckCircle,
      isNullable: true
    },
    { 
      name: 'Relevance', 
      score: subScores.relevance, 
      desc: 'Overlap with question expected keywords', 
      icon: Search
    },
    { 
      name: 'Filler Control', 
      score: subScores.fillerControl, 
      desc: 'Avoiding um, uh, like, actually, basically', 
      icon: AlertTriangle,
      extra: `${fillerCount} fillers`
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-white dark:bg-slate-800/60 p-6 rounded-3xl border border-slate-100 dark:border-slate-700/50 shadow-md transition-colors duration-300">
      
      {/* Overall Score Circle Card */}
      <div className="flex flex-col items-center justify-center p-6 border-b lg:border-b-0 lg:border-r border-slate-100 dark:border-slate-700/60 text-center">
        <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-6">
          Overall Performance
        </h3>
        
        {/* Animated Circle */}
        <div className="relative flex items-center justify-center w-40 h-40">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              fill="transparent"
              className="text-slate-100 dark:text-slate-700"
            />
            {/* Foreground progress circle */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className={`transition-all duration-1000 ${
                overallScore >= 80 
                  ? 'text-emerald-500' 
                  : overallScore >= 60 
                    ? 'text-amber-500' 
                    : 'text-red-500'
              }`}
            />
          </svg>
          
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-4xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tighter">
              {overallScore}
            </span>
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest mt-1">
              Out of 100
            </span>
          </div>
        </div>

        <div className={`mt-6 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider ${getScoreBg(overallScore)} ${getScoreColor(overallScore)}`}>
          {overallScore >= 80 ? 'Excellent Speaker' : overallScore >= 60 ? 'Fluent / Average' : 'Needs Practice'}
        </div>
      </div>

      {/* Subscores List Card */}
      <div className="lg:col-span-2 flex flex-col justify-center space-y-5">
        <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
          Communication Metrics Breakdown
        </h4>

        <div className="space-y-4">
          {metrics.map((metric) => {
            const hasScore = metric.score !== null && metric.score !== undefined;
            const displayScore = hasScore ? `${Math.round(metric.score)}` : 'N/A';
            const Icon = metric.icon;

            return (
              <div key={metric.name} className="flex items-center space-x-4">
                {/* Metric Icon */}
                <div className={`p-2 rounded-xl ${hasScore ? getScoreBg(metric.score) : 'bg-slate-100 dark:bg-slate-800'} text-slate-600 dark:text-slate-300`}>
                  <Icon className={`h-5 w-5 ${hasScore ? getScoreColor(metric.score) : 'text-slate-400'}`} />
                </div>

                {/* Metric Name and Desc */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                      {metric.name}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                      {metric.extra && <span className="mr-2 text-slate-500 dark:text-slate-400 font-semibold">{metric.extra}</span>}
                      Score: <span className={`font-bold ${hasScore ? getScoreColor(metric.score) : ''}`}>{displayScore}</span>
                    </span>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="flex items-center space-x-3 mt-1.5">
                    <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-700/60 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${hasScore ? getScoreBarColor(metric.score) : 'bg-slate-300'}`}
                        style={{ width: `${hasScore ? metric.score : 0}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {metric.isNullable && !hasScore && (
                    <p className="text-[10px] text-amber-500 dark:text-amber-400/80 font-medium mt-1">
                      LanguageTool API offline: grammar evaluation skipped.
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
