
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { suspendPartner } from '../api/superadminApi';

export const useSuspendPartner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: suspendPartner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['superadminPartners'] });
    },
  });
};

