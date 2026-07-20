import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteClient } from "../api/superadminApi";

export const useDeleteClient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (clientId) => deleteClient(clientId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["superadminClients"] });
    },
  });
};
