
import React, { useState } from 'react';
import { generateImage } from '../services/gemini';

const MoodboardAI: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt || loading) return;

    setLoading(true);
    const result = await generateImage(prompt);
    if (result) {
      setImages(prev => [result, ...prev]);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-view">
      <div className="space-y-2">
        <h2 className="text-3xl font-outfit font-bold">Moodboard AI</h2>
        <p className="text-secondary">Describe a visual concept and let Gemini 2.5 Flash bring it to life.</p>
      </div>

      <form onSubmit={handleGenerate} className="glass p-6 rounded-3xl border border-gray-500/10 flex flex-col md:flex-row gap-4">
        <input 
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. 'A futuristic minimalist coffee shop interior with neon accents'"
          className="flex-1 bg-gray-500/5 border border-gray-500/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-accent/50 text-main placeholder:text-gray-500"
        />
        <button 
          disabled={loading || !prompt}
          className="theme-bg hover:opacity-90 disabled:bg-gray-700 text-white px-8 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap shadow-xl shadow-accent/20"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Generating...
            </>
          ) : 'Generate Concept'}
        </button>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {images.map((img, i) => (
          <div key={i} className="group relative glass rounded-3xl overflow-hidden aspect-square border border-gray-500/10 transition-transform hover:scale-[1.02]">
            <img src={img} alt="Generated" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
              <button 
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = img;
                  link.download = `campus-concept-${i}.png`;
                  link.click();
                }}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-xl text-sm font-medium border border-white/10"
              >
                Download PNG
              </button>
            </div>
          </div>
        ))}
        {loading && (
          <div className="glass rounded-3xl aspect-square border-2 border-dashed theme-border flex items-center justify-center animate-pulse">
            <span className="text-secondary font-medium font-outfit uppercase tracking-widest text-xs">Visualizing...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoodboardAI;
