
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { suspendKey } from '../api/superadminApi';

export const useSuspendKey = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: suspendKey,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allKeys'] });
    },
  });
};

