"use client";

interface IngestSectionProps {
  url: string;
  setUrl: (val: string) => void;
  ingest: () => void;
  ingesting: boolean;
  ingestResult: any;
}

export default function IngestSection({
  url,
  setUrl,
  ingest,
  ingesting,
  ingestResult,
}: IngestSectionProps) {
  return (
    <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-fit">
      <h2 className="text-xl text-black font-bold mb-4 flex items-center gap-2">
        <span>🔗</span> Ingest Website
      </h2>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="https://example.com/page"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-black"
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
          {ingesting ? "Processing..." : "Ingest URL"}
        </button>

        {ingestResult && (
          <div className={`mt-4 p-3 rounded-lg text-sm ${ingestResult.error ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
            <pre className="whitespace-pre-wrap font-mono text-[10px]">
              {ingestResult.error ? ingestResult.error : "✓ Data successfully added to vector store"}
            </pre>
          </div>
        )}
      </div>
    </section>
  );
}