import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateClient } from "../api/superadminApi";

export const useUpdateClient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ clientId, data }) => updateClient(clientId, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["superadminClients"] });
      queryClient.invalidateQueries({
        queryKey: ["superadminClient", variables.clientId],
      });
    },
  });
};
