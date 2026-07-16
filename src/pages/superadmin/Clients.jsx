import { useState } from "react";
import DataTable from "../../components/DataTable";
import Pagination from "../../components/Pagination";
import StatusBadge from "../../components/StatusBadge";
import Modal from "../../components/Modal";
import { useSuperadminClients } from "../../hooks/useSuperadminClients";
import { useCreateClient } from "../../hooks/useCreateClient";
import { useGenerateClientKeys } from "../../hooks/useGenerateClientKeys";
import { useSuspendClient } from "../../hooks/useSuspendClient";
import { useUnsuspendClient } from "../../hooks/useUnsuspendClient";
import { useSendKeyEmail } from "../../hooks/useSendKeyEmail";
import { Plus, Key, Mail, Ban, Check, EyeOff, Eye } from "lucide-react";
import RectangularModal from "../../components/RectangularModal";

export default function SuperadminClients() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [generateKeysModalOpen, setGenerateKeysModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
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
  const [keyQuantity, setKeyQuantity] = useState(1);
  const [keyValidity, setKeyValidity] = useState(30);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { data, isLoading, isError } = useSuperadminClients({
    page,
    limit: 10,
    search,
  });
  const createClient = useCreateClient();
  const suspendClient = useSuspendClient();
  const unsuspendClient = useUnsuspendClient();
  const sendKeyEmail = useSendKeyEmail();

  const selectedClientId = selectedClient?._id || null;
  const generateKeys = useGenerateClientKeys(selectedClientId);

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

  const handleGenerateKeys = (e) => {
    e.preventDefault();
    if (generateKeys) {
      generateKeys.mutate(
        { quantity: keyQuantity, validityDays: keyValidity },
        {
          onSuccess: () => {
            setGenerateKeysModalOpen(false);
            setSelectedClient(null);
          },
        },
      );
    }
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
            onClick={() => {
              setSelectedClient(row);
              setGenerateKeysModalOpen(true);
            }}
            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded"
            title="Generate Keys"
          >
            <Key className="h-4 w-4" />
          </button>
          <button
            onClick={() => sendKeyEmail.mutate(row._id)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
            title="Send Email"
          >
            <Mail className="h-4 w-4" />
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
                    <Eye className="h-4 w-4" />
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
                    <Eye className="h-4 w-4" />
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

      <Modal
        isOpen={generateKeysModalOpen}
        onClose={() => setGenerateKeysModalOpen(false)}
        title="Generate Keys"
      >
        <form onSubmit={handleGenerateKeys} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Quantity
            </label>
            <input
              type="number"
              min="1"
              value={keyQuantity}
              onChange={(e) => setKeyQuantity(parseInt(e.target.value))}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Validity (days)
            </label>
            <input
              type="number"
              min="1"
              value={keyValidity}
              onChange={(e) => setKeyValidity(parseInt(e.target.value))}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setGenerateKeysModalOpen(false)}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={generateKeys?.isPending}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 disabled:opacity-50"
            >
              {generateKeys?.isPending ? "Generating..." : "Generate"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
