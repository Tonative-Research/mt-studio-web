import { useState } from 'react';
import { Download, Cloud, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Spinner } from '@/components/common/Spinner';
import { useAppSelector } from '@/redux/hooks';
import { useGetTranslationResultQuery } from '@/services/api/translate';
import { ENDPOINTS, BASE_URL } from '@/services/api/endpoints';
import { ETranslationStatus } from '@/services/types/translate';

// Mirrors the dev-proxy logic in baseApiSlice.ts — in dev, hit the relative
// path so it routes through the Vite proxy (avoids CORS); use the real
// absolute BASE_URL in production builds.
const effectiveBaseUrl = import.meta.env.DEV ? '' : BASE_URL;

export default function PreviewTable() {
  const currentJob = useAppSelector((state) => state.translate.currentJob);
  const jobStatus = useAppSelector((state) => state.translate.jobStatus);
  const authToken = useAppSelector((state) => state.auth?.authToken);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const isCompleted = jobStatus === ETranslationStatus.Completed;

  const { data: result, isLoading, isError } = useGetTranslationResultQuery(currentJob?.id ?? '', {
    skip: !currentJob || !isCompleted,
  });

  // Nothing to show until a job has actually finished.
  if (!currentJob || !isCompleted) {
    return null;
  }

  const handleDownload = async () => {
    setDownloadError(null);
    setIsDownloading(true);
    try {
      const url = `${effectiveBaseUrl}${ENDPOINTS.EXPORT_CSV(currentJob.id)}`;
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
      // Prepend a UTF-8 BOM so Excel reliably detects UTF-8 instead of
      // guessing (and garbling non-ASCII characters like Igbo/Yoruba
      // diacritics) — the file itself was always valid UTF-8, Excel just
      // needs this marker to know that.
      const utf8Bom = new Uint8Array([0xef, 0xbb, 0xbf]);
      const blob = new Blob([utf8Bom, rawBlob], { type: 'text/csv;charset=utf-8' });
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = `translation-${currentJob.id}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(objectUrl);
    } catch (err) {
      setDownloadError(err instanceof Error ? err.message : 'Something went wrong downloading the file.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="glass-card overflow-hidden">
      <div className="px-6 lg:px-8 py-5 flex items-center justify-between border-b border-gray-100 bg-white">
        <div className="flex items-center gap-3">
          <Cloud className="text-gray-400" size={20} />
          <h3 className="font-bold text-lg tracking-tight text-gray-900">
            Output Preview
          </h3>
        </div>
        <Button
          variant="accent"
          size="sm"
          leadingIcon={isDownloading ? <Spinner size="sm" /> : <Download size={14} />}
          className="font-black uppercase tracking-[0.15em] shadow-lg shadow-accent-500/20"
          onClick={handleDownload}
          disabled={isDownloading}
        >
          {isDownloading ? 'Downloading...' : 'Download CSV'}
        </Button>
      </div>

      {downloadError && (
        <div className="px-6 lg:px-8 py-3 bg-red-50 border-b border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
          <AlertTriangle size={14} className="shrink-0" />
          {downloadError}
        </div>
      )}

      {isLoading && (
        <div className="py-16 flex flex-col items-center justify-center gap-3 text-gray-400">
          <Spinner size="md" />
          <span className="text-sm font-medium">Loading results...</span>
        </div>
      )}

      {isError && !isLoading && (
        <div className="py-16 flex flex-col items-center justify-center gap-2 text-red-500">
          <AlertTriangle size={20} />
          <span className="text-sm font-medium">Couldn't load the results preview.</span>
        </div>
      )}

      {result && result.rows.length > 0 && (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-primary-800 text-white">
                  {result.columns.map((col) => (
                    <th
                      key={col}
                      className="px-6 lg:px-8 py-4 text-[10px] font-black uppercase tracking-widest border-r border-white/10 last:border-r-0"
                    >
                      {col.replace(/_/g, ' ')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {result.rows.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    {result.columns.map((col, colIdx) => (
                      <td
                        key={col}
                        className={`px-6 lg:px-8 py-5 text-sm leading-relaxed border-r border-gray-100 last:border-r-0 ${
                          colIdx === result.columns.length - 1
                            ? 'italic font-medium text-primary-600'
                            : 'font-medium text-gray-700'
                        }`}
                      >
                        {row[col]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border-t border-gray-100 py-4 px-6 lg:px-8 text-center text-[10px] font-black uppercase tracking-widest text-primary-500/70">
            {result.mayBeTruncated
              ? `Showing ${result.rows.length} of ${result.rowsProcessed} rows — download the CSV for the complete file`
              : `Showing all ${result.rows.length} rows`}
          </div>
        </>
      )}

      {result && result.rows.length === 0 && !isLoading && (
        <div className="py-16 text-center text-sm text-gray-400 font-medium">
          No preview rows returned for this job.
        </div>
      )}
    </div>
  );
}