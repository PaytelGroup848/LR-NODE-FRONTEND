import { useState } from "react";
import DataTable from "../../components/DataTable";
import Pagination from "../../components/Pagination";
import StatusBadge from "../../components/StatusBadge";
import Modal from "../../components/Modal";
import RectangularModal from "../../components/RectangularModal";
import { useSuperadminClients } from "../../hooks/useSuperadminClients";
import { useCreateClient } from "../../hooks/useCreateClient";
import { useUpdateClient } from "../../hooks/useUpdateClient";
import { useDeleteClient } from "../../hooks/useDeleteClient";
import { useClientDetail } from "../../hooks/useClientDetail";
import { useSuspendClient } from "../../hooks/useSuspendClient";
import { useUnsuspendClient } from "../../hooks/useUnsuspendClient";
import {
  Plus,
  Pencil,
  Eye,
  Trash2,
  EyeOff,
  Ban,
  Check,
  Eye as EyeIcon,
} from "lucide-react";

export default function SuperadminClients() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState(null);

  const suspendClient = useSuspendClient();
  const unsuspendClient = useUnsuspendClient();

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

  const [editClient, setEditClient] = useState({
    representativeName: "",
    companyName: "",
    phone: "",
    email: "",
    address: "",
    gstNumber: "",
    salesRepresentativeName: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { data, isLoading, isError } = useSuperadminClients({
    page,
    limit: 10,
    search,
  });

  const createClient = useCreateClient();
  const updateClient = useUpdateClient();
  const deleteClient = useDeleteClient();

  const { data: clientDetailData, isLoading: isClientDetailLoading } =
    useClientDetail(viewModalOpen ? selectedClientId : null);

  // ---------- Create ----------
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

  // ---------- Edit ----------
  const openEditModal = (row) => {
    setSelectedClientId(row._id);
    setEditClient({
      representativeName: row.representativeName || "",
      companyName: row.companyName || "",
      phone: row.phone || "",
      email: row.email || "",
      address: row.address || "",
      gstNumber: row.gstNumber || "",
      salesRepresentativeName: row.salesRepresentativeName || "",
    });
    setEditModalOpen(true);
  };

  const handleEditClient = (e) => {
    e.preventDefault();
    updateClient.mutate(
      { clientId: selectedClientId, data: editClient },
      {
        onSuccess: () => {
          setEditModalOpen(false);
          setSelectedClientId(null);
        },
      },
    );
  };

  // ---------- View ----------
  const openViewModal = (row) => {
    setSelectedClientId(row._id);
    setViewModalOpen(true);
  };

  // ---------- Delete ----------
  const openDeleteModal = (row) => {
    setSelectedClientId(row._id);
    setDeleteModalOpen(true);
  };

  const handleDeleteClient = () => {
    deleteClient.mutate(selectedClientId, {
      onSuccess: () => {
        setDeleteModalOpen(false);
        setSelectedClientId(null);
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
    {
      key: "actions",
      title: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => openViewModal(row)}
            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded"
            title="View"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => openEditModal(row)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
            title="Edit"
          >
            <Pencil className="h-4 w-4" />
          </button>
          {row.status === "active" ? (
            <button
              onClick={() => suspendClient.mutate(row._id)}
              className="p-2 text-amber-600 hover:bg-amber-50 rounded"
              title="Suspend"
            >
              <Ban className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={() => unsuspendClient.mutate(row._id)}
              className="p-2 text-green-600 hover:bg-green-50 rounded"
              title="Unsuspend"
            >
              <Check className="h-4 w-4" />
            </button>
          )}
        </div>
      ),
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

      {/* ---------- Create Modal ---------- */}
      <RectangularModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create Client"
        size="2xl"
      >
        <form onSubmit={handleCreateClient} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
              <div className="relative mt-1">
                <input
                  type={showPassword ? "text" : "password"}
                  value={newClient.password}
                  onChange={(e) =>
                    setNewClient({ ...newClient, password: e.target.value })
                  }
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="relative mt-1">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={newClient.confirmPassword}
                  onChange={(e) =>
                    setNewClient({
                      ...newClient,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
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

      {/* ---------- Edit Modal ---------- */}
      <RectangularModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Client"
        size="2xl"
      >
        <form onSubmit={handleEditClient} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Representative Name *
              </label>
              <input
                required
                type="text"
                value={editClient.representativeName}
                onChange={(e) =>
                  setEditClient({
                    ...editClient,
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
                value={editClient.companyName}
                onChange={(e) =>
                  setEditClient({ ...editClient, companyName: e.target.value })
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
                value={editClient.phone}
                onChange={(e) =>
                  setEditClient({ ...editClient, phone: e.target.value })
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
                value={editClient.email}
                onChange={(e) =>
                  setEditClient({ ...editClient, email: e.target.value })
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
                value={editClient.address}
                onChange={(e) =>
                  setEditClient({ ...editClient, address: e.target.value })
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
                value={editClient.gstNumber}
                onChange={(e) =>
                  setEditClient({ ...editClient, gstNumber: e.target.value })
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
                value={editClient.salesRepresentativeName}
                onChange={(e) =>
                  setEditClient({
                    ...editClient,
                    salesRepresentativeName: e.target.value,
                  })
                }
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setEditModalOpen(false)}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateClient.isPending}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 disabled:opacity-50"
            >
              {updateClient.isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </RectangularModal>

      {/* ---------- View Modal ---------- */}
      <RectangularModal
        isOpen={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setSelectedClientId(null);
        }}
        title="Client Details"
        size="2xl"
      >
        {isClientDetailLoading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : clientDetailData?.data ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-sm">
              <div>
                <span className="block text-gray-500">Representative Name</span>
                <span className="font-medium text-gray-900">
                  {clientDetailData.data.representativeName}
                </span>
              </div>
              <div>
                <span className="block text-gray-500">Company Name</span>
                <span className="font-medium text-gray-900">
                  {clientDetailData.data.companyName || "-"}
                </span>
              </div>
              <div>
                <span className="block text-gray-500">Phone</span>
                <span className="font-medium text-gray-900">
                  {clientDetailData.data.phone}
                </span>
              </div>
              <div>
                <span className="block text-gray-500">Email</span>
                <span className="font-medium text-gray-900">
                  {clientDetailData.data.email}
                </span>
              </div>
              <div>
                <span className="block text-gray-500">Address</span>
                <span className="font-medium text-gray-900">
                  {clientDetailData.data.address || "-"}
                </span>
              </div>
              <div>
                <span className="block text-gray-500">GST Number</span>
                <span className="font-medium text-gray-900">
                  {clientDetailData.data.gstNumber || "-"}
                </span>
              </div>
              <div>
                <span className="block text-gray-500">Status</span>
                <StatusBadge status={clientDetailData.data.status} />
              </div>
            </div>

            {/* <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                Assigned Keys ({clientDetailData.data.keys?.length || 0})
              </h3>
              {clientDetailData.data.keys?.length > 0 ? (
                <div className="border border-gray-200 rounded-md overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left font-medium text-gray-500">
                          Key
                        </th>
                        <th className="px-3 py-2 text-left font-medium text-gray-500">
                          Status
                        </th>
                        <th className="px-3 py-2 text-left font-medium text-gray-500">
                          Expires
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {clientDetailData.data.keys.map((key) => (
                        <tr key={key._id}>
                          <td className="px-3 py-2 font-mono text-xs">
                            {key.key}
                          </td>
                          <td className="px-3 py-2">
                            <StatusBadge status={key.status} />
                          </td>
                          <td className="px-3 py-2">
                            {new Date(key.expiresAt).toLocaleDateString(
                              "en-IN",
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No keys assigned yet.</p>
              )}
            </div> */}
          </div>
        ) : (
          <p className="text-sm text-gray-500">Client not found.</p>
        )}
      </RectangularModal>

      {/* ---------- Delete Confirm Modal ---------- */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Client"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-700">
            Are you sure you want to delete this client? This action cannot be
            undone. Any keys assigned to this client will become unassigned.
          </p>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setDeleteModalOpen(false)}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDeleteClient}
              disabled={deleteClient.isPending}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500 disabled:opacity-50"
            >
              {deleteClient.isPending ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
