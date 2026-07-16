import StatCard from "../../components/StatCard";
import { useClientDashboard } from "../../hooks/useClientDashboard";
import { Key } from "lucide-react";

export default function ClientDashboard() {
  const { data, isLoading, isError } = useClientDashboard();

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

  const keys = data?.data?.keys || [];
  const totalKeys = keys.length;
  const activeKeys = keys.filter((key) => key.status === "active").length;

  return (
    <div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          icon={Key}
          label="Total Keys"
          value={totalKeys}
          color="text-blue-600"
        />
        <StatCard
          icon={Key}
          label="Active Keys"
          value={activeKeys}
          color="text-green-600"
        />
      </div>
    </div>
  );
}
