
import { useQuery } from '@tanstack/react-query';
import { getSuperadminPartners } from '../api/superadminApi';

export const useSuperadminPartners = (params) => {
  return useQuery({
    queryKey: ['superadminPartners', params],
    queryFn: () => getSuperadminPartners(params),
  });
};

