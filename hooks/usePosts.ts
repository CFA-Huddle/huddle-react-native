import { postService } from "@/api/services/postService";
import { useLocationContext } from "@/context/LocationContext";
import { Post } from "@/types/Post";
import { useQuery } from "@tanstack/react-query";

export const usePosts = () => {

  const { selectedLocation } = useLocationContext();

  return useQuery<Post[], Error>({
    queryKey: ["posts", selectedLocation],
    queryFn: () => {
      if (!selectedLocation) {
        return Promise.reject(new Error("No location selected"));
      }
      return postService.getPostsByLocationId(selectedLocation);
    },
    enabled: !!selectedLocation,
    placeholderData: (previousData) => previousData,
    refetchOnMount: true,
  });
}