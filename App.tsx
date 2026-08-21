
import React, { useState, Suspense, lazy, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import { View, GlobalTheme, ThemeMode, QuizQuestion } from './types';
import { generateMockExam } from './services/gemini';

const Dashboard = lazy(() => import('./components/Dashboard'));
const AptitudePrep = lazy(() => import('./components/AptitudePrep'));
const ResumeBuilder = lazy(() => import('./components/ResumeBuilder'));
const InterviewQuestions = lazy(() => import('./components/InterviewQuestions'));
const MockExam = lazy(() => import('./components/MockExam'));

const LoadingFallback = () => (
  <div className="flex flex-col items-center justify-center py-40 space-y-6">
    <div className="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin"></div>
    <p className="text-[10px] text-secondary font-black uppercase tracking-widest animate-pulse">Synchronizing Data...</p>
  </div>
);

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [theme, setTheme] = useState<GlobalTheme>(GlobalTheme.MIDNIGHT);
  const [mode, setMode] = useState<ThemeMode>(ThemeMode.DARK);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [prefetchedAptitude, setPrefetchedAptitude] = useState<QuizQuestion[]>([]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-mode', mode);
  }, [mode]);

  // Pre-fetch logic for Aptitude Exam
  const fetchNextAptitude = async () => {
    try {
      const data = await generateMockExam('aptitude');
      setPrefetchedAptitude(data);
    } catch (e) {
      console.warn("Auto-prefetch failed, will retry on demand.", e);
    }
  };

  useEffect(() => {
    // Load first set on entry
    fetchNextAptitude();
  }, []);

  const renderView = () => {
    switch (currentView) {
      case View.DASHBOARD: return <Dashboard onStartAction={setCurrentView} />;
      case View.APTITUDE: return <AptitudePrep />;
      case View.RESUME: return <ResumeBuilder />;
      case View.INTERVIEW: return <InterviewQuestions />;
      case View.MOCK_EXAM: return (
        <MockExam 
          prefetchedAptitude={prefetchedAptitude} 
          onFetchNext={fetchNextAptitude} 
        />
      );
      default: return <Dashboard onStartAction={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-transparent flex overflow-x-hidden relative">
      <Sidebar 
        currentView={currentView} 
        onViewChange={(v) => {
          window.scrollTo({ top: 0, behavior: 'instant' });
          setCurrentView(v);
        }} 
        currentTheme={theme}
        onThemeChange={setTheme}
        currentMode={mode}
        onModeToggle={() => setMode(m => m === ThemeMode.DARK ? ThemeMode.LIGHT : ThemeMode.DARK)}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      <div className="fixed top-6 left-6 z-[60]">
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="glass p-4 rounded-2xl border border-gray-500/10 hover:theme-border hover:theme-bg-soft transition-all group flex items-center gap-3 shadow-2xl"
          title="Open Menu"
        >
          <div className="flex flex-col gap-1.5">
            <span className="w-5 h-0.5 bg-current rounded-full theme-accent transition-all group-hover:w-6"></span>
            <span className="w-6 h-0.5 bg-current rounded-full transition-all"></span>
            <span className="w-4 h-0.5 bg-current rounded-full theme-accent transition-all group-hover:w-6"></span>
          </div>
          <span className="hidden sm:inline text-[10px] font-black uppercase tracking-widest text-secondary group-hover:text-main">Menu</span>
        </button>
      </div>

      <main className="flex-1 p-6 md:p-14 lg:pt-24 transition-all duration-300 flex flex-col min-h-screen max-w-[100vw]">
        <div className="lg:hidden mb-12 flex items-center justify-center">
          <h1 className="text-lg font-outfit font-bold tracking-tight">
            <span className="theme-accent">Campus</span>Connect
          </h1>
        </div>

        <div className="animate-view flex-1">
          <Suspense fallback={<LoadingFallback />}>
            {renderView()}
          </Suspense>
        </div>

        <footer className="mt-20 py-8 border-t border-gray-500/10 flex flex-col items-center text-center">
          <div className="theme-bg-soft border theme-border-soft px-8 py-3 rounded-full flex items-center gap-3 mb-4 max-w-full">
            <span className="theme-accent">💡</span>
            <p className="text-[11px] text-secondary font-medium italic truncate">Master your placement journey with AI-driven insights.</p>
          </div>
          <p className="text-[10px] text-secondary/40 uppercase font-black tracking-widest">© 2025 Campus Connect Suite</p>
        </footer>
      </main>
    </div>
  );
};

export default App;
