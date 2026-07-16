
import { useQuery } from '@tanstack/react-query';
import { getPartnerKeys } from '../api/partnerApi';

export const usePartnerKeys = (params) => {
  return useQuery({
    queryKey: ['partnerKeys', params],
    queryFn: () => getPartnerKeys(params),
  });
};

