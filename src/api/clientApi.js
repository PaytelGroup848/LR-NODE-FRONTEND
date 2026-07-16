
import axiosInstance from './axiosInstance';

export const getClientDashboard = async () => {
  const response = await axiosInstance.get('/license-client/dashboard');
  return response.data;
};

export const getClientKeys = async () => {
  const response = await axiosInstance.get('/license-client/keys');
  return response.data;
};

