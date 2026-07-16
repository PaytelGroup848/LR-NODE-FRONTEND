
import { useQuery } from '@tanstack/react-query';
import { getAllKeys } from '../api/superadminApi';

export const useGetAllKeys = (params) => {
  return useQuery({
    queryKey: ['allKeys', params],
    queryFn: () => getAllKeys(params),
  });
};

