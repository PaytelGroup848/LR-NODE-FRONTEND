
import { useQuery } from '@tanstack/react-query';
import { getSuperadminDashboard } from '../api/superadminApi';

export const useSuperadminDashboard = () => {
  return useQuery({
    queryKey: ['superadminDashboard'],
    queryFn: getSuperadminDashboard,
  });
};

