
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { generatePartnerBulkKeys } from '../api/superadminApi';

export const useGeneratePartnerBulkKeys = (partnerId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => generatePartnerBulkKeys(partnerId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['superadminPartners'] });
    },
  });
};

