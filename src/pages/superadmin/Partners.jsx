import { useState } from "react";
import DataTable from "../../components/DataTable";
import Pagination from "../../components/Pagination";
import StatusBadge from "../../components/StatusBadge";
import Modal from "../../components/Modal";
import { useSuperadminPartners } from "../../hooks/useSuperadminPartners";
import { useCreatePartner } from "../../hooks/useCreatePartner";
import { useGeneratePartnerBulkKeys } from "../../hooks/useGeneratePartnerBulkKeys";
import { useSuspendPartner } from "../../hooks/useSuspendPartner";
import { useUnsuspendPartner } from "../../hooks/useUnsuspendPartner";
import { useSendBulkKeysEmail } from "../../hooks/useSendBulkKeysEmail";
import { Plus, Key, Mail, Ban, Check, BarChart3 } from "lucide-react";
import RectangularModal from "../../components/RectangularModal";
import { Eye, EyeOff, Pencil } from "lucide-react";
import { usePartnerDetail } from "../../hooks/usePartnerDetail";
import { useUpdatePartner } from "../../hooks/useUpdatePartner";

export default function SuperadminPartners() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [generateKeysModalOpen, setGenerateKeysModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [newPartner, setNewPartner] = useState({
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

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewPartnerId, setViewPartnerId] = useState(null);
  const [editPartnerId, setEditPartnerId] = useState(null);
  const [editPartner, setEditPartner] = useState({
    representativeName: "",
    companyName: "",
    phone: "",
    email: "",
    address: "",
    gstNumber: "",
    salesRepresentativeName: "",
  });

  const { data, isLoading, isError } = useSuperadminPartners({
    page,
    limit: 10,
    search,
  });
  const createPartner = useCreatePartner();
  const suspendPartner = useSuspendPartner();
  const unsuspendPartner = useUnsuspendPartner();
  const sendBulkKeysEmail = useSendBulkKeysEmail();

  const generateKeys = useGeneratePartnerBulkKeys(selectedPartner?._id);

  const updatePartner = useUpdatePartner();
  const { data: partnerDetailData, isLoading: isPartnerDetailLoading } =
    usePartnerDetail(viewModalOpen ? viewPartnerId : null);

  const handleCreatePartner = (e) => {
    e.preventDefault();
    createPartner.mutate(newPartner, {
      onSuccess: () => {
        setCreateModalOpen(false);
        setNewPartner({
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

    if (!selectedPartner) {
      // Handle no partner selected
      return;
    }
    generateKeys.mutate(
      { quantity: keyQuantity, validityDays: keyValidity },
      {
        onSuccess: () => {
          setGenerateKeysModalOpen(false);
          setSelectedPartner(null);
          setKeyQuantity(1);
          setKeyValidity(30);
        },
      },
    );
  };

  const openViewModal = (row) => {
    setViewPartnerId(row._id);
    setViewModalOpen(true);
  };

  const openEditModal = (row) => {
    setEditPartnerId(row._id);
    setEditPartner({
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

  const handleEditPartner = (e) => {
    e.preventDefault();
    updatePartner.mutate(
      { partnerId: editPartnerId, data: editPartner },
      {
        onSuccess: () => {
          setEditModalOpen(false);
          setEditPartnerId(null);
        },
      },
    );
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
              onClick={() => suspendPartner.mutate(row._id)}
              className="p-2 text-amber-600 hover:bg-amber-50 rounded"
              title="Suspend"
            >
              <Ban className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={() => unsuspendPartner.mutate(row._id)}
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
            placeholder="Search partners..."
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
          Create Partner
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <DataTable
          columns={columns}
          rows={data?.data?.items || []}
          isLoading={isLoading}
          isError={isError}
          emptyMessage="No partners yet"
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
        size="2xl"
        title="Create Partner"
      >
        <form onSubmit={handleCreatePartner} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Representative Name *
              </label>
              <input
                required
                type="text"
                value={newPartner.representativeName}
                onChange={(e) =>
                  setNewPartner({
                    ...newPartner,
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
                value={newPartner.companyName}
                onChange={(e) =>
                  setNewPartner({ ...newPartner, companyName: e.target.value })
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
                value={newPartner.phone}
                onChange={(e) =>
                  setNewPartner({ ...newPartner, phone: e.target.value })
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
                value={newPartner.email}
                onChange={(e) =>
                  setNewPartner({ ...newPartner, email: e.target.value })
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
                value={newPartner.address}
                onChange={(e) =>
                  setNewPartner({ ...newPartner, address: e.target.value })
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
                value={newPartner.gstNumber}
                onChange={(e) =>
                  setNewPartner({ ...newPartner, gstNumber: e.target.value })
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
                value={newPartner.salesRepresentativeName}
                onChange={(e) =>
                  setNewPartner({
                    ...newPartner,
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
                  value={newPartner.password}
                  onChange={(e) =>
                    setNewPartner({ ...newPartner, password: e.target.value })
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
                  value={newPartner.confirmPassword}
                  onChange={(e) =>
                    setNewPartner({
                      ...newPartner,
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
              disabled={createPartner.isPending}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 disabled:opacity-50"
            >
              {createPartner.isPending ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </RectangularModal>

      <Modal
        isOpen={generateKeysModalOpen}
        onClose={() => {
          setGenerateKeysModalOpen(false);
          setSelectedPartner(null);
        }}
        title="Generate Bulk Keys"
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
              onChange={(e) => setKeyQuantity(parseInt(e.target.value) || 1)}
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
              onChange={(e) => setKeyValidity(parseInt(e.target.value) || 30)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setGenerateKeysModalOpen(false);
                setSelectedPartner(null);
              }}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={generateKeys.isPending || !selectedPartner}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 disabled:opacity-50"
            >
              {generateKeys.isPending ? "Generating..." : "Generate"}
            </button>
          </div>
        </form>
      </Modal>

      {/* ---------- Edit Modal ---------- */}
      <RectangularModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Partner"
        size="2xl"
      >
        <form onSubmit={handleEditPartner} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Representative Name *
              </label>
              <input
                required
                type="text"
                value={editPartner.representativeName}
                onChange={(e) =>
                  setEditPartner({
                    ...editPartner,
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
                value={editPartner.companyName}
                onChange={(e) =>
                  setEditPartner({
                    ...editPartner,
                    companyName: e.target.value,
                  })
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
                value={editPartner.phone}
                onChange={(e) =>
                  setEditPartner({ ...editPartner, phone: e.target.value })
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
                value={editPartner.email}
                onChange={(e) =>
                  setEditPartner({ ...editPartner, email: e.target.value })
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
                value={editPartner.address}
                onChange={(e) =>
                  setEditPartner({ ...editPartner, address: e.target.value })
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
                value={editPartner.gstNumber}
                onChange={(e) =>
                  setEditPartner({ ...editPartner, gstNumber: e.target.value })
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
                value={editPartner.salesRepresentativeName}
                onChange={(e) =>
                  setEditPartner({
                    ...editPartner,
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
              disabled={updatePartner.isPending}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 disabled:opacity-50"
            >
              {updatePartner.isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </RectangularModal>

      {/* ---------- View Modal ---------- */}
      <RectangularModal
        isOpen={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setViewPartnerId(null);
        }}
        title="Partner Details"
        size="2xl"
      >
        {isPartnerDetailLoading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : partnerDetailData ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-sm">
              <div>
                <span className="block text-gray-500">Representative Name</span>
                <span className="font-medium text-gray-900">
                  {partnerDetailData.representativeName}
                </span>
              </div>
              <div>
                <span className="block text-gray-500">Company Name</span>
                <span className="font-medium text-gray-900">
                  {partnerDetailData.companyName || "-"}
                </span>
              </div>
              <div>
                <span className="block text-gray-500">Phone</span>
                <span className="font-medium text-gray-900">
                  {partnerDetailData.phone}
                </span>
              </div>
              <div>
                <span className="block text-gray-500">Email</span>
                <span className="font-medium text-gray-900">
                  {partnerDetailData.email}
                </span>
              </div>
              <div>
                <span className="block text-gray-500">Address</span>
                <span className="font-medium text-gray-900">
                  {partnerDetailData.address || "-"}
                </span>
              </div>
              <div>
                <span className="block text-gray-500">GST Number</span>
                <span className="font-medium text-gray-900">
                  {partnerDetailData.gstNumber || "-"}
                </span>
              </div>
              <div>
                <span className="block text-gray-500">Status</span>
                <StatusBadge status={partnerDetailData.status} />
              </div>
            </div>

            {/* {partnerDetailData.stats && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">
                  Key Stats
                </h3>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-lg bg-gray-50 p-3">
                    <div className="text-xs text-gray-500">Total Allocated</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {partnerDetailData.stats.totalAllocated ?? 0}
                    </div>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3">
                    <div className="text-xs text-gray-500">Used</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {partnerDetailData.stats.used ?? 0}
                    </div>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3">
                    <div className="text-xs text-gray-500">Unused</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {partnerDetailData.stats.unused ?? 0}
                    </div>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3">
                    <div className="text-xs text-gray-500">Expiring Soon</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {partnerDetailData.stats.expiringSoon ?? 0}
                    </div>
                  </div>
                </div>
              </div>
            )} */}
          </div>
        ) : (
          <p className="text-sm text-gray-500">Partner not found.</p>
        )}
      </RectangularModal>
    </div>
  );
}
