import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Mic, Shield, BarChart3, Star, Sparkles } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between dark:bg-slate-950 transition-colors duration-300 overflow-hidden">
      
      {/* Background decoration gradients */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-400/25 dark:bg-primary-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[30rem] h-[30rem] bg-indigo-300/20 dark:bg-indigo-950/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main hero section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 z-10">
        <div className="text-center max-w-3xl mx-auto space-y-8">
          
          {/* Tagline Badge */}
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-primary-50 dark:bg-primary-950/40 border border-primary-100 dark:border-primary-900/40 text-primary-600 dark:text-primary-400 text-xs font-semibold uppercase tracking-wider animate-bounce">
            <Sparkles className="h-4 w-4" />
            <span>AI-Driven Communication Assessment</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            Master Your Speaking Flow with <span className="bg-gradient-to-r from-primary-500 to-indigo-500 bg-clip-text text-transparent">InterviewCoach AI</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg text-slate-600 dark:text-slate-300 font-medium">
            Simulate realistic interviews, record your voice, and receive an instant, objective grade across five key dimensions: Fluency, Vocabulary, Grammar, Relevance, and Filler Word Control.
          </p>

          {/* Call to Action button */}
          <div className="flex justify-center pt-4">
            <button
              onClick={() => navigate('/setup')}
              className="group flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:shadow-primary-500/25 dark:hover:shadow-primary-950/40 active:scale-95"
            >
              <span>Start Free Practice</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1.5 transition-transform duration-200" />
            </button>
          </div>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-5xl mx-auto">
          {/* Card 1 */}
          <div className="flex flex-col p-6 bg-white/50 dark:bg-slate-900/50 glassmorphism rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md">
            <div className="p-3 bg-primary-500/10 dark:bg-primary-400/10 text-primary-500 rounded-xl w-fit">
              <Mic className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mt-4">Mic Voice Capture</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              Record answers natively in your browser using the MediaRecorder API. Encoded to PCM WAV for maximum transcription precision.
            </p>
          </div>

          {/* Card 2 */}
          <div className="flex flex-col p-6 bg-white/50 dark:bg-slate-900/50 glassmorphism rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md">
            <div className="p-3 bg-primary-500/10 dark:bg-primary-400/10 text-primary-500 rounded-xl w-fit">
              <BarChart3 className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mt-4">Transparent Grading</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              No black boxes. A mathematical formula combining speaking pace, vocabulary range, word fillers, grammar, and keyword relevance.
            </p>
          </div>

          {/* Card 3 */}
          <div className="flex flex-col p-6 bg-white/50 dark:bg-slate-900/50 glassmorphism rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md">
            <div className="p-3 bg-primary-500/10 dark:bg-primary-400/10 text-primary-500 rounded-xl w-fit">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mt-4">Offline & Privacy First</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              Data stores inside local SQLite databases. Runs offline fallback models dynamically so you don't need paid online cloud tokens.
            </p>
          </div>
        </div>

      </div>
      
    </div>
  );
}
