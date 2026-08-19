import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import MicRecorder from '../components/MicRecorder';
import { ArrowLeft, Sparkles, Send, HelpCircle } from 'lucide-react';

export default function LiveInterview() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Retrieve question parameters passed from Setup
  const { questionId, questionText, mode, difficulty } = location.state || {
    questionId: 1,
    questionText: 'Tell me about yourself.',
    mode: 'HR',
    difficulty: 'Easy'
  };

  const [audioData, setAudioData] = useState(null);

  const handleStopRecording = (data) => {
    // data contains: { blob, url, duration }
    setAudioData(data);
  };

  const handleSubmit = () => {
    if (!audioData) return;
    
    // Redirect to the processing loading screen, passing the audio blob and question data
    navigate('/processing', {
      state: {
        audioBlob: audioData.blob,
        durationSeconds: audioData.duration,
        questionId: questionId,
        questionText: questionText,
        mode,
        difficulty
      }
    });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* Back Link */}
        <Link to="/setup" className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-primary-500 transition-colors uppercase tracking-wider">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Setup</span>
        </Link>

        {/* Question Card */}
        <div className="bg-gradient-to-br from-primary-600 to-indigo-600 p-8 rounded-3xl text-white shadow-md relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
          
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-bold uppercase tracking-wider">
              {mode}
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              difficulty === 'Easy' ? 'bg-emerald-500/30' : difficulty === 'Medium' ? 'bg-amber-500/30' : 'bg-red-500/30'
            }`}>
              {difficulty}
            </span>
          </div>

          <h3 className="text-xl font-medium text-primary-100 uppercase tracking-widest text-[11px] font-bold mt-6">
            Practice Question
          </h3>
          <p className="text-xl sm:text-2xl font-bold mt-2 leading-relaxed">
            "{questionText}"
          </p>
        </div>

        {/* Recording Panel */}
        <div className="space-y-4">
          <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block text-center">
            Record Your Response
          </label>
          <MicRecorder onStop={handleStopRecording} />
        </div>

        {/* Submit Action */}
        {audioData && (
          <div className="pt-4 flex justify-center animate-fade-in">
            <button
              onClick={handleSubmit}
              className="flex items-center justify-center space-x-2 px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-2xl shadow-md transition-all active:scale-95"
            >
              <Send className="h-4 w-4" />
              <span>Submit & Analyze Answer</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
