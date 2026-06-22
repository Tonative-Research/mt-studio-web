import AppHeader from '@/components/Header';
import DashboardContent from '@/components/dashboard/Dashboard';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <AppHeader />
      <DashboardContent />
    </div>
  );
}
