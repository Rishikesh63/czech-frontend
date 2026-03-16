const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3000";

function municipalityField(municipalityId?: string) {
  const value = municipalityId?.trim();
  return value ? { municipality_id: value } : {};
}

export async function ingestWebsite(url: string, municipalityId?: string) {
  return fetch(`${API_BASE}/ingest`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url,
      ...municipalityField(municipalityId),
    }),
  });
}

export async function uploadPdf(file: File, municipalityId?: string) {
  const formData = new FormData();
  formData.append("file", file);
  const value = municipalityId?.trim();
  if (value) {
    formData.append("municipality_id", value);
  }

  return fetch(`${API_BASE}/upload-pdf`, {
    method: "POST",
    body: formData,
  });
}

export async function processQuestion(
  question: string,
  language?: "cs" | "en",
  citizenEmail?: string,
  municipalityId?: string,
) {
  return fetch(`${API_BASE}/process-question`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      question,
      language,
      citizen_email: citizenEmail?.trim() || undefined,
      ...municipalityField(municipalityId),
    }),
  });
}

export async function ragQuery(
  question: string,
  language?: "cs" | "en",
  municipalityId?: string,
) {
  return fetch(`${API_BASE}/rag`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      question,
      language,
      ...municipalityField(municipalityId),
    }),
  });
}

export async function searchDocs(
  query: string,
  limit?: number,
  municipalityId?: string,
) {
  return fetch(`${API_BASE}/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query,
      limit,
      ...municipalityField(municipalityId),
    }),
  });
}
