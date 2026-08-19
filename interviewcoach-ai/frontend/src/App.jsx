import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import InterviewSetup from './pages/InterviewSetup';
import LiveInterview from './pages/LiveInterview';
import Processing from './pages/Processing';
import ReportDashboard from './pages/ReportDashboard';
import Tips from './pages/Tips';
import History from './pages/History';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
        {/* Navigation header */}
        <Navbar />
        
        {/* Main pages container */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/setup" element={<InterviewSetup />} />
            <Route path="/live" element={<LiveInterview />} />
            <Route path="/processing" element={<Processing />} />
            <Route path="/report" element={<ReportDashboard />} />
            <Route path="/tips" element={<Tips />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </main>
        
        {/* Page footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
