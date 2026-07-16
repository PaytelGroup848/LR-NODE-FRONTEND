
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { assignKey } from '../api/partnerApi';

export const useAssignKey = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ keyId, clientId }) => assignKey(keyId, clientId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partnerKeys'] });
    },
  });
};

