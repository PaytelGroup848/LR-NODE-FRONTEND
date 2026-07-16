
import { useQuery } from '@tanstack/react-query';
import { getSuperadminClients } from '../api/superadminApi';

export const useSuperadminClients = (params) => {
  return useQuery({
    queryKey: ['superadminClients', params],
    queryFn: () => getSuperadminClients(params),
  });
};

