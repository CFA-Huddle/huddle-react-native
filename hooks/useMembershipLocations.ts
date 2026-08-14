import { membershipService } from "@/api/services/membershipService";
import { useQuery } from "@tanstack/react-query";

export const membershipLocationsKey = (userID: string) => [
    "membershipLocations",
    userID,
  ];

export function useMembershipLocations(userID: string) {
    return useQuery({
      queryKey: membershipLocationsKey(userID),
      queryFn: () => membershipService.getMembershipsByUserId(userID),
      enabled: !!userID,
      staleTime: 1000 * 60 * 10, // 10 minutes
    });
  }