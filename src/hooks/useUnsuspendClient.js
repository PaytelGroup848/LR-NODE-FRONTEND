
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { unsuspendClient } from '../api/superadminApi';

export const useUnsuspendClient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: unsuspendClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['superadminClients'] });
    },
  });
};

