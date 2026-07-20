import { useQuery } from "@tanstack/react-query";
import { getPartnerById } from "../api/superadminApi";
import { getPartnerStats } from "../api/superadminApi";

export const usePartnerDetail = (partnerId) => {
  return useQuery({
    queryKey: ["superadminPartner", partnerId],
    queryFn: async () => {
      const [detail, stats] = await Promise.all([
        getPartnerById(partnerId),
        getPartnerStats(partnerId),
      ]);
      return { ...detail.data, stats: stats.data };
    },
    enabled: !!partnerId,
  });
};
