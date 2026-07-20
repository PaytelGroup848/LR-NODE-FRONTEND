import axiosInstance from "./axiosInstance";

export const getSuperadminDashboard = async () => {
  const response = await axiosInstance.get("/superadmin/dashboard");
  return response.data;
};

export const getSuperadminClients = async (params) => {
  const response = await axiosInstance.get("/superadmin/clients", { params });
  return response.data;
};

export const createClient = async (data) => {
  const response = await axiosInstance.post("/superadmin/clients", data);
  return response.data;
};

export const generateClientKeys = async (clientId, data) => {
  const response = await axiosInstance.post(
    `/superadmin/clients/${clientId}/keys/generate`,
    data,
  );
  return response.data;
};

export const suspendClient = async (clientId) => {
  const response = await axiosInstance.patch(
    `/superadmin/clients/${clientId}/suspend`,
  );
  return response.data;
};

export const unsuspendClient = async (clientId) => {
  const response = await axiosInstance.patch(
    `/superadmin/clients/${clientId}/unsuspend`,
  );
  return response.data;
};

export const sendKeyEmail = async (keyId) => {
  const response = await axiosInstance.post(
    `/superadmin/keys/${keyId}/send-email`,
  );
  return response.data;
};

export const getSuperadminPartners = async (params) => {
  const response = await axiosInstance.get("/superadmin/partners", { params });
  return response.data;
};

export const createPartner = async (data) => {
  const response = await axiosInstance.post("/superadmin/partners", data);
  return response.data;
};

export const getPartnerStats = async (partnerId) => {
  const response = await axiosInstance.get(
    `/superadmin/partners/${partnerId}/stats`,
  );
  return response.data;
};

export const generatePartnerBulkKeys = async (partnerId, data) => {
  const response = await axiosInstance.post(
    `/superadmin/partners/${partnerId}/keys/generate-bulk`,
    data,
  );
  return response.data;
};

export const sendBulkKeysEmail = async (partnerId, batchId) => {
  const response = await axiosInstance.post(
    `/superadmin/partners/${partnerId}/keys/send-email`,
    { batchId },
  );
  return response.data;
};

export const suspendPartner = async (partnerId) => {
  const response = await axiosInstance.patch(
    `/superadmin/partners/${partnerId}/suspend`,
  );
  return response.data;
};

export const unsuspendPartner = async (partnerId) => {
  const response = await axiosInstance.patch(
    `/superadmin/partners/${partnerId}/unsuspend`,
  );
  return response.data;
};

export const getAllKeys = async (params) => {
  const response = await axiosInstance.get("/superadmin/keys", { params });
  return response.data;
};

export const updateKey = async (keyId, data) => {
  const response = await axiosInstance.patch(`/superadmin/keys/${keyId}`, data);
  return response.data;
};

export const suspendKey = async (keyId) => {
  const response = await axiosInstance.patch(
    `/superadmin/keys/${keyId}/suspend`,
  );
  return response.data;
};

export const unsuspendKey = async (keyId) => {
  const response = await axiosInstance.patch(
    `/superadmin/keys/${keyId}/unsuspend`,
  );
  return response.data;
};

export const generateBill = async (data) => {
  const response = await axiosInstance.post(
    "/superadmin/billing/generate",
    data,
  );
  return response.data;
};

export const getBills = async (params) => {
  const response = await axiosInstance.get("/superadmin/billing", { params });
  return response.data;
};

export const getBill = async (billId) => {
  const response = await axiosInstance.get(`/superadmin/billing/${billId}`);
  return response.data;
};

export const sendBillEmail = async (billId) => {
  const response = await axiosInstance.post(
    `/superadmin/billing/${billId}/send-email`,
  );
  return response.data;
};

export const getClientById = async (clientId) => {
  const response = await axiosInstance.get(`/superadmin/clients/${clientId}`);
  return response.data;
};

export const updateClient = async (clientId, data) => {
  const response = await axiosInstance.patch(
    `/superadmin/clients/${clientId}`,
    data,
  );
  return response.data;
};

export const deleteClient = async (clientId) => {
  const response = await axiosInstance.delete(
    `/superadmin/clients/${clientId}`,
  );
  return response.data;
};

export const getPartnerById = async (partnerId) => {
  const response = await axiosInstance.get(`/superadmin/partners/${partnerId}`);
  return response.data;
};

export const updatePartner = async (partnerId, data) => {
  const response = await axiosInstance.patch(
    `/superadmin/partners/${partnerId}`,
    data,
  );
  return response.data;
};