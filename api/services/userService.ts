import apiClient from "@/api/client";
import { authService } from "@/api/services/authService";
import { DeleteMembershipRequest } from "@/types/Membership";
import { GetUsersByLocationId, InviteUserRequest, UpdateProfilePictureResponse, UpdateUserRequest, UpdateUserRoleRequest, UploadProfilePictureRequest, User } from "@/types/User";

export const userService = {
    getUsersByLocationId: async (locationId: string): Promise<User[]> => {
        const response = await apiClient.get<GetUsersByLocationId>(
            `/locations/${locationId}/users`,
        );
        return response.data.users;
    },
    updateUser: async (
        isOwner: boolean = true, 
        userId: string, 
        profileInfo: UpdateUserRequest, 
        profilePicture?: UploadProfilePictureRequest
    ): Promise<void> => {
        let pictureUrl: string | undefined = profileInfo.picture_url;

        // If a profile picture is provided, upload it to the API and update the picture_url
        if (profilePicture) {
            const response = await apiClient.post<UpdateProfilePictureResponse>(
                `/users/${userId}/profile-picture`,
                 profilePicture
            );
            pictureUrl = response.data.picture_url;
        }

        // If the user is the owner, update the user attributes in the auth service otherwise update the user via the API
        if (isOwner) {
            await authService.updateUserAttributes(
                profileInfo.first_name,
                profileInfo.last_name,
                profileInfo.email,
                pictureUrl
            );
        } else {
            if (profilePicture && pictureUrl) {
                profileInfo.picture_url = pictureUrl;
            }
            await apiClient.patch(`/users/${userId}`, profileInfo);
        }

    },
    updateUserRole: async (userId: string, location_id: string, payload: UpdateUserRoleRequest): Promise<void> => {
        await apiClient.put(`/locations/${location_id}/memberships/${userId}`, payload);
    },
    deleteUserMembership: async ({ userId, location_id }: DeleteMembershipRequest): Promise<void> => {
        await apiClient.delete(`/locations/${location_id}/memberships/${userId}`);
    },
    inviteUser: async (payload: InviteUserRequest): Promise<void> => {
        await apiClient.post(`/users/invite`, payload);
    },
};