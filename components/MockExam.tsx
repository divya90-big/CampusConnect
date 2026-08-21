
import React, { useState, useEffect } from 'react';
import { generateMockExam } from '../services/gemini';
import { QuizQuestion } from '../types';

// Fully expanded bank of 30 unique questions for offline reliability
const fallbackQuestions: QuizQuestion[] = [
  { question: "A train 150m long is running at 54 km/hr. How much time will it take to pass a platform 120m long?", options: ["12 seconds", "15 seconds", "18 seconds", "20 seconds"], correctAnswer: 2, explanation: "Total distance = 150 + 120 = 270m. Speed = 54 * (5/18) = 15 m/s. Time = 270 / 15 = 18s." },
  { question: "The ratio of ages of A and B is 3:4. After 5 years, the ratio becomes 4:5. What is A's present age?", options: ["10 years", "12 years", "15 years", "20 years"], correctAnswer: 2, explanation: "Let ages be 3x and 4x. (3x+5)/(4x+5) = 4/5 => 15x+25 = 16x+20 => x=5. A = 3*5 = 15." },
  { question: "If 5 machines can make 5 widgets in 5 minutes, how long does it take 100 machines to make 100 widgets?", options: ["1 minute", "5 minutes", "20 minutes", "100 minutes"], correctAnswer: 1, explanation: "Each machine takes 5 mins/widget. 100 machines working simultaneously take the same 5 mins." },
  { question: "A sum of money at simple interest amounts to Rs. 815 in 3 years and to Rs. 854 in 4 years. The sum is:", options: ["Rs. 650", "Rs. 690", "Rs. 698", "Rs. 700"], correctAnswer: 2, explanation: "S.I. for 1 year = 854 - 815 = 39. S.I. for 3 years = 39 * 3 = 117. Principal = 815 - 117 = 698." },
  { question: "Find the odd one out: 3, 5, 11, 14, 17, 21", options: ["21", "17", "14", "3"], correctAnswer: 2, explanation: "All are odd except 14." },
  { question: "Which of the following is a prime number?", options: ["33", "81", "93", "97"], correctAnswer: 3, explanation: "97 is not divisible by any number other than 1 and itself." },
  { question: "The average of first five multiples of 3 is:", options: ["3", "9", "12", "15"], correctAnswer: 1, explanation: "Multiples are 3, 6, 9, 12, 15. Average = (3+6+9+12+15)/5 = 9." },
  { question: "If 0.75 : x :: 5 : 8, then x is equal to:", options: ["1.12", "1.2", "1.25", "1.3"], correctAnswer: 1, explanation: "x * 5 = 0.75 * 8 => 5x = 6 => x = 1.2." },
  { question: "The value of (256)^0.16 * (256)^0.09 is:", options: ["4", "16", "64", "256.25"], correctAnswer: 0, explanation: "256^(0.16+0.09) = 256^0.25 = 256^(1/4) = 4." },
  { question: "The H.C.F. of two numbers is 11 and their L.C.M. is 7700. If one of the numbers is 275, then the other is:", options: ["279", "283", "308", "318"], correctAnswer: 2, explanation: "Other number = (11 * 7700) / 275 = 308." },
  { question: "A fruit seller had some apples. He sells 40% apples and still has 420 apples. Originally, he had:", options: ["588 apples", "600 apples", "672 apples", "700 apples"], correctAnswer: 3, explanation: "60% = 420. Total = (420/60) * 100 = 700." },
  { question: "If 'LIGHT' is coded as 'MJHIU', how is 'FLAME' coded?", options: ["GMBNF", "GMBNF", "GNCNE", "HMBMF"], correctAnswer: 0, explanation: "Each letter is shifted by +1." },
  { question: "Pointing to a photograph, a man said, 'I have no brother or sister but that man's father is my father's son.' Whose photograph was it?", options: ["His own", "His son's", "His father's", "His nephew's"], correctAnswer: 1, explanation: "'Father's son' = the man himself. 'That man's father is me' => That man is his son." },
  { question: "Which number replaces the question mark? 2, 6, 12, 20, 30, ?", options: ["38", "40", "42", "44"], correctAnswer: 2, explanation: "Differences: +4, +6, +8, +10. Next is +12. 30+12 = 42." },
  { question: "A clock strikes 12. How many seconds does it take to strike 12 if it takes 6 seconds to strike 4?", options: ["18", "20", "22", "24"], correctAnswer: 2, explanation: "4 strikes have 3 intervals. 1 interval = 2s. 12 strikes have 11 intervals. 11 * 2 = 22s." },
  { question: "In a row of 40 students, R is 11th from the right. What is his rank from the left?", options: ["29th", "30th", "31st", "32nd"], correctAnswer: 1, explanation: "Left rank = (Total - Right rank) + 1 = (40 - 11) + 1 = 30." },
  { question: "A man walks 5km south and then turns right. After walking 3km he turns left and walks 5km. What direction is he from the start?", options: ["South-West", "South-East", "North-West", "North-East"], correctAnswer: 0, explanation: "Initial South, then West, then South again = South-West." },
  { question: "Find the missing number in the series: 1, 4, 9, 16, 25, ?", options: ["30", "35", "36", "49"], correctAnswer: 2, explanation: "Squares of natural numbers: 1^2, 2^2, 3^2, 4^2, 5^2, 6^2 = 36." },
  { question: "Choose the correct antonym for 'Profound':", options: ["Deep", "Superficial", "Intense", "Sincere"], correctAnswer: 1, explanation: "Profound means deep; superficial means shallow or on the surface." },
  { question: "Complete the analogy: Book : Author :: Statue : ?", options: ["Mason", "Sculptor", "Painter", "Poet"], correctAnswer: 1, explanation: "An author creates a book; a sculptor creates a statue." },
  { question: "Look at this series: 7, 10, 8, 11, 9, 12, ... What number should come next?", options: ["7", "10", "12", "13"], correctAnswer: 1, explanation: "Pattern: +3, -2, +3, -2. 12 - 2 = 10." },
  { question: "If South-East becomes North, North-East becomes West and so on. What will West become?", options: ["South-East", "South-West", "North-West", "North-East"], correctAnswer: 0, explanation: "Rotation of directions by 135 degrees anti-clockwise." },
  { question: "A, B, C and D are playing cards. A and B are partners. D faces North. If A faces West, then who faces South?", options: ["B", "C", "D", "None"], correctAnswer: 1, explanation: "A (West), B (East). D (North), so partner C faces South." },
  { question: "Find the odd one out: Copper, Zinc, Brass, Iron, Aluminum", options: ["Copper", "Iron", "Aluminum", "Brass"], correctAnswer: 3, explanation: "Brass is an alloy; the rest are pure metals." },
  { question: "What is the probability of getting an even number when a fair die is rolled?", options: ["1/2", "1/3", "1/4", "1/6"], correctAnswer: 0, explanation: "Even numbers are 2, 4, 6. 3/6 = 1/2." },
  { question: "If 1st Jan 2007 was a Monday, what day was 1st Jan 2008?", options: ["Monday", "Tuesday", "Wednesday", "Sunday"], correctAnswer: 1, explanation: "Non-leap year has 1 odd day. Monday + 1 = Tuesday." },
  { question: "A mother is twice as old as her son. 20 years ago, she was 10 times as old as her son. Current age of mother?", options: ["40", "44", "45", "50"], correctAnswer: 2, explanation: "2x-20 = 10(x-20) => 2x-20 = 10x-200 => 8x = 180 (Approx Logic: 45/22.5 is actual)." },
  { question: "Find the value of x: 40% of 250 + x% of 600 = 400", options: ["40", "50", "60", "70"], correctAnswer: 1, explanation: "100 + 6x = 400 => 6x = 300 => x = 50." },
  { question: "The word 'Venerate' most nearly means:", options: ["Ignore", "Accuse", "Revere", "Defy"], correctAnswer: 2, explanation: "Venerate means to regard with great respect (Revere)." },
  { question: "Select the odd pair of words:", options: ["Horse : Neigh", "Cat : Mew", "Dog : Bark", "Bird : Fly"], correctAnswer: 3, explanation: "Others are animal sound pairs; 'Fly' is an action." }
];

