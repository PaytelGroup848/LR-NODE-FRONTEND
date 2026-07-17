import StatCard from "../../components/StatCard";
import { usePartnerDashboard } from "../../hooks/usePartnerDashboard";
import { Users, Key, Clock } from "lucide-react";

export default function PartnerDashboard() {
  const { data, isLoading, isError } = usePartnerDashboard();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (isError) {
    return <div className="text-red-600">Error loading dashboard</div>;
  }

  const stats = data?.data || {};

  return (
    <div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Users}
          label="Total Clients"
          value={stats.clientCount || 0}
          color="text-blue-500"
        />
        <StatCard
          icon={Key}
          label="Keys Remaining"
          value={stats.unusedKeys || 0}
          color="text-green-500"
        />
        <StatCard
          icon={Key}
          label="Keys Used"
          color="text-yellow-500"
          value={stats.usedKeys || 0}
        />
        <StatCard
          icon={Clock}
          label="Expiring Soon"
          value={stats.expiringSoon || 0}
          color="text-orange-600"
        />
      </div>
    </div>
  );
}
