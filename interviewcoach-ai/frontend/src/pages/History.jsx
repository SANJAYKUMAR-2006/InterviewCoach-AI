import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHistory } from '../utils/api';
import ProgressChart from '../components/ProgressChart';
import { Calendar, Briefcase, ChevronRight, BarChart2, Inbox, Loader2 } from 'lucide-react';

export default function History() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getHistory();
        setHistory(data);
      } catch (err) {
        console.error(err);
        setError('Could not retrieve practice history logs.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const handleRowClick = (attempt) => {
    // The history item has the exact same shape as the report JSON
    navigate('/report', { state: { report: attempt } });
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20';
    if (score >= 60) return 'text-amber-500 bg-amber-50 dark:bg-amber-950/20';
    return 'text-red-500 bg-red-50 dark:bg-red-950/20';
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Map history attempts to trend format: [ { date: string, score: number } ]
  const trendChartData = history.map((h) => ({
    date: h.date,
    score: h.confidence_score
  }));

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Practice Performance History
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track your confidence scoring progression over time.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-2xl text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-20 bg-white dark:bg-slate-900/40 rounded-3xl border border-slate-100 dark:border-slate-800">
            <div className="text-center space-y-3">
              <Loader2 className="h-8 w-8 text-primary-500 animate-spin mx-auto" />
              <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold">Loading practice history logs...</p>
            </div>
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900/40 rounded-3xl border border-slate-100 dark:border-slate-850 p-6">
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-full w-fit mx-auto mb-4">
              <Inbox className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">No attempts found</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-sm mx-auto">
              You haven't recorded any mock interview answers yet. Complete your first practice to generate metrics!
            </p>
            <button
              onClick={() => navigate('/setup')}
              className="mt-6 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-bold shadow-sm"
            >
              Start First Practice
            </button>
          </div>
        ) : (
          <>
            {/* Trend Chart */}
            <div className="bg-white dark:bg-slate-800/40 p-6 rounded-3xl border border-slate-100 dark:border-slate-700/50 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center space-x-2">
                <BarChart2 className="h-4 w-4 text-primary-500" />
                <span>Score Progression Trend</span>
              </h3>
              <ProgressChart type="trend" data={trendChartData} />
            </div>

            {/* Attempts Table */}
            <div className="bg-white dark:bg-slate-800/40 rounded-3xl border border-slate-100 dark:border-slate-700/50 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-50 dark:border-slate-800/80">
                <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  Practice Attempts Log ({history.length})
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/55 dark:bg-slate-900/30 text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider">
                      <th className="py-4 px-6">Date</th>
                      <th className="py-4 px-6">Question</th>
                      <th className="py-4 px-6">Mode</th>
                      <th className="py-4 px-6 text-center">WPM / Fillers</th>
                      <th className="py-4 px-6 text-right">Score</th>
                      <th className="py-4 px-6"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm font-medium">
                    {history.map((attempt) => (
                      <tr 
                        key={attempt.attempt_id}
                        onClick={() => handleRowClick(attempt)}
                        className="hover:bg-slate-50/40 dark:hover:bg-slate-900/20 cursor-pointer transition-colors duration-150 group"
                      >
                        {/* Date */}
                        <td className="py-4 px-6 text-slate-500 dark:text-slate-400 whitespace-nowrap text-xs">
                          <div className="flex items-center space-x-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>{formatDate(attempt.date)}</span>
                          </div>
                        </td>

                        {/* Question */}
                        <td className="py-4 px-6 text-slate-800 dark:text-slate-200 max-w-xs truncate font-semibold">
                          {attempt.question_text}
                        </td>

                        {/* Mode */}
                        <td className="py-4 px-6 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-650 dark:text-slate-405 font-bold">
                              {attempt.mode}
                            </span>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                              attempt.difficulty === 'Easy' ? 'text-emerald-500' : attempt.difficulty === 'Medium' ? 'text-amber-500' : 'text-red-500'
                            }`}>
                              {attempt.difficulty}
                            </span>
                          </div>
                        </td>

                        {/* Stats */}
                        <td className="py-4 px-6 text-center whitespace-nowrap text-slate-500 dark:text-slate-405 text-xs font-semibold">
                          <span>{attempt.words_per_minute} WPM</span>
                          <span className="mx-2 text-slate-300">|</span>
                          <span className={`${attempt.filler_count > 2 ? 'text-amber-500' : ''}`}>{attempt.filler_count} Fillers</span>
                        </td>

                        {/* Score */}
                        <td className="py-4 px-6 text-right whitespace-nowrap">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getScoreColor(attempt.confidence_score)}`}>
                            {attempt.confidence_score}
                          </span>
                        </td>

                        {/* View Link Icon */}
                        <td className="py-4 px-6 text-right whitespace-nowrap">
                          <ChevronRight className="h-5 w-5 text-slate-350 dark:text-slate-600 group-hover:text-primary-500 transition-colors" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
