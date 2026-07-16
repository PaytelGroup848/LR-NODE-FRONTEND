
import { useQuery } from '@tanstack/react-query';
import { getClientDashboard } from '../api/clientApi';

export const useClientDashboard = () => {
  return useQuery({
    queryKey: ['clientDashboard'],
    queryFn: getClientDashboard,
  });
};

