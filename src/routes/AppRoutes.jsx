
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import DashboardLayout from '../layouts/DashboardLayout';
import LoginPage from '../pages/LoginPage';
import SuperadminDashboard from '../pages/superadmin/Dashboard';
import SuperadminClients from '../pages/superadmin/Clients';
import SuperadminPartners from '../pages/superadmin/Partners';
import SuperadminKeys from '../pages/superadmin/Keys';
import SuperadminBilling from '../pages/superadmin/Billing';
import PartnerDashboard from '../pages/partner/Dashboard';
import PartnerClients from '../pages/partner/Clients';
import PartnerKeys from '../pages/partner/Keys';
import ClientDashboard from '../pages/client/Dashboard';
import ClientKeys from '../pages/client/Keys';

export default function AppRoutes() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          <Route path="/superadmin" element={
            <ProtectedRoute allowedRoles={['SUPERADMIN']}>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/superadmin/dashboard" replace />} />
            <Route path="dashboard" element={<SuperadminDashboard />} />
            <Route path="clients" element={<SuperadminClients />} />
            <Route path="partners" element={<SuperadminPartners />} />
            <Route path="keys" element={<SuperadminKeys />} />
            <Route path="billing" element={<SuperadminBilling />} />
          </Route>

          <Route path="/partner" element={
            <ProtectedRoute allowedRoles={['PARTNER']}>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/partner/dashboard" replace />} />
            <Route path="dashboard" element={<PartnerDashboard />} />
            <Route path="clients" element={<PartnerClients />} />
            <Route path="keys" element={<PartnerKeys />} />
          </Route>

          <Route path="/client" element={
            <ProtectedRoute allowedRoles={['SUPERADMIN_CLIENT', 'PARTNER_CLIENT']}>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/client/dashboard" replace />} />
            <Route path="dashboard" element={<ClientDashboard />} />
            <Route path="keys" element={<ClientKeys />} />
          </Route>

          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

