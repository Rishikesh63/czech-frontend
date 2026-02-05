"use client";

import { useState } from "react";

const API_BASE = "http://localhost:3000";

export default function Home() {
  // ---- INGEST ----
  const [url, setUrl] = useState("");
  const [ingestResult, setIngestResult] = useState<any>(null);
  const [ingesting, setIngesting] = useState(false);

  // ---- RAG ----
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState<any[]>([]);
  const [asking, setAsking] = useState(false);

  const ingest = async () => {
    setIngesting(true);
    setIngestResult(null);

    try {
      const res = await fetch(`${API_BASE}/ingest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setIngestResult({
          error: data.error || "Ingest failed",
        });
        return;
      }

      setIngestResult(data);
    } catch (err) {
      setIngestResult({ error: "Failed to connect to backend" });
    } finally {
      setIngesting(false);
    }
  };

  const ask = async () => {
    setAsking(true);
    setAnswer("");
    setSources([]);

    try {
      const res = await fetch(`${API_BASE}/rag`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();

      // 🔴 THIS IS THE IMPORTANT FIX
      if (!res.ok || data.error) {
        setAnswer(data.error || "Failed to generate answer");
        return;
      }

      setAnswer(data.answer);
      setSources(data.sources || []);
    } catch (err) {
      setAnswer("Failed to connect to backend");
    } finally {
      setAsking(false);
    }
  };

  return (
    <main style={{ maxWidth: 800, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>📚 Czech RAG System</h1>

      {/* INGEST */}
      <section style={{ marginTop: 40 }}>
        <h2>🔗 Ingest Website</h2>

        <input
          type="text"
          placeholder="https://example.com/page"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{ width: "100%", padding: 8 }}
        />

        <button onClick={ingest} disabled={ingesting} style={{ marginTop: 10 }}>
          {ingesting ? "Ingesting..." : "Ingest"}
        </button>

        {ingestResult && (
          <pre
            style={{
              marginTop: 10,
              background: "#f5f5f5",
              padding: 10,
              whiteSpace: "pre-wrap",
            }}
          >
            {JSON.stringify(ingestResult, null, 2)}
          </pre>
        )}
      </section>

      {/* RAG */}
      <section style={{ marginTop: 60 }}>
        <h2>❓ Ask Question</h2>

        <textarea
          rows={3}
          placeholder="Jaká je historie obce Branná?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          style={{ width: "100%", padding: 8 }}
        />

        <button onClick={ask} disabled={asking} style={{ marginTop: 10 }}>
          {asking ? "Thinking..." : "Ask"}
        </button>

        {answer && (
          <div style={{ marginTop: 20 }}>
            <h3>🧠 Answer</h3>
            <p>{answer}</p>
          </div>
        )}

        {sources.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <h3>📌 Sources</h3>
            <ul>
              {sources.map((s, i) => (
                <li key={i}>
                  <a href={s.url} target="_blank" rel="noreferrer">
                    {s.url}
                  </a>{" "}
                  (score: {Number(s.score).toFixed(3)})
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </main>
  );
}
