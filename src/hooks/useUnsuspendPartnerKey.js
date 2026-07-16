
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { unsuspendPartnerKey } from '../api/partnerApi';

export const useUnsuspendPartnerKey = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: unsuspendPartnerKey,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partnerKeys'] });
    },
  });
};

