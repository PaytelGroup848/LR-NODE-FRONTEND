import { useState } from "react";
import DataTable from "../../components/DataTable";
import Pagination from "../../components/Pagination";
import StatusBadge from "../../components/StatusBadge";
import { useGetAllKeys } from "../../hooks/useGetAllKeys";
import { useSuspendKey } from "../../hooks/useSuspendKey";
import { useUnsuspendKey } from "../../hooks/useUnsuspendKey";
import { Ban, Check } from "lucide-react";

// Helper function to format dates
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Invalid Date";
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export default function SuperadminKeys() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [expiringWithinDays, setExpiringWithinDays] = useState("");

  const { data, isLoading, isError } = useGetAllKeys({
    page,
    limit: 10,
    search,
    status,
    expiringWithinDays: expiringWithinDays
      ? parseInt(expiringWithinDays)
      : undefined,
  });
  const suspendKey = useSuspendKey();
  const unsuspendKey = useUnsuspendKey();

  const columns = [
    { key: "key", title: "Key" },
    {
      key: "status",
      title: "Status",
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: "assignedTo",
      title: "Assigned To",
      render: (row) =>
        row?.assignedToClient?.email ? (
          <span className="text-gray-900">{row.assignedToClient.email}</span>
        ) : (
          <span className="text-orange-500 font-medium">Unassigned</span>
        ),
    },
    {
      key: "issuedAt",
      title: "Issued At",
      render: (row) => formatDate(row.issuedAt),
    },
    {
      key: "expiresAt",
      title: "Expires At",
      render: (row) => formatDate(row.expiresAt),
    },
    {
      key: "actions",
      title: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          {row.status === "active" ? (
            <button
              onClick={() => suspendKey.mutate(row._id)}
              className="p-2 text-amber-600 hover:bg-amber-50 rounded"
              title="Suspend"
            >
              <Ban className="h-4 w-4" />
            </button>
          ) : row.status === "suspended" ? (
            <button
              onClick={() => unsuspendKey.mutate(row._id)}
              className="p-2 text-green-600 hover:bg-green-50 rounded"
              title="Unsuspend"
            >
              <Check className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search keys..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="expired">Expired</option>
          <option value="unassigned">Unassigned</option>
        </select>
        <select
          value={expiringWithinDays}
          onChange={(e) => setExpiringWithinDays(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">All Expiry</option>
          <option value="7">Expiring in 7 days</option>
          <option value="30">Expiring in 30 days</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <DataTable
          columns={columns}
          rows={data?.data?.items || []}
          isLoading={isLoading}
          isError={isError}
          emptyMessage="No keys yet"
        />
        {data?.data?.pagination && (
          <Pagination
            pagination={data.data.pagination}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  );
}
