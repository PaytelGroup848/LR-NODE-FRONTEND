
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { suspendClient } from '../api/superadminApi';

export const useSuspendClient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: suspendClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['superadminClients'] });
    },
  });
};

