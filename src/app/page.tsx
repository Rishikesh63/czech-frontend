"use client";

import { useState } from "react";
import IngestSection from "@/components/IngestSection";
import QuestionSection from "@/components/QuestionSection";
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3000";

export default function Home() {
  const [url, setUrl] = useState("");
  const [ingestResult, setIngestResult] = useState<any>(null);
  const [ingesting, setIngesting] = useState(false);

  const [question, setQuestion] = useState("");
  const [asking, setAsking] = useState(false);
  // NEW: Store history of messages
  const [chatHistory, setChatHistory] = useState<any[]>([]);

  const handleIngest = async () => {
    setIngesting(true);
    setIngestResult(null);
    try {
      const res = await fetch(`${API_BASE}/ingest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      setIngestResult(res.ok ? data : { error: data.error || "Ingest failed" });
    } catch (err) {
      setIngestResult({ error: "Failed to connect to backend" });
    } finally {
      setIngesting(false);
    }
  };

  const handleAsk = async () => {
    if (!question.trim()) return;

    const userMsg = { role: "user", content: question };
    setChatHistory((prev) => [...prev, userMsg]);
    setAsking(true);
    setQuestion(""); // Clear input immediately

    try {
      const res = await fetch(`${API_BASE}/rag`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userMsg.content }),
      });
      const data = await res.json();
      
      const assistantMsg = { 
        role: "assistant", 
        content: res.ok ? data.answer : (data.error || "Chyba při generování."),
        sources: data.sources || [] 
      };

      setChatHistory((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setChatHistory((prev) => [...prev, { role: "assistant", content: "Chyba připojení k serveru." }]);
    } finally {
      setAsking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-8 px-4 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Sidebar: Settings/Ingest */}
        <aside className="lg:col-span-3 space-y-4">
          <div className="p-4">
             <h1 className="text-2xl font-black text-gray-800">Czech RAG</h1>
             <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">v1.0 Knowledge Base</p>
          </div>
          <IngestSection 
            url={url} 
            setUrl={setUrl} 
            ingest={handleIngest} 
            ingesting={ingesting} 
            ingestResult={ingestResult} 
          />
        </aside>

        {/* Main: Chat Interface */}
        <main className="lg:col-span-9">
          <QuestionSection 
            question={question}
            setQuestion={setQuestion}
            ask={handleAsk}
            asking={asking}
            chatHistory={chatHistory}
          />
        </main>
      </div>
    </div>
  );
}