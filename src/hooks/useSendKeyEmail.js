
import { useMutation } from '@tanstack/react-query';
import { sendKeyEmail } from '../api/superadminApi';

export const useSendKeyEmail = () => {
  return useMutation({
    mutationFn: sendKeyEmail,
  });
};

