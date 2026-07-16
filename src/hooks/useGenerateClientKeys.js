// useGenerateClientKeys.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { generateClientKeys } from "../api/superadminApi";

export const useGenerateClientKeys = (clientId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => {
      if (!clientId) {
        return Promise.reject(new Error("Client ID is required"));
      }
      return generateClientKeys(clientId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["superadminClients"] });
    },
    // Optional: skip the mutation if clientId is null
    enabled: !!clientId,
  });
};
