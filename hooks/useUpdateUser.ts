import { authService } from "@/api/services/authService";
import { userService } from "@/api/services/userService";
import { useAuthContext } from "@/context/AuthContext";
import { useLocationContext } from "@/context/LocationContext";
import { queryClient } from "@/queryClient";
import { Role } from "@/types/Membership";
import { useMutation } from "@tanstack/react-query";

type UserInformationFormValues = {
  isOwner: boolean;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture: { base64: string; extension: string } | undefined;
  role: Role | undefined;
};

export function useUpdateUser() {
  const { setUser } = useAuthContext();
  const { selectedLocation } = useLocationContext();  
  return useMutation({
    mutationFn: ({ isOwner, userId, firstName, lastName, email, profilePicture, role }: UserInformationFormValues) => {
      if(!selectedLocation) {
        throw new Error("Location not selected");
      }
      return Promise.all(
        [
          userService.updateUser(isOwner, userId, { first_name: firstName.trim(), last_name: lastName.trim(), email: email.trim() }, profilePicture),
          ...(role ? [userService.updateUserRole(userId, selectedLocation, { roles: [role] })] : []),
        ]
      );
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: ["locationUsers", selectedLocation],
      });
      const attributes = await authService.fetchUserAttributes();
      if (attributes) {
        setUser(attributes);
      }
    },
  });
}
