import { moduleService } from "@/api/services/moduleService";
import { useLocationContext } from "@/context/LocationContext";
import { CreateTaskRequest } from "@/types/Modules";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type CreateTaskParams = {
  moduleId: string;
  payload: CreateTaskRequest;
};

export function useCreateTask() {
  const queryClient = useQueryClient();
  const { selectedLocation } = useLocationContext();

  return useMutation({
    mutationFn: ({ moduleId, payload }: CreateTaskParams) => {
      if (!selectedLocation) {
        return Promise.reject(new Error("No location selected"));
      }
      return moduleService.createTask(selectedLocation, moduleId, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["training-modules"],
      });
    },
  });
}
