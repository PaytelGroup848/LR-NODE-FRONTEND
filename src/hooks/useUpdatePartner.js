import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePartner } from "../api/superadminApi";

export const useUpdatePartner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ partnerId, data }) => updatePartner(partnerId, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["superadminPartners"] });
      queryClient.invalidateQueries({
        queryKey: ["superadminPartner", variables.partnerId],
      });
    },
  });
};
