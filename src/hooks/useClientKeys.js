
import { useQuery } from '@tanstack/react-query';
import { getClientKeys } from '../api/clientApi';

export const useClientKeys = () => {
  return useQuery({
    queryKey: ['clientKeys'],
    queryFn: getClientKeys,
  });
};

