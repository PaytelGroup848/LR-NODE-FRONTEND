import StatCard from "../../components/StatCard";
import { useSuperadminDashboard } from "../../hooks/useSuperadminDashboard";
import { Users, UserPlus, Key, Clock, UserRoundPlus } from "lucide-react";

export default function SuperadminDashboard() {
  const { data, isLoading, isError } = useSuperadminDashboard();

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
          icon={UserRoundPlus}
          label="Total Partners"
          value={stats.partnerCount || 0}
          color="text-blue-500"
        />
        <StatCard
          icon={Users}
          label="Total Clients"
          value={stats.clientCount || 0}
          color="text-indigo-500"
        />
        <StatCard
          icon={Key}
          label="Active Keys"
          value={stats.activeKeys || 0}
          color="text-green-500"
        />
        <StatCard
          icon={Key}
          label="Suspended Keys"
          value={stats.suspendedKeys || 0}
          color="text-amber-600"
        />
        <StatCard
          icon={Key}
          label="Expired Keys"
          value={stats.expiredKeys || 0}
          color="text-red-500"
        />
        <StatCard
          icon={Clock}
          label="Expiring in 7 Days"
          value={stats.expiringIn7Days || 0}
          color="text-orange-600"
        />
        <StatCard
          icon={Clock}
          label="Expiring in 30 Days"
          value={stats.expiringIn30Days || 0}
          color="text-blue-500"
        />
      </div>
    </div>
  );
}
