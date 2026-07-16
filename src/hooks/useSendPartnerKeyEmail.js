
import { useMutation } from '@tanstack/react-query';
import { sendPartnerKeyEmail } from '../api/partnerApi';

export const useSendPartnerKeyEmail = () => {
  return useMutation({
    mutationFn: sendPartnerKeyEmail,
  });
};

