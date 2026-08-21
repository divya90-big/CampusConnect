
import React from 'react';
import { View, GlobalTheme, ThemeMode } from '../types';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
  currentTheme: GlobalTheme;
  onThemeChange: (theme: GlobalTheme) => void;
  currentMode: ThemeMode;
  onModeToggle: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  currentView, 
  onViewChange, 
  currentTheme, 
  onThemeChange,
  currentMode,
  onModeToggle,
  isOpen,
  onClose
}) => {
  const items = [
    { id: View.DASHBOARD, label: 'Home', icon: '🏠' },
    { id: View.APTITUDE, label: 'Aptitude Prep', icon: '📊' },
    { id: View.RESUME, label: 'Resume Studio', icon: '📄' },
    { id: View.INTERVIEW, label: 'Interview Qs', icon: '💬' },
    { id: View.MOCK_EXAM, label: 'Mock Assessment', icon: '📝' },
  ];

  const themes = [
    { id: GlobalTheme.MIDNIGHT, color: '#3b82f6', label: 'Midnight' },
    { id: GlobalTheme.EMERALD, color: '#10b981', label: 'Emerald' },
    { id: GlobalTheme.ROSE, color: '#f43f5e', label: 'Rose' },
    { id: GlobalTheme.AMBER, color: '#f59e0b', label: 'Amber' },
  ];

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      <div className={`w-72 h-full border-r border-gray-500/10 flex flex-col glass fixed left-0 top-0 z-[80] transition-transform duration-500 ease-out shadow-2xl ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 flex justify-between items-start">
          <div>
            <h1 className="text-xl font-outfit font-bold tracking-tight text-main">
              <span className="theme-accent">Campus</span>Connect
            </h1>
            <p className="text-[10px] text-secondary mt-1 uppercase tracking-widest font-semibold">Career Suite</p>
          </div>
          <div className="flex flex-col gap-2">
            <button onClick={onModeToggle} className="p-2 rounded-lg bg-gray-500/10 hover:bg-gray-500/20 transition-all text-sm">{currentMode === ThemeMode.DARK ? '🌙' : '☀️'}</button>
            <button onClick={onClose} className="p-2 rounded-lg bg-gray-500/10 hover:bg-gray-500/20 transition-all text-sm">✕</button>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto no-scrollbar">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onViewChange(item.id);
                onClose();
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                currentView === item.id 
                  ? 'theme-bg-soft theme-accent border theme-border-soft font-bold' 
                  : 'text-secondary hover:bg-gray-500/5 hover:text-main'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-gray-500/10 space-y-4">
          <p className="text-[9px] text-secondary uppercase font-black tracking-widest text-center">Theme Accent</p>
          <div className="flex justify-center gap-4">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => onThemeChange(t.id)}
                className={`w-5 h-5 rounded-full border-2 transition-all ${currentTheme === t.id ? 'border-main scale-125' : 'border-transparent opacity-40'}`}
                style={{ backgroundColor: t.color }}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
