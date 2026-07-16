
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPartner } from '../api/superadminApi';

export const useCreatePartner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPartner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['superadminPartners'] });
    },
  });
};

