import AppHeader from '@/components/Header';
import HistoryContent from '@/components/dashboard/HistoryContent';

export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <AppHeader />
      <HistoryContent />
    </div>
  );
}
