import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { submitAudio, analyzeInterview } from '../utils/api';
import { Loader2, Sparkles, MessageSquareCode } from 'lucide-react';

export default function Processing() {
  const location = useLocation();
  const navigate = useNavigate();
  const [statusMessage, setStatusMessage] = useState('Initializing pipeline...');
  const [error, setError] = useState(null);

  // Retrieve states passed from recording page
  const { audioBlob, durationSeconds, questionId, questionText, mode, difficulty } = location.state || {};

  const loadingMessages = [
    'Sending audio to transcription service...',
    'Transcribing voice via Whisper models...',
    'Parsing transcription text words...',
    'Analyzing filler word counts and density...',
    'Evaluating speaking fluency and speed rate...',
    'Measuring vocabulary complexity and diversity...',
    'Contacting LanguageTool API for grammar validation...',
    'Comparing response against expected question keywords...',
    'Computing final weighted communication grades...',
    'Generating actionable improvement suggestions...',
    'Saving results to local historical SQLite DB...'
  ];

  useEffect(() => {
    // Redirect if no audio data is found
    if (!audioBlob || !questionId) {
      navigate('/setup');
      return;
    }

    let messageIndex = 0;
    const interval = setInterval(() => {
      if (messageIndex < loadingMessages.length - 1) {
        messageIndex++;
        setStatusMessage(loadingMessages[messageIndex]);
      }
    }, 1800);

    const runAnalysisPipeline = async () => {
      try {
        // Step 1: Transcribe Audio
        setStatusMessage(loadingMessages[0]);
        const transRes = await submitAudio(audioBlob);
        
        // Step 2: Analyze Transcript
        setStatusMessage(loadingMessages[4]); // Jump to analysis messages
        const report = await analyzeInterview(
          questionId, 
          transRes.transcript, 
          transRes.duration_seconds || durationSeconds
        );

        // Step 3: Redirect to Report
        navigate('/report', { state: { report } });
      } catch (err) {
        console.error(err);
        setError(err.message || 'An error occurred during speech analysis.');
      }
    };

    runAnalysisPipeline();

    return () => {
      clearInterval(interval);
    };
  }, [audioBlob, questionId]);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 transition-colors duration-300">
      <div className="max-w-md w-full text-center space-y-6 bg-white dark:bg-slate-900/60 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-md">
        
        {error ? (
          <div className="space-y-4">
            <div className="p-3 bg-red-50 dark:bg-red-950/20 text-red-500 rounded-2xl w-fit mx-auto border border-red-100 dark:border-red-900/30">
              <MessageSquareCode className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Pipeline Failed</h3>
            <p className="text-sm text-red-600 dark:text-red-400 font-medium leading-relaxed">{error}</p>
            <button
              onClick={() => navigate('/setup')}
              className="mt-2 px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold"
            >
              Back to Setup
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Spinning Loader */}
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center bg-primary-50 dark:bg-primary-950/20 rounded-full">
              <Loader2 className="h-10 w-10 text-primary-500 animate-spin" />
              <Sparkles className="h-4 w-4 text-indigo-500 absolute top-2 right-2 animate-bounce" />
            </div>

            {/* Title */}
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                Processing Response
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest font-semibold">
                Do not refresh this page
              </p>
            </div>

            {/* Dynamic Status Text */}
            <div className="h-10 flex items-center justify-center">
              <p className="text-sm text-slate-600 dark:text-slate-300 font-medium transition-all duration-300 animate-pulse">
                {statusMessage}
              </p>
            </div>

            {/* Decorative Skeleton Cards */}
            <div className="space-y-3 pt-4 border-t border-slate-50 dark:border-slate-800/80">
              <div className="h-4 bg-slate-100 dark:bg-slate-850 rounded-full w-3/4 mx-auto animate-pulse"></div>
              <div className="h-3 bg-slate-100 dark:bg-slate-850 rounded-full w-1/2 mx-auto animate-pulse"></div>
              <div className="h-3 bg-slate-100 dark:bg-slate-850 rounded-full w-5/6 mx-auto animate-pulse"></div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
