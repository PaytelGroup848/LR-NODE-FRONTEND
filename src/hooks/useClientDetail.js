import { useQuery } from "@tanstack/react-query";
import { getClientById } from "../api/superadminApi";

export const useClientDetail = (clientId) => {
  return useQuery({
    queryKey: ["superadminClient", clientId],
    queryFn: () => getClientById(clientId),
    enabled: !!clientId,
  });
};
