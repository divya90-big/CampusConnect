
import React, { useEffect } from 'react';

const AptitudePrep: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const resources = [
    {
      category: 'Conceptual Foundations',
      links: [
        { name: 'W3Schools', url: 'https://www.w3schools.com/', desc: 'Master foundational syntax, programming logic, and web core concepts.' },
        { name: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/aptitude-questions/', desc: 'Comprehensive technical notes and logical reasoning breakdowns.' },
        { name: 'TutorialsPoint DI', url: 'https://www.tutorialspoint.com/data_interpretation/index.htm', desc: 'Learn how to read and understand charts and graphs for exams.' },
        { name: 'Exercism', url: 'https://exercism.org/', desc: 'Free practice in 60+ programming languages with expert mentoring.' },
        { name: 'TalentBattle', url: 'https://talentbattle.in/', desc: 'Mock tests to get ready for company-specific hiring rounds.' }
      ]
    },
    {
      category: 'Practice Portals',
      links: [
        { name: 'IndiaBIX', url: 'https://www.indiabix.com/', desc: 'High-volume MCQ practice for quantitative and logical aptitude.' },
        { name: 'Sawaal.com', url: 'https://www.sawaal.com/aptitude-reasoning-questions-and-answers.html', desc: 'Extensive bank of actual placement papers from TCS, Infosys, and more.' }
      ]
    },
    {
      category: 'Current Affairs',
      links: [
        { name: 'Jagran Josh', url: 'https://www.jagranjosh.com/general-knowledge', desc: 'Stay updated with daily GK, current events, and monthly quizzes.' },
        { name: 'GKToday', url: 'https://www.gktoday.in/', desc: 'Elite repository for monthly current affairs curated for graduates.' },
        { name: 'BankersAdda', url: 'https://www.bankersadda.com/current-affairs/', desc: 'Quick daily updates on news and important events for competitive tests.' }
      ]
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20 animate-view">
      <div className="space-y-2">
        <h2 className="text-3xl font-outfit font-bold tracking-tight">Aptitude Preparation</h2>
        <p className="text-secondary">Comprehensive conceptual study materials and high-volume practice banks.</p>
      </div>

      <div className="space-y-12">
        {resources.map((group, idx) => (
          <div key={idx} className="space-y-5">
            <h3 className="text-sm font-black theme-accent uppercase tracking-[0.25em] flex items-center gap-3">
              <span className="w-2 h-2 rounded-full theme-bg shadow-[0_0_12px_rgb(var(--accent-rgb))]"></span>
              {group.category}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {group.links.map((link, lIdx) => (
                <a 
                  key={lIdx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass p-7 rounded-[2rem] border border-gray-500/10 hover:theme-border-soft hover:theme-bg-soft transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-bold group-hover:theme-accent transition-colors text-lg tracking-tight">{link.name}</span>
                      <span className="text-[10px] text-secondary font-black uppercase tracking-widest">Launch ↗</span>
                    </div>
                    <p className="text-xs text-secondary leading-relaxed font-medium">{link.desc}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AptitudePrep;
