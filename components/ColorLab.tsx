
import React, { useState } from 'react';
import { generatePalette } from '../services/gemini';
import { ColorPalette } from '../types';

const ColorLab: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [palette, setPalette] = useState<ColorPalette | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt || loading) return;

    setLoading(true);
    const result = await generatePalette(prompt);
    setPalette(result);
    setLoading(false);
  };

  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-view">
      <div className="space-y-2 text-center">
        <h2 className="text-4xl font-outfit font-extrabold">Color Intelligence Lab</h2>
        <p className="text-secondary text-lg">Harness AI reasoning to craft mathematically harmonious brand palettes.</p>
      </div>

      <form onSubmit={handleGenerate} className="max-w-2xl mx-auto flex gap-3 p-2 glass rounded-3xl border border-gray-500/10">
        <input 
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe a brand vibe (e.g. 'Eco-luxury skincare')"
          className="flex-1 bg-transparent px-6 py-4 focus:outline-none text-main text-lg placeholder:text-gray-500"
        />
        <button 
          disabled={loading || !prompt}
          className="theme-bg hover:opacity-90 disabled:bg-gray-700 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-accent/20 transition-all"
        >
          {loading ? 'Thinking...' : 'Extract Palette'}
        </button>
      </form>

      {palette && (
        <div className="space-y-12 animate-in fade-in zoom-in-95 duration-700">
          <div className="flex flex-col md:flex-row gap-4 h-64">
            {palette.colors.map((color, idx) => (
              <div 
                key={idx} 
                className="group relative flex-1 h-full rounded-3xl transition-all hover:flex-[1.5] cursor-pointer shadow-lg"
                style={{ backgroundColor: color.hex }}
                onClick={() => copyToClipboard(color.hex)}
              >
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl flex flex-col items-center justify-center text-white">
                  <span className="text-sm font-bold">{color.hex}</span>
                  <span className="text-[10px] uppercase font-bold tracking-widest mt-1 opacity-70">Click to copy</span>
                </div>
                <div className="absolute bottom-6 left-6 text-white text-shadow-lg pointer-events-none">
                  <p className="text-[10px] uppercase font-black tracking-widest opacity-80">{color.label}</p>
                  <p className="text-lg font-outfit font-bold">{color.hex}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="glass p-8 rounded-3xl border border-gray-500/10">
              <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span className="theme-accent">🎨</span> Palette Logic
              </h4>
              <p className="text-secondary text-sm leading-relaxed italic">
                "{palette.usage}"
              </p>
            </div>
            
            <div className="glass p-8 rounded-3xl border border-gray-500/10">
              <h4 className="text-lg font-bold mb-4">Implementation Hub</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 rounded-xl bg-gray-500/5 border border-gray-500/5">
                  <span className="text-secondary text-xs uppercase font-black">CSS Variables</span>
                  <span className="text-secondary text-[10px] font-mono">:root {'{ ... }'}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-xl bg-gray-500/5 border border-gray-500/5">
                  <span className="text-secondary text-xs uppercase font-black">Tailwind Config</span>
                  <span className="text-secondary text-[10px] font-mono">colors: {'{ custom: ... }'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorLab;
