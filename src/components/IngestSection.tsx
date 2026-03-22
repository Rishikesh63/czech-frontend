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
  const [selectedPdfName, setSelectedPdfName] = useState<string | null>(null);
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
    setSelectedPdfName(file.name);

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
      <div className="mt-8 rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-5 shadow-sm">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl text-black font-bold flex items-center gap-2">
              📄 Nahrát PDF dokument
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Nahrajte vyhlášky, formuláře nebo interní dokumenty přímo do znalostní báze.
            </p>
          </div>
          <span className="rounded-full bg-blue-600 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-white">
            PDF Upload
          </span>
        </div>

        <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-blue-300 bg-white px-4 py-6 text-center transition hover:border-blue-500 hover:bg-blue-50">
          <span className="text-3xl">⬆</span>
          <span className="mt-2 text-sm font-semibold text-gray-900">
            Klikněte pro výběr PDF souboru
          </span>
          <span className="mt-1 text-xs text-gray-500">
            Podporován je jeden PDF dokument na nahrání
          </span>

          <input
            type="file"
            accept="application/pdf"
            onChange={handlePdfUpload}
            className="hidden"
          />
        </label>

        {selectedPdfName && (
          <div className="mt-3 rounded-xl border border-blue-200 bg-blue-100/70 px-3 py-2 text-sm text-blue-900">
            Vybraný soubor: <span className="font-semibold">{selectedPdfName}</span>
          </div>
        )}

        {uploadingPdf && (
          <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
            Zpracovávám PDF dokument...
          </div>
        )}

        {pdfResult && (
          <div
            className={`mt-3 rounded-xl border px-3 py-3 text-sm ${
              pdfResult.error
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-green-200 bg-green-50 text-green-700"
            }`}
          >
            {pdfResult.error
              ? pdfResult.error
              : `✓ PDF "${pdfResult.filename}" bylo úspěšně přidáno (${pdfResult.chunks_indexed} částí).`}
          </div>
        )}

        <div className="mt-4 rounded-xl bg-slate-900 px-4 py-3 text-xs leading-5 text-slate-200">
          Tip: PDF upload je vhodný pro dokumenty, které nejsou dobře čitelné přímo z webu obce.
        </div>
      </div>
    </section>
  );
}
