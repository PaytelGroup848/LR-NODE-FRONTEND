
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { unsuspendPartner } from '../api/superadminApi';

export const useUnsuspendPartner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: unsuspendPartner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['superadminPartners'] });
    },
  });
};

