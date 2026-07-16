
import { useQuery } from '@tanstack/react-query';
import { getPartnerClients } from '../api/partnerApi';

export const usePartnerClients = (params) => {
  return useQuery({
    queryKey: ['partnerClients', params],
    queryFn: () => getPartnerClients(params),
  });
};

