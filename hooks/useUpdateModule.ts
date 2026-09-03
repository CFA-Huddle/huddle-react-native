import { moduleService } from "@/api/services/moduleService";
import { useLocationContext } from "@/context/LocationContext";
import { UpdateModuleRequest } from "@/types/Modules";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type UpdateModuleParams = {
  moduleId: string;
  payload: UpdateModuleRequest;
};

export function useUpdateModule() {
  const queryClient = useQueryClient();
  const { selectedLocation } = useLocationContext();

  return useMutation({
    mutationFn: ({ moduleId, payload }: UpdateModuleParams) => {
      if (!selectedLocation) {
        return Promise.reject(new Error("No location selected"));
      }
      return moduleService.updateModule(selectedLocation, moduleId, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["training-modules"],
      });
    },
  });
}
