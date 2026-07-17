import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getBills,
  getSuperadminClients,
  getSuperadminPartners,
  generateBill,
  sendBillEmail,
} from "../../api/superadminApi";
import axiosInstance from "../../api/axiosInstance";
import DataTable from "../../components/DataTable";
import Pagination from "../../components/Pagination";
import Modal from "../../components/Modal";

export default function Billing() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedEntityType, setSelectedEntityType] = useState("client");
  const [selectedEntityId, setSelectedEntityId] = useState("");
  const [billingData, setBillingData] = useState({
    username: "",
    keyQuantity: 1,
    purchasedDate: new Date().toISOString().split("T")[0],
    renewalDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
      .toISOString()
      .split("T")[0],
    amountWithoutGST: 0,
  });
  const [generatedBill, setGeneratedBill] = useState(null);
  const [generatedKeys, setGeneratedKeys] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const queryClient = useQueryClient();

  const { data: clientsData } = useQuery({
    queryKey: ["superadminClients", { page: 1, limit: 100 }],
    queryFn: () => getSuperadminClients({ page: 1, limit: 100 }),
  });

  const { data: partnersData } = useQuery({
    queryKey: ["superadminPartners", { page: 1, limit: 100 }],
    queryFn: () => getSuperadminPartners({ page: 1, limit: 100 }),
  });

  const { data: billsData } = useQuery({
    queryKey: ["bills", { page, limit }],
    queryFn: () => getBills({ page, limit }),
  });

  const generateBillMutation = useMutation({
    mutationFn: generateBill,
    onSuccess: (data) => {
      setGeneratedBill(data.data.bill);
      setGeneratedKeys(data.data.keys);
      setShowSuccessModal(true);
      queryClient.invalidateQueries({ queryKey: ["bills"] });
    },
    onError: (error) => {
      console.error("Error generating bill:", error);
    },
  });

  const sendBillEmailMutation = useMutation({
    mutationFn: sendBillEmail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bills"] });
    },
  });

  const handleEntitySelect = () => {
    if (selectedEntityId) {
      setCurrentStep(2);
    }
  };

  const handleGenerateBill = () => {
    generateBillMutation.mutate({
      entityType: selectedEntityType,
      entityId: selectedEntityId,
      ...billingData,
    });
  };

  const handleViewPDF = (billId) => {
    const url = `${axiosInstance.defaults.baseURL}/superadmin/billing/${billId}/pdf?mode=view`;
    window.open(url, "_blank");
  };

  const handleDownloadPDF = (billId) => {
    const url = `${axiosInstance.defaults.baseURL}/superadmin/billing/${billId}/pdf?mode=download`;
    const a = document.createElement("a");
    a.href = url;
    a.download = `Invoice_${billId}.pdf`;
    a.click();
  };

  const handleSendEmail = (billId) => {
    if (
      window.confirm("Are you sure you want to send this invoice via email?")
    ) {
      sendBillEmailMutation.mutate(billId);
    }
  };

  const resetForm = () => {
    setCurrentStep(1);
    setSelectedEntityId("");
    setBillingData({
      username: "",
      keyQuantity: 1,
      purchasedDate: new Date().toISOString().split("T")[0],
      renewalDate: new Date(
        new Date().setFullYear(new Date().getFullYear() + 1),
      )
        .toISOString()
        .split("T")[0],
      amountWithoutGST: 0,
    });
    setShowSuccessModal(false);
    setGeneratedBill(null);
    setGeneratedKeys([]);
  };

  const selectedEntities =
    selectedEntityType === "client"
      ? clientsData?.data?.items || []
      : partnersData?.data?.items || [];

  const gstAmount = (billingData.amountWithoutGST * 18) / 100;
  const totalAmount = billingData.amountWithoutGST + gstAmount;

  const tableColumns = [
    { key: "billNumber", title: "Bill Number" },
    { key: "entityType", title: "Entity Type" },
    {
      key: "entityName",
      title: "Entity Name",
      render: (row) => row.entityId?.representativeName || "-",
    },
    { key: "username", title: "Username" },
    { key: "keyQuantity", title: "Quantity" },
    {
      key: "totalAmount",
      title: "Total Amount",
      render: (row) => `₹${row.totalAmount.toFixed(2)}`,
    },
    { key: "status", title: "Status" },
    {
      key: "actions",
      title: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleViewPDF(row._id)}
            className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
          >
            View
          </button>
          <button
            onClick={() => handleDownloadPDF(row._id)}
            className="text-green-600 hover:text-green-900 text-sm font-medium"
          >
            Download
          </button>
          <button
            onClick={() => handleSendEmail(row._id)}
            className="text-blue-600 hover:text-blue-900 text-sm font-medium"
            disabled={sendBillEmailMutation.isPending}
          >
            Send Email
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Billing</h1>
        {/* <button
          onClick={resetForm}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Create New Invoice
        </button> */}
      </div>

      {/* Wizard */}
      {(currentStep >= 1 || showSuccessModal) && (
        <div className="mb-8 bg-white p-6 rounded-lg shadow">
          {/* Step 1: Select Entity */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-lg font-semibold mb-4">
                Step 1: Select Entity
              </h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="entityType"
                      value="client"
                      checked={selectedEntityType === "client"}
                      onChange={(e) => setSelectedEntityType(e.target.value)}
                    />
                    Client
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="entityType"
                      value="partner"
                      checked={selectedEntityType === "partner"}
                      onChange={(e) => setSelectedEntityType(e.target.value)}
                    />
                    Partner
                  </label>
                </div>
                <select
                  value={selectedEntityId}
                  onChange={(e) => setSelectedEntityId(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">Select {selectedEntityType}</option>
                  {selectedEntities.map((entity) => (
                    <option key={entity._id} value={entity._id}>
                      {entity.representativeName} ({entity.email})
                    </option>
                  ))}
                </select>
                <p className="text-sm text-gray-500">
                  Click "LR Key Management" to proceed
                </p>
                <button
                  onClick={handleEntitySelect}
                  disabled={!selectedEntityId}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  LR Key Management
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Billing Details */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-lg font-semibold mb-4">
                Step 2: Billing Details
              </h2>
              <button
                onClick={() => setCurrentStep(1)}
                className="text-indigo-600 hover:text-indigo-900 mb-4"
              >
                &larr; Back
              </button>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    value={billingData.username}
                    onChange={(e) =>
                      setBillingData({
                        ...billingData,
                        username: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Enter username"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Key Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={billingData.keyQuantity}
                    onChange={(e) =>
                      setBillingData({
                        ...billingData,
                        keyQuantity: parseInt(e.target.value),
                      })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Purchased Date
                    </label>
                    <input
                      type="date"
                      value={billingData.purchasedDate}
                      onChange={(e) =>
                        setBillingData({
                          ...billingData,
                          purchasedDate: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Renewal Date
                    </label>
                    <input
                      type="date"
                      value={billingData.renewalDate}
                      onChange={(e) =>
                        setBillingData({
                          ...billingData,
                          renewalDate: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount Without GST
                  </label>
                  <input
                    type="number"
                    value={billingData.amountWithoutGST}
                    onChange={(e) =>
                      setBillingData({
                        ...billingData,
                        amountWithoutGST: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Enter amount"
                  />
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="flex justify-between mb-1">
                    <span>GST (18%):</span>
                    <span>₹{gstAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Total Amount:</span>
                    <span>₹{totalAmount.toFixed(2)}</span>
                  </div>
                </div>
                <button
                  onClick={handleGenerateBill}
                  disabled={
                    !billingData.username || generateBillMutation.isPending
                  }
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Generate Invoice
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Invoice Generated Successfully!"
      >
        {generatedBill && (
          <div className="space-y-4">
            <p>
              <strong>Bill Number:</strong> {generatedBill.billNumber}
            </p>
            <p>
              <strong>Total Amount:</strong> ₹
              {generatedBill.totalAmount.toFixed(2)}
            </p>
            <div>
              <strong>Generated Keys:</strong>
              <ul className="mt-2 space-y-1">
                {generatedKeys.map((key, index) => (
                  <li
                    key={index}
                    className="font-mono text-sm bg-gray-50 px-3 py-1 rounded"
                  >
                    {key}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => handleViewPDF(generatedBill._id)}
                className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                View PDF
              </button>
              <button
                onClick={() => handleDownloadPDF(generatedBill._id)}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Download PDF
              </button>
              <button
                onClick={() => handleSendEmail(generatedBill._id)}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Send Email
              </button>
            </div>
            <button
              onClick={resetForm}
              className="w-full mt-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50"
            >
              Create Another Invoice
            </button>
          </div>
        )}
      </Modal>

      {/* Bills List */}
      <div className="bg-white rounded-lg shadow">
        <DataTable
          columns={tableColumns}
          rows={billsData?.data?.items || []}
          emptyMessage="No bills yet"
        />
        {billsData?.data?.pagination && (
          <Pagination
            pagination={billsData.data.pagination}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  );
}
