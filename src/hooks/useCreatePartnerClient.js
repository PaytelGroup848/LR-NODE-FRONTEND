
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPartnerClient } from '../api/partnerApi';

export const useCreatePartnerClient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPartnerClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partnerClients'] });
    },
  });
};

