import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { startInterview, uploadResume } from '../utils/api';
import { 
  BrainCircuit, 
  Briefcase, 
  HelpCircle, 
  GraduationCap, 
  ChevronRight, 
  Zap, 
  FileText, 
  Upload, 
  Check, 
  AlertCircle 
} from 'lucide-react';

export default function InterviewSetup() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('HR');
  const [difficulty, setDifficulty] = useState('Easy');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Resume Mode specific states
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeQuestions, setResumeQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [isUploadingResume, setIsUploadingResume] = useState(false);

  const handleStart = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (mode === 'Resume') {
        if (!selectedQuestion) {
          throw new Error('Please upload a resume and select one of the generated questions to practice.');
        }
        
        // Pass the dynamically cached question text and ID straight to the live recording panel
        navigate('/live', { 
          state: { 
            questionId: selectedQuestion.id, 
            questionText: selectedQuestion.question,
            mode: 'Resume Mode',
            difficulty: 'Medium'
          } 
        });
      } else {
        // Standard category interview path
        const data = await startInterview(mode, difficulty);
        navigate('/live', { 
          state: { 
            questionId: data.question_id, 
            questionText: data.question_text,
            mode,
            difficulty
          } 
        });
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Could not fetch a question. Check if backend is online.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate extension
    const ext = file.name.split('.').pop().toLowerCase();
    if (ext !== 'pdf' && ext !== 'txt') {
      setError('Please upload a PDF (.pdf) or Text (.txt) file.');
      return;
    }

    setResumeFile(file);
    setError(null);
    setResumeQuestions([]);
    setSelectedQuestion(null);
    setIsUploadingResume(true);

    try {
      const questions = await uploadResume(file);
      setResumeQuestions(questions);
      if (questions.length > 0) {
        setSelectedQuestion(questions[0]); // Default select first question
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to parse resume. Verify that the backend is online.');
      setResumeFile(null);
    } finally {
      setIsUploadingResume(false);
    }
  };

  const modes = [
    { id: 'HR', label: 'HR / General', desc: 'Personal background, strengths, and career goals.', icon: Briefcase },
    { id: 'Behavioral', label: 'Behavioral', desc: 'Situation handling, conflicts, and decision making.', icon: BrainCircuit },
    { id: 'Technical', label: 'Technical', desc: 'Computer science, database systems, and structures.', icon: GraduationCap },
    { id: 'Resume', label: 'Resume Mode', desc: 'Upload your CV and practice custom questions.', icon: FileText }
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
            Select an interview type or upload a resume to generate customized questions.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-2xl text-sm text-red-600 dark:text-red-400 font-medium flex items-start space-x-2">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Step 1: Select Mode */}
        <div className="space-y-4">
          <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
            Step 1: Choose Interview Type
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

        {/* Mode-Specific Settings */}
        {mode === 'Resume' ? (
          /* Resume Upload Panel */
          <div className="space-y-6 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm transition-all duration-300">
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Resume Upload</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500">Upload your CV in PDF or TXT format. Our parser extracts skills and projects locally.</p>
            </div>

            {/* Dropzone design */}
            <div className="relative border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-center hover:border-primary-400 dark:hover:border-primary-500 transition-colors">
              <input 
                type="file" 
                id="resume-file-input"
                onChange={handleFileChange}
                accept=".pdf,.txt"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isUploadingResume}
              />
              
              {isUploadingResume ? (
                <div className="space-y-3 py-4">
                  <div className="h-6 w-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-xs text-slate-500 dark:text-slate-450 font-semibold animate-pulse">Analyzing CV & generating custom questions...</p>
                </div>
              ) : resumeFile ? (
                <div className="flex flex-col items-center justify-center space-y-2 py-2">
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 rounded-xl">
                    <Check className="h-6 w-6" />
                  </div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-100">{resumeFile.name}</p>
                  <p className="text-[10px] text-slate-400">Click or drag another file to replace</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-2 py-4">
                  <div className="p-3 bg-primary-50 dark:bg-primary-950/20 text-primary-500 rounded-xl">
                    <Upload className="h-6 w-6" />
                  </div>
                  <p className="text-xs font-bold text-slate-650 dark:text-slate-300">Click or drag file here</p>
                  <p className="text-[10px] text-slate-400">PDF or TXT up to 5MB</p>
                </div>
              )}
            </div>

            {/* Questions generated */}
            {resumeQuestions.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-slate-50 dark:border-slate-850">
                <label className="text-xs font-bold text-slate-450 dark:text-slate-500 uppercase tracking-widest block">
                  Select Generated Question
                </label>
                <div className="space-y-2.5">
                  {resumeQuestions.map((q) => {
                    const isSelected = selectedQuestion?.id === q.id;
                    return (
                      <button
                        key={q.id}
                        onClick={() => setSelectedQuestion(q)}
                        className={`w-full text-left p-4 rounded-xl border text-xs leading-relaxed font-semibold transition-all duration-150 ${
                          isSelected
                            ? 'border-primary-500 bg-primary-50/20 text-primary-700 dark:text-primary-300'
                            : 'border-slate-150 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {q.question}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Step 2: Select Difficulty */
          <div className="space-y-4 animate-fade-in">
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
        )}

        {/* Start Button */}
        <div className="pt-6">
          <button
            onClick={handleStart}
            disabled={isLoading || (mode === 'Resume' && !selectedQuestion)}
            className="w-full flex items-center justify-center space-x-2 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-2xl transition-all shadow-md active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none"
          >
            {isLoading ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Zap className="h-4 w-4 fill-white" />
                <span>{mode === 'Resume' ? 'Start Practice session' : 'Generate & Start Question'}</span>
                <ChevronRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
