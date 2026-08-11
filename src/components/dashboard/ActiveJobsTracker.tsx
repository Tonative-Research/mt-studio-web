import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useGetTranslationStatusQuery } from '@/services/api/translate';
import { updateJobStatus, updateJobProgress, setJobFetchFailed } from '@/redux/translateSlice';
import { ETranslationStatus, ITranslationJob } from '@/services/types/translate';

const POLL_INTERVAL_MS = 3000;
const TERMINAL_STATUSES: ETranslationStatus[] = [
  ETranslationStatus.Completed,
  ETranslationStatus.Failed,
];

function JobPoller({ job }: { job: ITranslationJob }) {
  const dispatch = useAppDispatch();
  const latestStatusRef = useRef(job.status);

  const shouldPoll = !TERMINAL_STATUSES.includes(latestStatusRef.current);
  const { data, isError } = useGetTranslationStatusQuery(job.id, {
    pollingInterval: shouldPoll ? POLL_INTERVAL_MS : 0,
  });

  useEffect(() => {
    dispatch(setJobFetchFailed({ id: job.id, failed: isError }));
  }, [isError, dispatch, job.id]);

  useEffect(() => {
    if (!data) return;
    latestStatusRef.current = data.status;
    dispatch(updateJobStatus({ id: job.id, status: data.status }));
    dispatch(
      updateJobProgress({
        id: job.id,
        percent: data.percent,
        translatedRows: data.completedRows,
        totalRows: data.totalRows,
        message: data.message,
        hasErrors: data.hasErrors,
      }),
    );
  }, [data, dispatch, job.id]);

  return null;
}

// Only the job the user currently has "focused" (currentJob) gets live
// polling. Other jobs in activeJobs keep their last-known status until
// the user switches focus to them, or until a page like HistoryContent
// reconciles them on mount. This caps concurrent-polling load to 1 job
// per user regardless of how many translations they've started — without
// this cap, N concurrent jobs would mean N independent 3s pollers per user.
export default function ActiveJobsTracker() {
  const currentJob = useAppSelector((state) => state.translate.currentJob);
  const activeJobs = useAppSelector((state) => state.translate.activeJobs ?? {});

  // currentJob might be stale relative to activeJobs (e.g. right after a
  // status update) — prefer the live entry from activeJobs when present.
  const focusedJob = currentJob ? activeJobs[currentJob.id] ?? currentJob : null;

  if (!focusedJob) return null;

  // If the focused job is already terminal, don't even mount a poller —
  // there's nothing left to fetch.
  if (TERMINAL_STATUSES.includes(focusedJob.status)) return null;

  return <JobPoller key={focusedJob.id} job={focusedJob} />;
}