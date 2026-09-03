import { moduleService } from "@/api/services/moduleService";
import { useLocationContext } from "@/context/LocationContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteModule() {
  const queryClient = useQueryClient();
  const { selectedLocation } = useLocationContext();

  return useMutation({
    mutationFn: (moduleId: string) => {
      if (!selectedLocation) {
        return Promise.reject(new Error("No location selected"));
      }
      return moduleService.deleteModule(selectedLocation, moduleId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["training-modules"],
      });
    },
  });
}
