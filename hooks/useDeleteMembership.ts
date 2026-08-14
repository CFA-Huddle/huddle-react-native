import { userService } from "@/api/services/userService";
import { useLocationContext } from "@/context/LocationContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteMembership() {
  const queryClient = useQueryClient();
  const { selectedLocation } = useLocationContext();

  return useMutation({
    mutationFn: ({ userId }: { userId: string }) => {
      if (!selectedLocation) {
        throw new Error("Location not selected");
      }

      return userService.deleteUserMembership({ userId, location_id: selectedLocation });
    },
    onSuccess: () => {  
      queryClient.invalidateQueries({
        queryKey: ["locationUsers", selectedLocation],
      });
    },
  });
}
