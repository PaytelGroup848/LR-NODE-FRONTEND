
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { token, role, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    const redirectMap = {
      SUPERADMIN: '/superadmin/dashboard',
      PARTNER: '/partner/dashboard',
      SUPERADMIN_CLIENT: '/client/dashboard',
      PARTNER_CLIENT: '/client/dashboard',
    };
    return <Navigate to={redirectMap[role] || '/login'} replace />;
  }

  return children;
}

