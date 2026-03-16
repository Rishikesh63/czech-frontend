"use client";

import { useState } from "react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3000";

interface IngestSectionProps {
  url: string;
  setUrl: (val: string) => void;
  municipalityId: string;
  setMunicipalityId: (val: string) => void;
  ingest: () => void;
  ingesting: boolean;
  ingestResult: {
    error?: string;
    url?: string;
    chunks_extracted?: number;
    chunks_indexed?: number;
  } | null;
}

export default function IngestSection({
  url,
  setUrl,
  municipalityId,
  setMunicipalityId,
  ingest,
  ingesting,
  ingestResult,
}: IngestSectionProps) {
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [pdfResult, setPdfResult] = useState<{
    error?: string;
    filename?: string;
    chunks_indexed?: number;
  } | null>(null);

  const handlePdfUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];

    setUploadingPdf(true);
    setPdfResult(null);

    const formData = new FormData();
    formData.append("file", file);
    if (municipalityId.trim()) {
      formData.append("municipality_id", municipalityId.trim());
    }

    try {
      const res = await fetch(`${API_BASE}/upload-pdf`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setPdfResult({ error: data.error || "Chyba při nahrávání PDF." });
      } else {
        setPdfResult(data);
      }
    } catch {
      setPdfResult({ error: "Nelze se připojit k backendu." });
    } finally {
      setUploadingPdf(false);
    }
  };

  return (
    <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-fit">
      
      {/* -------------------------------
          WEBSITE INGESTION
      -------------------------------- */}
      <h2 className="text-xl text-black font-bold mb-4 flex items-center gap-2">
        🔗 Vložit URL webu obce
      </h2>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="ID obce (volitelné), např. prague-01"
          value={municipalityId}
          onChange={(e) => setMunicipalityId(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black"
        />

        <input
          type="text"
          placeholder="https://www.obec.cz"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black"
        />

        <button
          onClick={ingest}
          disabled={ingesting || !url}
          className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors ${
            ingesting
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {ingesting ? "Zpracovávám..." : "Načíst data"}
        </button>

        {ingestResult && (
          <div
            className={`mt-2 p-3 rounded-lg text-sm ${
              ingestResult.error
                ? "bg-red-50 text-red-700"
                : "bg-green-50 text-green-700"
            }`}
          >
            {ingestResult.error
              ? ingestResult.error
              : "✓ Webová data byla úspěšně přidána do systému."}
          </div>
        )}
      </div>

      {/* -------------------------------
          PDF UPLOAD SECTION
      -------------------------------- */}
      <div className="mt-8 border-t pt-6">
        <h2 className="text-xl text-black font-bold mb-4 flex items-center gap-2">
          📄 Nahrát PDF dokument
        </h2>

        <input
          type="file"
          accept="application/pdf"
          onChange={handlePdfUpload}
          className="w-full text-sm"
        />

        {uploadingPdf && (
          <p className="mt-2 text-sm text-gray-500">
            Zpracovávám PDF dokument...
          </p>
        )}

        {pdfResult && (
          <div
            className={`mt-2 p-3 rounded-lg text-sm ${
              pdfResult.error
                ? "bg-red-50 text-red-700"
                : "bg-green-50 text-green-700"
            }`}
          >
            {pdfResult.error
              ? pdfResult.error
              : `✓ PDF "${pdfResult.filename}" bylo úspěšně přidáno (${pdfResult.chunks_indexed} částí).`}
          </div>
        )}
      </div>
    </section>
  );
}
