import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { startInterview } from '../utils/api';
import { BrainCircuit, Briefcase, HelpCircle, GraduationCap, ChevronRight, Zap } from 'lucide-react';

export default function InterviewSetup() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('HR');
  const [difficulty, setDifficulty] = useState('Easy');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleStart = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await startInterview(mode, difficulty);
      // Pass question details via state to the Live Interview page
      navigate('/live', { 
        state: { 
          questionId: data.question_id, 
          questionText: data.question_text,
          mode,
          difficulty
        } 
      });
    } catch (err) {
      console.error(err);
      setError(err.message || 'Could not fetch a question. Check if backend is online.');
    } finally {
      setIsLoading(false);
    }
  };

  const modes = [
    { id: 'HR', label: 'HR / General', desc: 'Personal background, strengths, and career goals.', icon: Briefcase },
    { id: 'Behavioral', label: 'Behavioral', desc: 'Situation handling, conflicts, and decision making.', icon: BrainCircuit },
    { id: 'Technical', label: 'Technical', desc: 'Computer science, database systems, and structures.', icon: GraduationCap }
  ];

  const difficulties = [
    { id: 'Easy', color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/30' },
    { id: 'Medium', color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/30' },
    { id: 'Hard', color: 'text-red-500 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/30' }
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Configure Your Mock Session
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Select your interview category and target difficulty to generate a question.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-2xl text-sm text-red-600 dark:text-red-400 font-medium">
            {error}
          </div>
        )}

        {/* Step 1: Select Mode */}
        <div className="space-y-4">
          <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
            Step 1: Choose Interview Type
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {modes.map((m) => {
              const Icon = m.icon;
              const isSelected = mode === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`flex flex-col items-start p-5 rounded-2xl border text-left transition-all duration-200 ${
                    isSelected
                      ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-950/20 ring-2 ring-primary-500/20'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-primary-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-4">{m.label}</span>
                  <span className="text-xs text-slate-400 dark:text-slate-500 mt-1.5 leading-relaxed">{m.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Select Difficulty */}
        <div className="space-y-4">
          <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
            Step 2: Set Difficulty Level
          </label>
          <div className="grid grid-cols-3 gap-4">
            {difficulties.map((d) => {
              const isSelected = difficulty === d.id;
              return (
                <button
                  key={d.id}
                  onClick={() => setDifficulty(d.id)}
                  className={`py-3.5 px-4 rounded-xl border font-bold text-sm transition-all duration-200 ${
                    isSelected
                      ? `${d.color} border-2 scale-[1.02] shadow-sm`
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50'
                  }`}
                >
                  {d.id}
                </button>
              );
            })}
          </div>
        </div>

        {/* Start Button */}
        <div className="pt-6">
          <button
            onClick={handleStart}
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-2 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-2xl transition-all shadow-md active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none"
          >
            {isLoading ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Zap className="h-4 w-4 fill-white" />
                <span>Generate & Start Question</span>
                <ChevronRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
