
import { useQuery } from '@tanstack/react-query';
import { getPartnerStats } from '../api/superadminApi';

export const usePartnerStats = (partnerId) => {
  return useQuery({
    queryKey: ['partnerStats', partnerId],
    queryFn: () => getPartnerStats(partnerId),
    enabled: !!partnerId,
  });
};

