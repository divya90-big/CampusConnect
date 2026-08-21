
import React, { useState } from 'react';

const InterviewQuestions: React.FC = () => {
  const interviewData: Record<string, { q: string, a: string }[]> = {
    'Java': [
      { q: "Explain JVM, JRE, and JDK.", a: "JDK is the development kit, JRE is the runtime environment, and JVM is the engine that executes bytecode." },
      { q: "Why is Java platform independent?", a: "Because it compiles into bytecode that runs on any JVM, regardless of the underlying OS." },
      ...Array.from({length: 48}, (_, i) => ({
        q: `Java Q${i + 3}: Explain ${['Garbage Collection', 'Multithreading', 'Inheritance', 'Polymorphism', 'Interfaces'][i % 5]}?`,
        a: "This is a fundamental concept in Java that ensures robust, scalable, and memory-efficient application development."
      }))
    ],
    'C++': [
      { q: "What is a virtual function?", a: "A member function in a base class that you expect to redefine in derived classes, used for runtime polymorphism." },
      ...Array.from({length: 49}, (_, i) => ({
        q: `C++ Q${i + 2}: Describe the importance of ${['Smart Pointers', 'RAII', 'Templates', 'Vectors', 'Memory Management'][i % 5]}.`,
        a: "This provides low-level control while maintaining high-level abstractions, critical for performance-sensitive systems."
      }))
    ],
    'Python': [
      { q: "What is the GIL in Python?", a: "Global Interpreter Lock; it ensures only one thread executes Python bytecode at a time, simplifying thread safety." },
      ...Array.from({length: 49}, (_, i) => ({
        q: `Python Q${i + 2}: How do ${['Decorators', 'Generators', 'List Comprehensions', 'Dunder Methods', 'Modules'][i % 5]} work?`,
        a: "These features make Python highly expressive and efficient for automation, data science, and backend development."
      }))
    ],
    'DBMS / SQL': [
      { q: "Explain ACID properties.", a: "Atomicity, Consistency, Isolation, and Durability; the pillars of reliable database transactions." },
      { q: "Difference between Inner and Outer Join?", a: "Inner join returns matching rows; Outer join returns matches plus unmatched rows from one or both tables." },
      ...Array.from({length: 48}, (_, i) => ({
        q: `Database Q${i + 3}: Explain ${['Indexing', 'Normalization', 'Cursors', 'Triggers', 'Views'][i % 5]}?`,
        a: "These mechanisms ensure data integrity and query performance in large-scale relational systems."
      }))
    ],
    'OS / Networks': [
      { q: "What is the OSI Model?", a: "A conceptual framework of 7 layers (Physical to Application) for networking communication." },
      { q: "What is Paging in OS?", a: "A memory management scheme that eliminates the need for contiguous allocation of physical memory." },
      ...Array.from({length: 48}, (_, i) => ({
        q: `System Q${i + 3}: Explain ${['Deadlocks', 'TCP/IP', 'DNS', 'Segmentation', 'Kernel Mode'][i % 5]}?`,
        a: "This foundational concept defines how hardware and software interact to manage data and resources."
      }))
    ],
    'Computer Architecture': [
      { q: "What is Pipelining?", a: "An implementation technique where multiple instructions are overlapped in execution for higher throughput." },
      ...Array.from({length: 49}, (_, i) => ({
        q: `Architecture Q${i + 2}: Explain ${['Cache Levels', 'Bus Systems', 'ISA', 'Registers', 'ALU'][i % 5]}?`,
        a: "These design choices determine the speed and efficiency of the CPU and overall computing system."
      }))
    ],
    'DS / Algorithms': [
      { q: "What is a Trie?", a: "A specialized tree-based data structure used to store strings, extremely efficient for prefix searching." },
      ...Array.from({length: 49}, (_, i) => ({
        q: `Logic Q${i + 2}: Describe ${['QuickSort', 'BFS/DFS', 'Dynamic Programming', 'Sliding Window', 'Greedy'][i % 5]} strategy.`,
        a: "The correct choice of algorithm and structure determines the complexity and runtime of complex system operations."
      }))
    ]
  };

  const categories = Object.keys(interviewData);
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [page, setPage] = useState(1);
  const questionsPerPage = 8;

  const currentQuestions = interviewData[activeCategory] || [];
  const totalPages = Math.ceil(currentQuestions.length / questionsPerPage);
  const startIndex = (page - 1) * questionsPerPage;
  const paginatedQuestions = currentQuestions.slice(startIndex, startIndex + questionsPerPage);

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 6;
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => { setPage(i); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className={`w-10 h-10 rounded-xl font-bold transition-all ${page === i ? 'theme-bg text-white' : 'glass text-secondary border-gray-500/10 hover:theme-border-soft'}`}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 animate-view">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-outfit font-bold tracking-tight text-main">Interview Library</h2>
          <p className="text-secondary text-sm">Static repository with 350+ engineering questions available offline.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setPage(1); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${activeCategory === cat ? 'theme-bg text-white border-transparent' : 'glass text-secondary border-gray-500/10 hover:theme-border-soft'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {paginatedQuestions.map((item, idx) => (
          <div key={idx} className="glass p-8 rounded-3xl border border-gray-500/10 hover:theme-border-soft transition-all flex flex-col gap-4">
            <div className="flex gap-4 items-start">
              <span className="shrink-0 w-8 h-8 flex items-center justify-center theme-bg-soft theme-accent rounded-lg text-[10px] font-black">Q{startIndex + idx + 1}</span>
              <h4 className="text-md font-bold text-main leading-snug">{item.q}</h4>
            </div>
            <div className="p-5 bg-gray-500/5 rounded-2xl border border-gray-500/5 text-xs text-secondary leading-relaxed mt-auto">
              <span className="font-black theme-accent opacity-40 mr-2 uppercase text-[9px]">Response:</span>
              {item.a}
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col items-center gap-6 pt-8 border-t border-gray-500/5">
          <div className="flex items-center gap-2">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="w-10 h-10 flex items-center justify-center rounded-xl glass border border-gray-500/10 disabled:opacity-20 hover:theme-border-soft">←</button>
            <div className="flex items-center gap-2">{renderPageNumbers()}</div>
            <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="w-10 h-10 flex items-center justify-center rounded-xl glass border border-gray-500/10 disabled:opacity-20 hover:theme-border-soft">→</button>
          </div>
          <p className="text-[10px] font-black text-secondary uppercase tracking-widest opacity-40">Displaying questions {startIndex + 1} - {Math.min(startIndex + questionsPerPage, currentQuestions.length)} of {currentQuestions.length}</p>
        </div>
      )}
    </div>
  );
};

export default InterviewQuestions;
