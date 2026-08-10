import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import ScoreCard from '../components/ScoreCard';
import ProgressChart from '../components/ProgressChart';
import { ArrowRight, FileText, CheckCircle2, ChevronRight, Calculator, RefreshCw } from 'lucide-react';

export default function ReportDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const { report } = location.state || {};

  if (!report) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center space-y-4 dark:bg-slate-950 transition-colors duration-300">
        <p className="text-slate-500 dark:text-slate-400 font-semibold">No report data found.</p>
        <Link to="/setup" className="px-5 py-2.5 bg-primary-600 text-white rounded-xl font-bold text-sm shadow-md">
          Start a Session
        </Link>
      </div>
    );
  }

  // Map subscores to ScoreCard format
  const subScoresObj = {
    fluency: report.fluency_score,
    vocabulary: report.vocabulary_score,
    grammar: report.grammar_score,
    relevance: report.relevance_score,
    fillerControl: report.filler_control_score
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Title / Info */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Assessment Report Card
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Attempt ID: #{report.attempt_id} | Mode: {report.mode} | Difficulty: {report.difficulty}
            </p>
          </div>
          
          <button
            onClick={() => navigate('/setup')}
            className="flex items-center space-x-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl text-sm transition-all shadow-sm active:scale-95 w-fit"
          >
            <span>Practice Another Question</span>
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Circular overall score and progress bars (takes 2/3 cols on lg) */}
          <div className="lg:col-span-2 space-y-6">
            <ScoreCard 
              overallScore={report.confidence_score}
              subScores={subScoresObj}
              wpm={report.words_per_minute}
              fillerCount={report.filler_count}
            />

            {/* Suggestions Box */}
            <div className="bg-white dark:bg-slate-800/60 p-6 rounded-3xl border border-slate-100 dark:border-slate-700/50 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Actionable Recommendations</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {report.suggestions.map((suggestion, idx) => (
                  <div key={idx} className="p-4 bg-primary-50/50 dark:bg-primary-950/20 rounded-2xl border border-primary-100/50 dark:border-primary-900/30">
                    <span className="text-xs font-bold text-primary-500 uppercase tracking-wider block mb-1">
                      Focus Area #{idx + 1}
                    </span>
                    <p className="text-sm text-slate-750 dark:text-slate-300 font-medium leading-relaxed">
                      {suggestion}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Radar Chart (takes 1/3 col on lg) */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800/60 p-6 rounded-3xl border border-slate-100 dark:border-slate-700/50 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                Competence Radar
              </h3>
              <ProgressChart type="radar" data={subScoresObj} />
            </div>

            {/* Quick stats panel */}
            <div className="grid grid-cols-3 gap-4 bg-white dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-sm text-center">
              <div>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Duration</p>
                <p className="text-lg font-extrabold text-slate-800 dark:text-slate-100 mt-1">{report.duration_seconds}s</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">WPM</p>
                <p className="text-lg font-extrabold text-slate-800 dark:text-slate-100 mt-1">{report.words_per_minute}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Fillers</p>
                <p className="text-lg font-extrabold text-slate-800 dark:text-slate-100 mt-1">{report.filler_count}</p>
              </div>
            </div>
          </div>

        </div>

        {/* Question Details, Transcript & Formula Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Transcript Panel */}
          <div className="bg-white dark:bg-slate-800/60 p-6 rounded-3xl border border-slate-100 dark:border-slate-700/50 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center space-x-2">
              <FileText className="h-4 w-4 text-slate-400" />
              <span>Response Transcript</span>
            </h3>
            
            <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-250/30 dark:border-slate-800 rounded-2xl">
              <p className="text-sm text-slate-700 dark:text-slate-350 leading-relaxed font-medium italic">
                "{report.transcript}"
              </p>
            </div>
            
            <div className="p-3 bg-slate-100/50 dark:bg-slate-900/40 rounded-xl">
              <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-550 leading-relaxed">
                <span className="font-bold text-slate-500">Question Answered:</span> {report.question_text}
              </p>
            </div>
          </div>

          {/* Formula Breakdown Panel */}
          <div className="bg-white dark:bg-slate-800/60 p-6 rounded-3xl border border-slate-100 dark:border-slate-700/50 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center space-x-2">
              <Calculator className="h-4 w-4 text-primary-500" />
              <span>Scoring Weight Breakdown</span>
            </h3>

            <div className="space-y-4 text-slate-600 dark:text-slate-350">
              <p className="text-xs leading-relaxed font-medium">
                Overall score is computed as a weighted average. The weights are:
              </p>

              {/* Weights Table / Legend */}
              <div className="grid grid-cols-5 gap-2 text-center text-[10px] font-bold uppercase tracking-wider">
                <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-lg">
                  <span className="text-slate-400 block mb-1">Fluency</span>
                  <span className="text-slate-800 dark:text-slate-200">30%</span>
                </div>
                <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-lg">
                  <span className="text-slate-400 block mb-1">Vocab</span>
                  <span className="text-slate-800 dark:text-slate-200">20%</span>
                </div>
                <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-lg">
                  <span className="text-slate-400 block mb-1">Relevance</span>
                  <span className="text-slate-800 dark:text-slate-200">20%</span>
                </div>
                <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-lg">
                  <span className="text-slate-400 block mb-1">Grammar</span>
                  <span className="text-slate-800 dark:text-slate-200">15%</span>
                </div>
                <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-lg">
                  <span className="text-slate-400 block mb-1">Fillers</span>
                  <span className="text-slate-800 dark:text-slate-200">15%</span>
                </div>
              </div>

              {/* Calculation explanation */}
              <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-250/30 dark:border-slate-800 rounded-2xl font-mono text-[11px] leading-relaxed space-y-2">
                <div className="text-slate-400 font-bold tracking-widest uppercase text-[9px] mb-1">
                  Calculation Formula
                </div>
                <div>
                  <span className="text-primary-500 font-bold">Calculation:</span> {report.formula_breakdown.calculation_string}
                </div>
                <div className="border-t border-slate-200 dark:border-slate-800 pt-2 flex items-baseline justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                  <span>Confidence Score:</span>
                  <span className="text-primary-500 text-sm font-extrabold">{report.confidence_score}</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
