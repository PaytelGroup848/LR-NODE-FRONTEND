
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { suspendPartnerKey } from '../api/partnerApi';

export const useSuspendPartnerKey = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: suspendPartnerKey,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partnerKeys'] });
    },
  });
};

