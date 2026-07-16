import { useState } from "react";
import DataTable from "../../components/DataTable";
import StatusBadge from "../../components/StatusBadge";
import { useClientKeys } from "../../hooks/useClientKeys";
import { Copy } from "lucide-react";

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

// Helper function to check if a date is expired
const isExpired = (dateString) => {
  if (!dateString) return false;
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return false;
  return date < new Date();
};

// Helper function to get relative time
const getRelativeTime = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Invalid Date";

  const now = new Date();
  const diffInDays = Math.floor((date - now) / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return "Today";
  if (diffInDays === 1) return "Tomorrow";
  if (diffInDays === -1) return "Yesterday";
  if (diffInDays > 0) return `in ${diffInDays} days`;
  return `${Math.abs(diffInDays)} days ago`;
};

export default function ClientKeys() {
  const { data, isLoading, isError } = useClientKeys();
  const [copiedKey, setCopiedKey] = useState(null);

  const copyToClipboard = (key) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const columns = [
    {
      key: "key",
      title: "Key",
      render: (row) => (
        <div className="flex items-center gap-2">
          <code className="text-sm bg-gray-100 px-2 py-1 rounded">
            {row.key}
          </code>
          <button
            onClick={() => copyToClipboard(row.key)}
            className="p-1 text-gray-500 hover:text-indigo-600"
            title="Copy"
          >
            <Copy className="h-4 w-4" />
            {copiedKey === row.key && (
              <span className="text-xs text-green-600 ml-1">Copied!</span>
            )}
          </button>
        </div>
      ),
    },
    {
      key: "status",
      title: "Status",
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: "issuedAt",
      title: "Issued At",
      render: (row) => formatDate(row.issuedAt),
    },
    {
      key: "expiresAt",
      title: "Expires At",
      render: (row) => {
        const formattedDate = formatDate(row.expiresAt);
        const expired = isExpired(row.expiresAt);
        const relativeTime = getRelativeTime(row.expiresAt);

        // Color coding based on expiry
        let textColor = "text-gray-900";
        if (expired) {
          textColor = "text-red-600 font-semibold";
        } else {
          const now = new Date();
          const expiryDate = new Date(row.expiresAt);
          const daysUntilExpiry = Math.floor(
            (expiryDate - now) / (1000 * 60 * 60 * 24),
          );
          if (daysUntilExpiry <= 7) {
            textColor = "text-orange-500";
          }
        }

        return (
          <div>
            <span className={textColor}>{formattedDate}</span>
            <div className="text-xs text-gray-500">
              {expired ? " Expired" : relativeTime}
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <DataTable
          columns={columns}
          rows={data?.data?.items || []}
          isLoading={isLoading}
          isError={isError}
          emptyMessage="No keys yet"
        />
      </div>
    </div>
  );
}
