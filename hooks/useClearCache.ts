import { asyncStoragePersister, queryClient } from "@/queryClient";
import { useMutation } from "@tanstack/react-query";
import { Image } from "expo-image";

export function useClearCache() {
  return useMutation({
    mutationFn: async () => {
      await queryClient.cancelQueries();
      queryClient.clear();
      await asyncStoragePersister.removeClient();
      await Image.clearMemoryCache();
      await Image.clearDiskCache();
    },
  });
}
