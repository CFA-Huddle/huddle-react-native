import { moduleService } from "@/api/services/moduleService";
import { useLocationContext } from "@/context/LocationContext";
import { CreateModuleRequest } from "@/types/Modules";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateModule() {
  const queryClient = useQueryClient();
  const { selectedLocation } = useLocationContext();

  return useMutation({
    mutationFn: (payload: CreateModuleRequest) => {
      if (!selectedLocation) {
        return Promise.reject(new Error("No location selected"));
      }
      return moduleService.createModule(selectedLocation, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["training-modules"],
      });
    },
  });
}
