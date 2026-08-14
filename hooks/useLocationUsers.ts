import { userService } from "@/api/services/userService";
import { useLocationContext } from "@/context/LocationContext";
import { useQuery } from "@tanstack/react-query";


export function useLocationUsers() {
  const { selectedLocation } = useLocationContext();

  return useQuery({
    queryKey: ["locationUsers", selectedLocation],
    queryFn: () => {
      if (!selectedLocation) {
        return Promise.reject(new Error("No location selected"));
      }
      return userService.getUsersByLocationId(selectedLocation);
    },
    enabled: !!selectedLocation,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

export function useLocationUser(userId?: string) {
  const { selectedLocation } = useLocationContext();
  const { data, isPending } = useLocationUsers();

  const user = data?.find((u) => u.id === userId);

  const membership = user?.memberships.find(
    (m) => m.location_id === selectedLocation,
  );
  const locationIds = user?.memberships.map((m) => m.location_id) ?? [];

  return {
    user,
    membership,
    locationIds,
    isLoading: isPending,
  };
}
