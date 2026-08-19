import React from 'react';
import { BookOpen, CheckCircle, Clock, AlertTriangle, HelpCircle, Star, Sparkles } from 'lucide-react';

export default function Tips() {
  const tipsCategories = [
    {
      title: 'Filler Word Reduction',
      icon: AlertTriangle,
      iconColor: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
      tips: [
        'Practice the "Silent Pause". Instead of filling gaps with "um" or "like", close your mouth and take a breath. Silent pauses convey thoughtfulness and authority.',
        'Record yourself reading short passages out loud. Note which words you tend to repeat when thinking.',
        'Slow down your initial response speed. Speaking 10% slower gives your brain more time to construct sentences without filler buffers.'
      ]
    },
    {
      title: 'Fluency & Pacing',
      icon: Clock,
      iconColor: 'text-primary-500',
      bgColor: 'bg-primary-500/10',
      tips: [
        'Aim for the sweet spot: 110 to 160 Words Per Minute (WPM). Speaking too fast causes you to lose the listener; speaking too slowly bores them.',
        'Match breathing to punctuation. Complete a sentence, take a brief breath (1 second), then start the next sentence.',
        'Vary your speaking pace. Slow down to emphasize critical project details, and return to normal pace for introductory info.'
      ]
    },
    {
      title: 'Vocabulary & Variety',
      icon: BookOpen,
      iconColor: 'text-indigo-500',
      bgColor: 'bg-indigo-500/10',
      tips: [
        'Avoid repeating words like "good", "nice", or "project" repeatedly. Practice synonym swapping (e.g., "efficient", "beneficial", "initiative").',
        'Learn transition phrases. Use "Furthermore", "Consequently", "On the other hand", and "Illustrating this point" to tie thoughts together.',
        'Expand technical jargon. Ensure you use specific technical vocabulary terms correctly (e.g., "encapsulation" rather than "hiding data").'
      ]
    },
    {
      title: 'Behavioral Answer Structure (STAR)',
      icon: Star,
      iconColor: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
      tips: [
        '**Situation (15%)**: Outline the context, team size, and goals. Set the stage concisely.',
        '**Task (15%)**: Describe the specific challenge, problem, or goal you were responsible for resolving.',
        '**Action (50%)**: Detail the steps you personally took. Highlight skills, tools used, and collaboration.',
        '**Result (20%)**: Describe the quantitative or qualitative outcome (e.g., "reduced latency by 20%"). Explain what you learned.'
      ]
    }
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Communication Handbook</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Speaking & Presentation Tips
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Improve your communication metrics with these expert mock interview guidelines.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tipsCategories.map((category) => {
            const Icon = category.icon;
            return (
              <div key={category.title} className="bg-white dark:bg-slate-900/60 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                <div>
                  {/* Category Header */}
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`p-2.5 rounded-xl ${category.bgColor} ${category.iconColor}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                      {category.title}
                    </h3>
                  </div>

                  {/* Tips List */}
                  <ul className="space-y-3.5">
                    {category.tips.map((tip, idx) => (
                      <li key={idx} className="flex items-start space-x-2.5">
                        <CheckCircle className="h-4 w-4 text-slate-300 dark:text-slate-650 mt-0.5 flex-shrink-0" />
                        <span className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-medium">
                          {/* Format bold tags in STAR method */}
                          {tip.includes('**') ? (
                            tip.split('**').map((part, i) => i % 2 === 1 ? <strong key={i} className="text-slate-800 dark:text-slate-205 font-bold">{part}</strong> : part)
                          ) : tip}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
