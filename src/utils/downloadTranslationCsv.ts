import { ENDPOINTS, BASE_URL } from '@/services/api/endpoints';

// Mirrors the dev-proxy logic in baseApiSlice.ts — in dev, hit the relative
// path so it routes through the Vite proxy (avoids CORS); use the real
// absolute BASE_URL in production builds.
const effectiveBaseUrl = import.meta.env.DEV ? '' : BASE_URL;

export async function downloadTranslationCsv(jobId: string, authToken?: string | null) {
  const url = `${effectiveBaseUrl}${ENDPOINTS.EXPORT_CSV(jobId)}`;
  const response = await fetch(url, {
    cache: 'no-store',
    headers: {
      accept: 'application/json',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    },
  });
  if (!response.ok) {
    throw new Error(`Download failed (${response.status})`);
  }
  const rawBlob = await response.blob();
  // Prepend a UTF-8 BOM so Excel reliably detects UTF-8 instead of guessing
  // (and garbling non-ASCII characters like Igbo/Yoruba diacritics) — the
  // file itself was always valid UTF-8, Excel just needs this marker.
  const utf8Bom = new Uint8Array([0xef, 0xbb, 0xbf]);
  const blob = new Blob([utf8Bom, rawBlob], { type: 'text/csv;charset=utf-8' });
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = `translation-${jobId}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(objectUrl);
}