
import React, { useState, useRef, useEffect } from 'react';
import { searchTrends } from '../services/gemini';
import { TrendsResult } from '../types';

const TrendsSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<{ role: 'user' | 'assistant', content: string, sources?: any[] }[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history, loading]);

  const cleanResponse = (text: string) => {
    // Keep basic bullet points and clean table artifacts
    return text
      .replace(/\|?\s*:?-+:?\s*\|/g, '') // Table separators
      .replace(/\|/g, ' ') // Table borders
      .replace(/\s{2,}/g, ' ') // Extra whitespace
      .replace(/[#*_]{2,}/g, '') // Excessive bolding
      .trim();
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query || loading) return;

    const userQuery = query;
    setQuery('');
    setHistory(prev => [...prev, { role: 'user', content: userQuery }]);
    setLoading(true);

    try {
      const data = await searchTrends(userQuery);
      if (data) {
        setHistory(prev => [...prev, { 
          role: 'assistant', 
          content: cleanResponse(data.text),
          sources: data.sources 
        }]);
      }
    } catch (err) {
      setHistory(prev => [...prev, { role: 'assistant', content: "Analysis failed. Please check your API key in .env.local and try again." }]);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-180px)] animate-view">
      <div className="flex justify-center mb-8">
        <h2 className="text-4xl font-outfit font-black text-main uppercase italic tracking-tighter">Market Trend AI</h2>
      </div>

      <div className="flex-1 overflow-y-auto space-y-8 pr-4 no-scrollbar pb-10">
        {history.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-60">
            <div className="w-16 h-16 rounded-full theme-bg-soft flex items-center justify-center text-3xl">🤖</div>
            <p className="text-sm max-w-sm mx-auto">Analyze salary benchmarks and hiring trends with real-time web grounding.</p>
            <div className="grid grid-cols-2 gap-3 max-w-md w-full">
              {['MERN Stack Salary 2025', 'Java vs Python demand', 'Cloud Jobs in India', 'AI Engineer roadmap'].map(q => (
                <button key={q} onClick={() => { setQuery(q); }} className="text-[10px] font-bold p-3 glass border border-gray-500/10 rounded-xl hover:theme-border transition-all">
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {history.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] flex flex-col gap-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`p-6 rounded-[2rem] text-sm leading-relaxed shadow-lg ${
                msg.role === 'user' 
                  ? 'theme-bg text-white rounded-tr-none' 
                  : 'glass border border-gray-500/10 text-main rounded-tl-none'
              }`}>
                <div className="whitespace-pre-wrap">{msg.content}</div>
                
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-8 pt-4 border-t border-gray-500/10">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40 mb-3">Grounding Sources</p>
                    <div className="flex flex-wrap gap-2">
                      {msg.sources.map((src, idx) => src.web && (
                        <a 
                          key={idx} 
                          href={src.web.uri} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[9px] px-3 py-1.5 rounded-lg bg-gray-500/5 hover:theme-bg-soft transition-all border border-gray-500/10 flex items-center gap-2"
                        >
                          <span className="opacity-40">🔗</span>
                          <span className="truncate max-w-[150px] font-bold">{src.web.title || 'Live Result'}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <span className="text-[9px] font-black uppercase opacity-30 tracking-widest px-4">
                {msg.role === 'user' ? 'You' : 'Gemini AI'}
              </span>
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex justify-start">
            <div className="glass border border-gray-500/10 p-6 rounded-[2rem] rounded-tl-none animate-pulse flex items-center gap-3">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full theme-bg animate-bounce"></div>
                <div className="w-1.5 h-1.5 rounded-full theme-bg animate-bounce delay-75"></div>
                <div className="w-1.5 h-1.5 rounded-full theme-bg animate-bounce delay-150"></div>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-secondary ml-2">Searching Web...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="pt-8 border-t border-gray-500/10">
        <form onSubmit={handleSearch} className="relative group">
          <input 
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type your query (e.g. Current hiring trends for React Developers)..."
            className="w-full glass bg-white/5 border border-gray-500/10 rounded-3xl px-8 py-6 pr-16 focus:outline-none focus:theme-border shadow-2xl transition-all font-medium text-main"
          />
          <button 
            type="submit"
            disabled={loading || !query}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl theme-bg text-white disabled:opacity-30 flex items-center justify-center transition-all shadow-xl hover:scale-105 active:scale-95"
          >
            <span className="text-xl">↑</span>
          </button>
        </form>
        <p className="text-[9px] text-center mt-4 opacity-30 uppercase font-black tracking-widest">Industry analysis with Real-time Search Grounding</p>
      </div>
    </div>
  );
};

export default TrendsSearch;
