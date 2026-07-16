import { useState } from "react";
import DataTable from "../../components/DataTable";
import Pagination from "../../components/Pagination";
import StatusBadge from "../../components/StatusBadge";
import Modal from "../../components/Modal";
import { usePartnerKeys } from "../../hooks/usePartnerKeys";
import { usePartnerClients } from "../../hooks/usePartnerClients";
import { useAssignKey } from "../../hooks/useAssignKey";
import { useSuspendPartnerKey } from "../../hooks/useSuspendPartnerKey";
import { useUnsuspendPartnerKey } from "../../hooks/useUnsuspendPartnerKey";
import { useSendPartnerKeyEmail } from "../../hooks/useSendPartnerKeyEmail";
import { User, Mail, Ban, Check } from "lucide-react";

// Helper functions for date formatting
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

const isExpired = (dateString) => {
  if (!dateString) return false;
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return false;
  return date < new Date();
};

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

const getDaysUntilExpiry = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return null;
  const now = new Date();
  return Math.floor((date - now) / (1000 * 60 * 60 * 24));
};

export default function PartnerKeys() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState(null);
  const [selectedClientId, setSelectedClientId] = useState("");

  const {
    data: keysData,
    isLoading,
    isError,
  } = usePartnerKeys({ page, limit: 10, status });
  const { data: clientsData } = usePartnerClients({ limit: 100 });
  const assignKey = useAssignKey();
  const suspendKey = useSuspendPartnerKey();
  const unsuspendKey = useUnsuspendPartnerKey();
  const sendEmail = useSendPartnerKeyEmail();

  const handleAssign = (e) => {
    e.preventDefault();
    assignKey.mutate(
      { keyId: selectedKey._id, clientId: selectedClientId },
      {
        onSuccess: () => {
          setAssignModalOpen(false);
          setSelectedKey(null);
          setSelectedClientId("");
        },
      },
    );
  };

  const columns = [
    { key: "key", title: "Key" },
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
        const daysUntilExpiry = getDaysUntilExpiry(row.expiresAt);

        let textColor = "text-gray-900";
        if (expired) {
          textColor = "text-red-600 font-semibold";
        } else if (daysUntilExpiry !== null && daysUntilExpiry <= 7) {
          textColor = "text-orange-500";
        }

        return (
          <div>
            <span className={textColor}>{formattedDate}</span>
            <div className="text-xs text-gray-500">
              {expired ? "⚠️ Expired" : relativeTime}
            </div>
          </div>
        );
      },
    },
    {
      key: "actions",
      title: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          {row.status === "unassigned" && (
            <button
              onClick={() => {
                setSelectedKey(row);
                setAssignModalOpen(true);
              }}
              className="p-2 text-indigo-600 hover:bg-indigo-50 rounded"
              title="Assign to Client"
            >
              <User className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={() => sendEmail.mutate(row._id)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
            title="Send Email"
          >
            <Mail className="h-4 w-4" />
          </button>
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
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <DataTable
          columns={columns}
          rows={keysData?.data?.items || []}
          isLoading={isLoading}
          isError={isError}
          emptyMessage="No keys yet"
        />
        {keysData?.data?.pagination && (
          <Pagination
            pagination={keysData.data.pagination}
            onPageChange={setPage}
          />
        )}
      </div>

      <Modal
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        title="Assign Key to Client"
      >
        <form onSubmit={handleAssign} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Select Client
            </label>
            <select
              required
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            >
              <option value="">-- Select --</option>
              {(clientsData?.data?.items || []).map((client) => (
                <option key={client._id} value={client._id}>
                  {client.representativeName} ({client.email})
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setAssignModalOpen(false)}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={assignKey.isPending}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 disabled:opacity-50"
            >
              {assignKey.isPending ? "Assigning..." : "Assign"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