const SectionContainer: React.FC<React.PropsWithChildren<{}>> = ({ children }) => (
  <div className="relative glass rounded-[3rem] p-6 md:p-12 mb-20 border border-gray-500/10 overflow-hidden">
    <div className="absolute inset-0 z-0 theme-bg-soft opacity-10 pointer-events-none" />
    <div className="relative z-10">{children}</div>
  </div>
);

interface MockExamProps {
  prefetchedAptitude: QuizQuestion[];
  onFetchNext: () => void;
}

const MockExam: React.FC<MockExamProps> = ({ prefetchedAptitude, onFetchNext }) => {
  const [mode, setMode] = useState<'selection' | 'aptitude' | 'tech_lab'>('selection');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [questionOrder, setQuestionOrder] = useState<number[]>([]);
  const [currentOrderIdx, setCurrentOrderIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [mode, finished]);

  const initTest = (data: QuizQuestion[]) => {
    const pool = data.length >= 30 ? data.slice(0, 30) : fallbackQuestions;
    setQuestions(pool);
    setQuestionOrder(Array.from({ length: pool.length }, (_, i) => i));
    setAnswers({});
    setCurrentOrderIdx(0);
    setFinished(false);
    setMode('aptitude');
  };

  const startAptitude = async () => {
    if (prefetchedAptitude.length >= 30) {
      initTest(prefetchedAptitude);
      onFetchNext();
    } else {
      setLoading(true);
      try {
        const data = await generateMockExam('aptitude');
        initTest(data);
      } catch (e) {
        initTest(fallbackQuestions);
      }
      setLoading(false);
    }
  };

  const handleNext = () => {
    const realIdx = questionOrder[currentOrderIdx];
    if (answers[realIdx] === undefined) {
      const newOrder = [...questionOrder];
      const [skipped] = newOrder.splice(currentOrderIdx, 1);
      newOrder.push(skipped);
      setQuestionOrder(newOrder);
    } else {
      if (currentOrderIdx < questionOrder.length - 1) {
        setCurrentOrderIdx(prev => prev + 1);
      }
    }
  };

  const handlePrevious = () => { if (currentOrderIdx > 0) setCurrentOrderIdx(prev => prev - 1); };

  const isAtEnd = currentOrderIdx >= questionOrder.length - 1;
  const isAllAnswered = Object.keys(answers).length === questions.length && questions.length > 0;

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      <p className="text-[10px] font-black uppercase text-secondary tracking-widest text-center">Syncing Assessment Engine...</p>
    </div>
  );

  if (mode === 'selection') return (
    <div className="max-w-4xl mx-auto space-y-12 py-10">
      <div className="text-center space-y-4">
        <h2 className="text-5xl font-outfit font-black italic tracking-tighter uppercase text-main">Assessments</h2>
        <p className="text-secondary text-sm font-medium tracking-widest uppercase opacity-70">30 Questions • Adaptive Testing</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <button onClick={startAptitude} className="glass p-12 rounded-[3rem] border border-gray-500/10 group hover:theme-border transition-all text-center active:scale-95">
          <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">📊</div>
          <h4 className="text-2xl font-black mb-1 italic text-main">Aptitude Test</h4>
          <p className="text-[9px] text-secondary font-bold uppercase tracking-widest opacity-60">Quant, Logic & Verbal (30 Qs)</p>
        </button>
        <button onClick={() => setMode('tech_lab')} className="glass p-12 rounded-[3rem] border border-gray-500/10 group hover:theme-border transition-all text-center active:scale-95">
          <div className="text-6xl mb-6 group-hover:rotate-12 transition-transform">💻</div>
          <h4 className="text-2xl font-black mb-1 italic text-main">Technical Lab</h4>
          <p className="text-[9px] text-secondary font-bold uppercase tracking-widest opacity-60">Dsa Resources & Practice Sheets</p>
        </button>
      </div>
    </div>
  );

  if (mode === 'tech_lab') return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20 animate-view">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <h2 className="text-3xl font-outfit font-bold tracking-tight text-main">Technical Lab</h2>
          <p className="text-secondary text-sm">Portals for hands-on coding and SDE placement.</p>
        </div>
        <button onClick={() => setMode('selection')} className="text-xs font-black theme-accent uppercase tracking-widest px-4 py-2 glass rounded-xl border border-gray-500/10 hover:theme-border-soft transition-all">← Back</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { name: "Take U Forward (TUF)", url: "https://takeuforward.org/", icon: "🚀", desc: "Expert DSA sheets and interview resources." },
          { name: "LeetCode", url: "https://leetcode.com/problemset/all/", icon: "🧠", desc: "Gold standard for algorithmic practice." },
          { name: "NeetCode", url: "https://neetcode.io/practice", icon: "✨", desc: "Curated problem lists with high-quality solutions." }
        ].map((res, i) => (
          <a key={i} href={res.url} target="_blank" rel="noopener noreferrer" className="glass p-8 rounded-[2rem] border border-gray-500/10 hover:theme-border-soft transition-all flex flex-col gap-4 group">
            <div className="text-3xl group-hover:scale-110 transition-transform">{res.icon}</div>
            <h4 className="text-lg font-bold text-main">{res.name}</h4>
            <p className="text-xs text-secondary leading-relaxed">{res.desc}</p>
          </a>
        ))}
      </div>
    </div>
  );

  if (mode === 'aptitude' && questions.length > 0) {
    if (finished) {
      const score = questions.filter((q, i) => answers[i] === q.correctAnswer).length;
      return (
        <SectionContainer>
          <div className="text-center space-y-8 py-10">
            <div className="inline-block p-10 glass rounded-full border border-gray-500/10">
              <span className="text-6xl font-black text-main">{score}/{questions.length}</span>
            </div>
            <h3 className="text-2xl font-bold text-main">Score Summary</h3>
            <button onClick={() => setMode('selection')} className="theme-bg text-white px-10 py-4 rounded-2xl font-bold uppercase text-xs">Return to Dashboard</button>
            <div className="space-y-4 text-left max-w-2xl mx-auto pt-10 border-t border-gray-500/10">
              {questions.map((q, i) => (
                <div key={i} className={`p-5 rounded-2xl border ${answers[i] === q.correctAnswer ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-rose-500/5 border-rose-500/20'}`}>
                  <p className="text-xs font-bold mb-2 text-main">Q: {q.question}</p>
                  <p className="text-[10px] text-secondary italic">Solution: {q.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        </SectionContainer>
      );
    }

    const currentRealIdx = questionOrder[currentOrderIdx];
    const q = questions[currentRealIdx];

    return (
      <SectionContainer>
        <div className="space-y-8 py-4">
          <div className="flex justify-between items-center text-[10px] font-black text-secondary uppercase tracking-widest">
            <span className="theme-accent">Examination in Progress</span>
            <span>Question {currentOrderIdx + 1} of {questions.length}</span>
          </div>
          <div className="space-y-8 min-h-[400px]">
            <h3 className="text-2xl font-bold text-main leading-snug">{q?.question}</h3>
            <div className="grid grid-cols-1 gap-4">
              {q?.options.map((opt, i) => (
                <div key={i} className="flex items-center gap-6 group">
                  <div className={`w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center font-black transition-all border-2 ${answers[currentRealIdx] === i ? 'theme-bg border-accent text-white shadow-lg' : 'bg-gray-500/10 border-gray-500/5 text-secondary'}`}>
                    {String.fromCharCode(65 + i)}
                  </div>
                  <button 
                    onClick={() => setAnswers({...answers, [currentRealIdx]: i})} 
                    className={`flex-1 p-6 rounded-2xl border text-sm font-semibold transition-all text-left ${answers[currentRealIdx] === i ? 'theme-border-soft theme-bg-soft theme-accent shadow-inner' : 'bg-gray-500/5 border-transparent text-secondary hover:bg-gray-500/10'}`}
                  >
                    {opt}
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-4 pt-10 border-t border-gray-500/10">
            <button disabled={currentOrderIdx === 0} onClick={handlePrevious} className="flex-1 py-4 glass border border-gray-500/10 text-secondary rounded-2xl font-black text-[10px] uppercase">Previous</button>
            <button onClick={handleNext} className="flex-1 py-4 glass border border-gray-500/10 text-secondary rounded-2xl font-black text-[10px] uppercase">
              {answers[currentRealIdx] === undefined ? 'Skip (Rotates to End)' : (isAtEnd ? 'End Review' : 'Next Question')}
            </button>
            <button onClick={() => setFinished(true)} disabled={!isAllAnswered} className={`flex-[2] py-4 rounded-2xl font-black text-[10px] uppercase shadow-xl transition-all ${isAllAnswered ? 'theme-bg text-white' : 'bg-gray-500/20 text-gray-500 cursor-not-allowed opacity-50'}`}>Submit Test</button>
          </div>
        </div>
      </SectionContainer>
    );
  }
  return null;
};

export default MockExam;
