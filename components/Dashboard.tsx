
import React, { useEffect } from 'react';
import { View } from '../types';

interface DashboardProps {
  onStartAction: (view: View) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onStartAction }) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="space-y-12 max-w-5xl mx-auto animate-view">
      <header className="space-y-4">
        <h2 className="text-4xl md:text-5xl font-outfit font-extrabold">
          Elevate Your <span className="gradient-text">Career Potential.</span>
        </h2>
        <p className="text-secondary text-lg max-w-2xl leading-relaxed">
          Master Your Future with AI-Driven Placement Intelligence.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ActionCard 
          title="Aptitude Prep" 
          description="Access curated conceptual studies and top-tier practice platforms like IndiaBIX and GFG."
          icon="📊"
          onClick={() => onStartAction(View.APTITUDE)}
        />
        <ActionCard 
          title="Resume Studio" 
          description="Build professional resumes and run AI-powered ATS scans for modern hiring compatibility."
          icon="📄"
          onClick={() => onStartAction(View.RESUME)}
        />
        <ActionCard 
          title="Interview Library" 
          description="Access 500+ standard questions and top-tier external preparation resources."
          icon="💬"
          onClick={() => onStartAction(View.INTERVIEW)}
        />
        <ActionCard 
          title="Mock Assessment" 
          description="Take a 30-question adaptive aptitude test or explore the Technical Lab resources."
          icon="📝"
          onClick={() => onStartAction(View.MOCK_EXAM)}
        />
      </div>
    </div>
  );
};

const ActionCard = ({ title, description, icon, onClick }: any) => {
  return (
    <button 
      onClick={onClick}
      className="glass group p-8 rounded-3xl text-left transition-all duration-300 border border-gray-500/10 hover:theme-border-soft hover:theme-glow hover:scale-[1.01] active:scale-[0.99]"
    >
      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{icon}</div>
      <h4 className="text-xl font-bold mb-2 group-hover:theme-accent transition-colors">{title}</h4>
      <p className="text-secondary text-sm leading-relaxed">{description}</p>
    </button>
  );
};

export default Dashboard;
