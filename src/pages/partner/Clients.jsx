import { useState } from "react";
import DataTable from "../../components/DataTable";
import Pagination from "../../components/Pagination";
import StatusBadge from "../../components/StatusBadge";
// import Modal from "../../components/Modal";
import { usePartnerClients } from "../../hooks/usePartnerClients";
import { useCreatePartnerClient } from "../../hooks/useCreatePartnerClient";
import { Plus } from "lucide-react";
import RectangularModal from "../../components/RectangularModal";

export default function PartnerClients() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newClient, setNewClient] = useState({
    representativeName: "",
    companyName: "",
    phone: "",
    email: "",
    address: "",
    gstNumber: "",
    salesRepresentativeName: "",
    password: "",
    confirmPassword: "",
  });

  const { data, isLoading, isError } = usePartnerClients({
    page,
    limit: 10,
    search,
  });
  const createClient = useCreatePartnerClient();

  const handleCreateClient = (e) => {
    e.preventDefault();
    createClient.mutate(newClient, {
      onSuccess: () => {
        setCreateModalOpen(false);
        setNewClient({
          representativeName: "",
          companyName: "",
          phone: "",
          email: "",
          address: "",
          gstNumber: "",
          salesRepresentativeName: "",
          password: "",
          confirmPassword: "",
        });
      },
    });
  };

  const columns = [
    { key: "representativeName", title: "Name" },
    { key: "companyName", title: "Company" },
    { key: "email", title: "Email" },
    {
      key: "status",
      title: "Status",
      render: (row) => <StatusBadge status={row.status} />,
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search clients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <button
          onClick={() => setCreateModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500"
        >
          <Plus className="h-4 w-4" />
          Create Client
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <DataTable
          columns={columns}
          rows={data?.data?.items || []}
          isLoading={isLoading}
          isError={isError}
          emptyMessage="No clients yet"
        />
        {data?.data?.pagination && (
          <Pagination
            pagination={data.data.pagination}
            onPageChange={setPage}
          />
        )}
      </div>

      <RectangularModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create Client"
      >
        <form onSubmit={handleCreateClient} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Representative Name *
            </label>
            <input
              required
              type="text"
              value={newClient.representativeName}
              onChange={(e) =>
                setNewClient({
                  ...newClient,
                  representativeName: e.target.value,
                })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Company Name
            </label>
            <input
              type="text"
              value={newClient.companyName}
              onChange={(e) =>
                setNewClient({ ...newClient, companyName: e.target.value })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone *
            </label>
            <input
              required
              type="text"
              value={newClient.phone}
              onChange={(e) =>
                setNewClient({ ...newClient, phone: e.target.value })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email *
            </label>
            <input
              required
              type="email"
              value={newClient.email}
              onChange={(e) =>
                setNewClient({ ...newClient, email: e.target.value })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <input
              type="text"
              value={newClient.address}
              onChange={(e) =>
                setNewClient({ ...newClient, address: e.target.value })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              GST Number
            </label>
            <input
              type="text"
              value={newClient.gstNumber}
              onChange={(e) =>
                setNewClient({ ...newClient, gstNumber: e.target.value })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Sales Representative Name
            </label>
            <input
              type="text"
              value={newClient.salesRepresentativeName}
              onChange={(e) =>
                setNewClient({
                  ...newClient,
                  salesRepresentativeName: e.target.value,
                })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={newClient.password}
              onChange={(e) =>
                setNewClient({ ...newClient, password: e.target.value })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              value={newClient.confirmPassword}
              onChange={(e) =>
                setNewClient({ ...newClient, confirmPassword: e.target.value })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setCreateModalOpen(false)}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createClient.isPending}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 disabled:opacity-50"
            >
              {createClient.isPending ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </RectangularModal>
    </div>
  );
}
