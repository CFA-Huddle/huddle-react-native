import apiClient from "@/api/client";
import { UserMembership, UserMembershipResponse } from "@/types/Membership";

export const membershipService = {
  getMembershipsByUserId: async (userId: string): Promise<UserMembership[]> => {
    const response = await apiClient.get<UserMembershipResponse>(
      `/users/${userId}/memberships`,
    );
    return response.data.memberships;
  },
};