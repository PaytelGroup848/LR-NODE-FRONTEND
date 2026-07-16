
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '../api/superadminApi';

export const useCreateClient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['superadminClients'] });
    },
  });
};

