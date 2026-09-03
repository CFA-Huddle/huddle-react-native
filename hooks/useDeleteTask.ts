import { moduleService } from "@/api/services/moduleService";
import { useLocationContext } from "@/context/LocationContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type DeleteTaskParams = {
  moduleId: string;
  taskId: string;
};

export function useDeleteTask() {
  const queryClient = useQueryClient();
  const { selectedLocation } = useLocationContext();

  return useMutation({
    mutationFn: ({ moduleId, taskId }: DeleteTaskParams) => {
      if (!selectedLocation) {
        return Promise.reject(new Error("No location selected"));
      }
      return moduleService.deleteTask(selectedLocation, moduleId, taskId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["training-modules"],
      });
    },
  });
}
