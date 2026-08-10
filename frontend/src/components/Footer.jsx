import React from 'react';
import { Shield, GitBranch, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 text-slate-500 dark:text-slate-400 text-xs">
          
          {/* Positioning tagline */}
          <div className="flex items-center space-x-2">
            <Sparkles className="h-4 w-4 text-primary-500 animate-pulse" />
            <span>InterviewCoach AI — Objective, multi-dimensional communication analytics.</span>
          </div>

          {/* Additional details */}
          <div className="flex items-center space-x-6">
            <span className="flex items-center space-x-1">
              <Shield className="h-3.5 w-3.5" />
              <span>Local Offline Privacy</span>
            </span>
            <span className="flex items-center space-x-1">
              <GitBranch className="h-3.5 w-3.5" />
              <span>Open Source SQLite</span>
            </span>
          </div>

          {/* Copyright */}
          <div>
            &copy; {new Date().getFullYear()} InterviewCoach AI. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
