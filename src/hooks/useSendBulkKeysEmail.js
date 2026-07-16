
import { useMutation } from '@tanstack/react-query';
import { sendBulkKeysEmail } from '../api/superadminApi';

export const useSendBulkKeysEmail = () => {
  return useMutation({
    mutationFn: sendBulkKeysEmail,
  });
};

