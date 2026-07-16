
import axiosInstance from './axiosInstance';

export const getPartnerDashboard = async () => {
  const response = await axiosInstance.get('/partner/dashboard');
  return response.data;
};

export const getPartnerClients = async (params) => {
  const response = await axiosInstance.get('/partner/clients', { params });
  return response.data;
};

export const createPartnerClient = async (data) => {
  const response = await axiosInstance.post('/partner/clients', data);
  return response.data;
};

export const getPartnerKeys = async (params) => {
  const response = await axiosInstance.get('/partner/keys', { params });
  return response.data;
};

export const assignKey = async (keyId, clientId) => {
  const response = await axiosInstance.patch(`/partner/keys/${keyId}/assign`, { clientId });
  return response.data;
};

export const suspendPartnerKey = async (keyId) => {
  const response = await axiosInstance.patch(`/partner/keys/${keyId}/suspend`);
  return response.data;
};

export const unsuspendPartnerKey = async (keyId) => {
  const response = await axiosInstance.patch(`/partner/keys/${keyId}/unsuspend`);
  return response.data;
};

export const sendPartnerKeyEmail = async (keyId) => {
  const response = await axiosInstance.post(`/partner/keys/${keyId}/send-email`);
  return response.data;
};

