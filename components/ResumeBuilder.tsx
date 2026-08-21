
import React, { useState, useEffect, useRef } from 'react';
import { generateResumeData, analyzeATS } from '../services/gemini';
import { ResumeData, ATSAnalysis } from '../types';

declare var mammoth: any;

const ResumeBuilder: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'manual' | 'ai'>('manual');
  const [isEditingAi, setIsEditingAi] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{ name: string, data: string, mimeType: string, textContent?: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [atsResult, setAtsResult] = useState<ATSAnalysis | null>(null);
  const [analyzingAts, setAnalyzingAts] = useState(false);
  
  const initialData: ResumeData = {
    fullName: '', mobile: '', email: '', socialLinks: '', portfolioIds: '', address: '', gender: '',
    objective: '', skills: '', coreCompetence: '', projects: '', experience: '', achievements: '',
    birthDate: '', martialStatus: '', languages: '',
    academics: [{ course: '', institution: '', board: '', year: '', score: '' }]
  };

  const [manualData, setManualData] = useState<ResumeData>(initialData);
  const [aiData, setAiData] = useState<ResumeData>(initialData);
  const [aiPrompt, setAiPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, []);

  const isValid = (val: string | undefined | null) => {
    if (!val) return false;
    const s = String(val).trim().toLowerCase();
    return s !== '' && s !== 'null' && s !== 'undefined' && s !== 'n/a' && s !== 'none';
  };

  const isResumeEmpty = (data: ResumeData) => !isValid(data.fullName) && !isValid(data.email) && !isValid(data.objective);
  const isPersonalSectionEmpty = (data: ResumeData) => !isValid(data.gender) && !isValid(data.birthDate) && !isValid(data.martialStatus);

  const handleManualChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setManualData({ ...manualData, [e.target.name]: e.target.value });
  };

  const handleAiEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setAiData({ ...aiData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setErrorMessage(null);
    if (file) {
      const reader = new FileReader();
      if (file.name.endsWith('.docx')) {
        reader.onload = async (event) => {
          try {
            const arrayBuffer = event.target?.result as ArrayBuffer;
            const result = await mammoth.extractRawText({ arrayBuffer: arrayBuffer });
            setUploadedFile({ name: file.name, data: '', mimeType: 'text/plain', textContent: result.value });
          } catch (err) { setErrorMessage("Mammoth failed to parse document."); }
        };
        reader.readAsArrayBuffer(file);
      } else {
        reader.onload = (event) => {
          setUploadedFile({ name: file.name, data: (event.target?.result as string).split(',')[1], mimeType: file.type });
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleGenerateAI = async () => {
    if ((!aiPrompt && !uploadedFile) || loading) return;
    setLoading(true);
    setErrorMessage(null);
    try {
      const finalPrompt = uploadedFile?.textContent 
        ? `I am providing text from my old resume. Parse it into a structured JSON: ${uploadedFile.textContent}\n\nAdditional instructions: ${aiPrompt}`
        : aiPrompt;
      const fileToUpload = (uploadedFile && uploadedFile.data) ? { data: uploadedFile.data, mimeType: uploadedFile.mimeType } : undefined;
      const data = await generateResumeData(finalPrompt, fileToUpload);
      if (data && isValid(data.fullName)) {
        setAiData(data);
        setIsEditingAi(true);
      } else {
        setErrorMessage("AI returned empty result. Ensure your .env.local file has a valid API_KEY.");
      }
    } catch (e: any) {
      const message = e?.message || "Unknown error";
      setErrorMessage(message.includes("API_KEY_MISSING") ? "Missing API Key in environment." : `AI request failed: ${message}`);
    }
    setLoading(false);
  };

  const handleAtsScan = async () => {
    const dataToScan = activeTab === 'manual' ? manualData : aiData;
    if (isResumeEmpty(dataToScan)) {
      setAtsResult({ score: 0, missingKeywords: ["Name/Contact/Objective"], formattingFeedback: ["Profile empty"], suggestedImprovements: ["Provide data first"] });
      return;
    }
    setAnalyzingAts(true);
    try {
      const result = await analyzeATS(dataToScan);
      if (result) setAtsResult(result);
    } catch (e) {}
    setAnalyzingAts(false);
  };

  const currentData = activeTab === 'manual' ? manualData : aiData;
  const getLines = (text: string) => text ? text.split(/\n/).map(line => line.trim()).filter(line => line.length > 0) : [];

  const downloadDocument = () => {
    const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><style>
        body { font-family: 'Arial', sans-serif; line-height: 1.4; color: #333; font-size: 10pt; }
        h1 { margin: 0; font-size: 20pt; text-transform: uppercase; font-weight: bold; text-align: center; }
        h2 { font-size: 11pt; margin-top: 14pt; padding-bottom: 2pt; font-weight: bold; border-bottom: 1.5pt solid #000; text-transform: uppercase; }
        .contact { color: #666; font-size: 9pt; text-align: center; margin-bottom: 10pt; }
      </style></head><body>`;
    
    let content = `<div style="text-align: center;"><h1>${currentData.fullName || 'RESUME'}</h1><div class="contact">`;
    if (isValid(currentData.email)) content += `${currentData.email} | `;
    if (isValid(currentData.mobile)) content += `${currentData.mobile}<br>`;
    if (isValid(currentData.address)) content += `${currentData.address}</div></div>`;

    if (isValid(currentData.objective)) content += `<h2>Objective</h2><p>${currentData.objective}</p>`;
    if (isValid(currentData.coreCompetence)) content += `<h2>Core Competence</h2><p>${currentData.coreCompetence}</p>`;
    if (isValid(currentData.skills)) content += `<h2>Skills</h2><p>${currentData.skills}</p>`;

    [{ label: 'Projects', data: currentData.projects }, { label: 'Experience', data: currentData.experience }, { label: 'Achievements', data: currentData.achievements }].forEach(sec => {
      const lines = getLines(sec.data);
      if (lines.length > 0) {
        content += `<h2>${sec.label}</h2><ul>`;
        lines.forEach(l => content += `<li>${l}</li>`);
        content += `</ul>`;
      }
    });

    if (!isPersonalSectionEmpty(currentData)) {
      content += `<h2>Personal Data</h2>`;
      if (isValid(currentData.gender)) content += `<p>Gender: ${currentData.gender}</p>`;
      if (isValid(currentData.birthDate)) content += `<p>Birth Date: ${currentData.birthDate}</p>`;
      if (isValid(currentData.martialStatus)) content += `<p>Status: ${currentData.martialStatus}</p>`;
    }
    
    const fullHtml = header + content + "</body></html>";
    const blob = new Blob(['\ufeff', fullHtml], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${(currentData.fullName || 'Resume').replace(/\s+/g, '_')}.doc`;
    link.click();
  };

  const inputClasses = "w-full bg-gray-500/5 border border-gray-500/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent transition-all text-main";
  const selectClasses = "w-full bg-gray-500/10 border border-gray-500/20 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent transition-all text-main appearance-none cursor-pointer";

  const renderFields = (data: ResumeData, handler: (e: any) => void) => (
    <div className="space-y-6">
      <h3 className="text-xs font-black theme-accent uppercase tracking-widest">Personal Details</h3>
      <input name="fullName" placeholder="Full Name" value={data.fullName} onChange={handler} className={inputClasses} />
      <div className="grid grid-cols-2 gap-4">
        <input name="mobile" placeholder="Mobile Number" value={data.mobile} onChange={handler} className={inputClasses} />
        <input name="email" placeholder="Email Address" value={data.email} onChange={handler} className={inputClasses} />
      </div>
      <input name="socialLinks" placeholder="Profile Links (LinkedIn, Portfolio, etc.)" value={data.socialLinks} onChange={handler} className={inputClasses} />
      
      <div className="grid grid-cols-2 gap-4">
        <select name="gender" value={data.gender} onChange={handler} className={selectClasses}>
          <option value="" className="bg-gray-800 text-white">Gender</option>
          <option value="Male" className="bg-gray-800 text-white">Male</option>
          <option value="Female" className="bg-gray-800 text-white">Female</option>
        </select>
        <input name="birthDate" placeholder="Birth Date" value={data.birthDate} onChange={handler} className={inputClasses} />
      </div>

      <h3 className="text-xs font-black theme-accent uppercase tracking-widest pt-4">Professional Metadata</h3>
      <textarea name="objective" placeholder="Professional Objective" value={data.objective} onChange={handler} className={`${inputClasses} h-24`} />
      <textarea name="coreCompetence" placeholder="Core Competencies" value={data.coreCompetence} onChange={handler} className={`${inputClasses} h-20`} />
      <textarea name="skills" placeholder="Technical Skills" value={data.skills} onChange={handler} className={`${inputClasses} h-20`} />
      <textarea name="projects" placeholder="Projects (One per line)" value={data.projects} onChange={handler} className={`${inputClasses} h-32`} />
      <textarea name="experience" placeholder="Work Experience (One per line)" value={data.experience} onChange={handler} className={`${inputClasses} h-32`} />
      <textarea name="achievements" placeholder="Achievements & Certs" value={data.achievements} onChange={handler} className={`${inputClasses} h-24`} />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 animate-view">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-outfit font-bold tracking-tight text-main">Resume Studio Pro</h2>
          <p className="text-secondary text-sm">Design high-impact resumes with AI precision.</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="flex gap-2 p-1 glass rounded-xl border border-gray-500/10">
            <button onClick={() => setActiveTab('manual')} className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'manual' ? 'theme-bg text-white' : 'text-secondary hover:text-main'}`}>Manual</button>
            <button onClick={() => setActiveTab('ai')} className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'ai' ? 'theme-bg text-white' : 'text-secondary hover:text-main'}`}>AI Extract</button>
          </div>
          <button onClick={handleAtsScan} disabled={analyzingAts} className="glass border theme-border theme-accent px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all hover:theme-bg hover:text-white">
            {analyzingAts ? 'Scanning...' : '🔍 Scan ATS'}
          </button>
          <button onClick={downloadDocument} className="theme-bg hover:opacity-90 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-xl">📥 Download .doc</button>
        </div>
      </div>

      {atsResult && (
        <div className="glass p-8 rounded-[2rem] border-2 border-accent animate-view space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-main">Compatibility Match: {atsResult.score}%</h3>
            <button onClick={() => setAtsResult(null)} className="text-secondary text-xs font-bold uppercase">Close</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase text-secondary">Improvements Needed</p>
              <div className="flex flex-wrap gap-2">
                {atsResult.missingKeywords.map((k, i) => <span key={i} className="px-3 py-1 bg-rose-500/10 text-rose-500 text-[10px] font-bold rounded-lg">{k}</span>)}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_1fr] gap-8">
        <div className="glass p-8 rounded-[2rem] border border-gray-500/10 space-y-8 overflow-y-auto max-h-[80vh] custom-scroll">
          {activeTab === 'manual' ? renderFields(manualData, handleManualChange) : (
            !isEditingAi ? (
              <div className="space-y-6">
                <div className="text-center space-y-2 mb-6">
                  <p className="text-xs font-black theme-accent uppercase tracking-widest">AI Content Extraction</p>
                  <p className="text-[11px] text-secondary">Provide your old resume text or file to synthesize your profile.</p>
                </div>
                <div onClick={() => fileInputRef.current?.click()} className="p-10 border-2 border-dashed rounded-[2rem] text-center cursor-pointer hover:theme-border-soft bg-gray-500/5 group">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📄</div>
                  <h4 className="font-bold text-main">{uploadedFile ? uploadedFile.name : 'Click to Upload .docx'}</h4>
                  <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".docx" />
                </div>
                <textarea value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} placeholder="Or paste professional details here..." className={`${inputClasses} h-40 pt-4`} />
                <button onClick={handleGenerateAI} disabled={loading} className="w-full theme-bg text-white py-4 rounded-xl font-bold shadow-xl disabled:opacity-40">{loading ? 'Synthesizing Data...' : '✨ Sync with AI'}</button>
                {errorMessage && <p className="text-rose-500 text-[10px] font-bold text-center uppercase tracking-widest">{errorMessage}</p>}
              </div>
            ) : renderFields(aiData, handleAiEditChange)
          )}
        </div>

        {/* Live Preview */}
        <div className="bg-white p-12 rounded-[3rem] shadow-2xl min-h-[900px] text-slate-800 font-serif border border-gray-200 overflow-y-auto custom-scroll">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black uppercase text-slate-900 mb-2">{currentData.fullName || 'YOUR NAME'}</h1>
            <div className="text-[11px] text-slate-600 font-sans font-medium flex flex-wrap justify-center gap-4">
              {isValid(currentData.email) && <span>{currentData.email}</span>}
              {isValid(currentData.mobile) && <span>{currentData.mobile}</span>}
              {isValid(currentData.socialLinks) && <span>{currentData.socialLinks}</span>}
            </div>
          </div>

          <div className="space-y-6">
            {isValid(currentData.objective) && <section><h2 className="text-xs font-black pb-1 mb-2 uppercase border-b-2 border-slate-900">Professional Objective</h2><p className="text-[11px] leading-relaxed text-justify">{currentData.objective}</p></section>}
            {isValid(currentData.coreCompetence) && <section><h2 className="text-xs font-black pb-1 mb-2 uppercase border-b-2 border-slate-900">Core Competencies</h2><p className="text-[11px] leading-relaxed">{currentData.coreCompetence}</p></section>}
            {isValid(currentData.skills) && <section><h2 className="text-xs font-black pb-1 mb-2 uppercase border-b-2 border-slate-900">Technical Skills</h2><p className="text-[11px] leading-relaxed">{currentData.skills}</p></section>}
            
            {['Projects', 'Experience', 'Achievements'].map(sec => {
              const d = currentData[sec.toLowerCase() as keyof ResumeData] as string;
              const lines = getLines(d);
              return lines.length > 0 ? (
                <section key={sec}>
                  <h2 className="text-xs font-black pb-1 mb-2 uppercase border-b-2 border-slate-900">{sec}</h2>
                  <ul className="list-disc pl-5 text-[11px] space-y-1">
                    {lines.map((l, idx) => <li key={idx} className="leading-relaxed text-justify">{l}</li>)}
                  </ul>
                </section>
              ) : null;
            })}

            {!isPersonalSectionEmpty(currentData) && (
              <section className="pt-4 mt-8 border-t border-slate-100">
                <h2 className="text-xs font-black pb-1 mb-2 uppercase border-b-2 border-slate-900">Personal Details</h2>
                <div className="grid grid-cols-2 gap-y-1 text-[10px] font-sans">
                  {isValid(currentData.gender) && <div><b>Gender:</b> {currentData.gender}</div>}
                  {isValid(currentData.birthDate) && <div><b>Date of Birth:</b> {currentData.birthDate}</div>}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
