"use client";

import { useEffect, useRef } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
  sources?: any[];
}

interface QuestionSectionProps {
  question: string;
  setQuestion: (val: string) => void;
  ask: () => void;
  asking: boolean;
  chatHistory: Message[];
}

export default function QuestionSection({
  question,
  setQuestion,
  ask,
  asking,
  chatHistory,
}: QuestionSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, asking]);

  return (
    <div className="flex flex-col h-[80vh] bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {chatHistory.length === 0 && !asking && (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <span className="text-4xl mb-2">💬</span>
            <p>Ptejte se na cokoli ohledně nahraných dat...</p>
          </div>
        )}

        {chatHistory.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                msg.role === "user"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-gray-100 text-gray-800 rounded-bl-none shadow-sm"
              }`}
            >
              <p className="leading-relaxed">{msg.content}</p>
              
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-3 pt-2 border-t border-gray-200 text-xs">
                  <p className="font-bold text-gray-500 mb-1">ZDROJE:</p>
                  <div className="flex flex-wrap gap-2">
                    {msg.sources.map((s, i) => (
                      <a 
                        key={i} 
                        href={s.url} 
                        target="_blank" 
                        className="bg-white/50 px-2 py-1 rounded border border-gray-200 hover:bg-white truncate max-w-[150px]"
                      >
                        {s.url.split('/').pop() || 'Odkaz'}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {asking && (
          <div className="flex justify-start">
            <div className="bg-gray-100 animate-pulse rounded-2xl rounded-bl-none px-6 py-4 text-gray-400">
              Crying... 
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Persistent Input Bar (ChatGPT style) */}
      <div className="p-4 border-t bg-gray-50">
        <div className="max-w-3xl mx-auto relative flex items-center">
          <textarea
            rows={1}
            placeholder="Zeptejte se..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                ask();
              }
            }}
            className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none text-black shadow-inner"
          />
          <button
            onClick={ask}
            disabled={asking || !question}
            className="absolute right-2 p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
            </svg>
          </button>
        </div>
        <p className="text-[10px] text-center mt-2 text-gray-400">
          Czech RAG System může generovat nepřesné informace.
        </p>
      </div>
    </div>
  );
}