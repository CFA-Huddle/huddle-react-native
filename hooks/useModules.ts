import { moduleService } from "@/api/services/moduleService";
import { useLocationContext } from "@/context/LocationContext";
import { Module } from "@/types/Modules";
import { useQuery } from "@tanstack/react-query";

export const useModules = () => {
  const { selectedLocation } = useLocationContext();

  return useQuery<Module[], Error>({
    queryKey: ["training-modules", selectedLocation],
    queryFn: () => {
      if (!selectedLocation) {
        return Promise.reject(new Error("No location selected"));
      }
      return moduleService.getModulesByLocationId(selectedLocation);
    },
    enabled: !!selectedLocation,
    placeholderData: (previousData) => previousData,
    refetchOnMount: true,
  });
};

export const useModule = (moduleId?: string) => {
  const query = useModules();
  const module = query.data?.find((item) => item.id === moduleId);

  return {
    ...query,
    data: module,
  };
};
