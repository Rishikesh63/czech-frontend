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

  // -----------------------------
  // Website Ingestion
  // -----------------------------
  const handleIngest = async () => {
    if (!url.trim()) return;

    setIngesting(true);
    setIngestResult(null);

    try {
      const res = await fetch(`${API_BASE}/ingest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (!res.ok) {
        setIngestResult({ error: data.error || "Chyba při načítání dat." });
      } else {
        setIngestResult(data);
      }
    } catch (err) {
      setIngestResult({ error: "Nelze se připojit k backendu." });
    } finally {
      setIngesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-8 px-4 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* -----------------------------
            LEFT SIDEBAR (Ingestion)
        ----------------------------- */}
        <aside className="lg:col-span-3 space-y-4">
          <div className="p-4">
            <h1 className="text-2xl font-black text-gray-800">
              Asistent komunikace obce
            </h1>
            <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">
              AI s lidským schválením
            </p>
          </div>

          <IngestSection
            url={url}
            setUrl={setUrl}
            ingest={handleIngest}
            ingesting={ingesting}
            ingestResult={ingestResult}
          />
        </aside>

        {/* -----------------------------
            MAIN WORKFLOW PANEL
        ----------------------------- */}
        <main className="lg:col-span-9">
          <QuestionSection
            question={question}
            setQuestion={setQuestion}
          />
        </main>
      </div>
    </div>
  );
}
