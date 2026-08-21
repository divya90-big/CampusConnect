
import React, { useState, useRef } from 'react';
import { critiqueDesign } from '../services/gemini';
import { CriticReview } from '../types';

const DesignCritic: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [review, setReview] = useState<CriticReview | null>(null);
  const [loading, setLoading] = useState(false);
  const [focus, setFocus] = useState('overall user experience and visual hierarchy');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setReview(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCritique = async () => {
    if (!image) return;
    setLoading(true);
    const result = await critiqueDesign(image, focus);
    setReview(result);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-view">
      <div className="space-y-2">
        <h2 className="text-3xl font-outfit font-bold">Design Critic</h2>
        <p className="text-secondary">Upload a screenshot of your work for objective, expert-level UI/UX feedback.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`glass relative rounded-3xl border-2 border-dashed aspect-[4/3] flex flex-col items-center justify-center cursor-pointer transition-all ${
              image ? 'theme-border' : 'border-gray-500/10 hover:theme-border-soft'
            }`}
          >
            {image ? (
              <img src={image} alt="Upload" className="w-full h-full object-cover rounded-2xl" />
            ) : (
              <>
                <div className="text-4xl mb-4">🖼️</div>
                <p className="text-secondary font-medium">Click to upload screenshot</p>
                <p className="text-[10px] text-secondary/40 uppercase font-black tracking-widest mt-2">PNG, JPG supported</p>
              </>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept="image/*"
            />
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-secondary block uppercase tracking-widest">Focus Area</label>
            <textarea 
              value={focus}
              onChange={(e) => setFocus(e.target.value)}
              className="w-full bg-gray-500/5 border border-gray-500/10 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-accent/50 text-main min-h-[100px]"
              placeholder="e.g. Focus on conversion optimization and button accessibility"
            />
            <button 
              onClick={handleCritique}
              disabled={loading || !image}
              className="w-full theme-bg hover:opacity-90 disabled:bg-gray-700 text-white py-4 rounded-2xl font-bold transition-all shadow-xl shadow-accent/20"
            >
              {loading ? 'Analyzing with Gemini Vision...' : 'Start Design Review'}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {review ? (
            <div className="glass p-8 rounded-3xl border border-gray-500/10 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] text-secondary uppercase font-black tracking-widest mb-1">Expert Rating</p>
                  <div className="text-5xl font-outfit font-extrabold text-main">{review.rating}<span className="text-secondary text-2xl font-medium">/10</span></div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-secondary uppercase font-black tracking-widest mb-1">Accessibility</p>
                  <div className="text-2xl font-bold theme-accent">{review.accessibilityScore}%</div>
                </div>
              </div>

              <div className="space-y-6">
                <section>
                  <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Strengths
                  </h4>
                  <ul className="space-y-2">
                    {review.positives.map((p, i) => (
                      <li key={i} className="text-secondary text-xs pl-4 border-l border-emerald-500/30">{p}</li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h4 className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span> Opportunities
                  </h4>
                  <ul className="space-y-2">
                    {review.improvements.map((imp, i) => (
                      <li key={i} className="text-secondary text-xs pl-4 border-l border-amber-500/30">{imp}</li>
                    ))}
                  </ul>
                </section>

                <section className="pt-4 border-t border-gray-500/5">
                  <p className="text-secondary text-xs leading-relaxed italic">
                    "{review.summary}"
                  </p>
                </section>
              </div>
            </div>
          ) : (
            <div className="h-full glass rounded-3xl border-2 border-dashed border-gray-500/5 flex flex-col items-center justify-center p-12 text-center text-gray-500">
              <div className="text-5xl mb-6 grayscale opacity-40">🤖</div>
              <h3 className="text-lg font-bold text-secondary mb-2">Awaiting Upload</h3>
              <p className="text-xs max-w-[200px]">Once you upload a design and start the review, my analysis will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DesignCritic;
