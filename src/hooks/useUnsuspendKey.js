
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { unsuspendKey } from '../api/superadminApi';

export const useUnsuspendKey = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: unsuspendKey,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allKeys'] });
    },
  });
};

