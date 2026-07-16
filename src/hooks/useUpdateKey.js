
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateKey } from '../api/superadminApi';

export const useUpdateKey = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ keyId, data }) => updateKey(keyId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allKeys'] });
    },
  });
};

