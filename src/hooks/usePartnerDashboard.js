
import { useQuery } from '@tanstack/react-query';
import { getPartnerDashboard } from '../api/partnerApi';

export const usePartnerDashboard = () => {
  return useQuery({
    queryKey: ['partnerDashboard'],
    queryFn: getPartnerDashboard,
  });
};

