import { Role, UserMembership } from "@/types/Membership";

export interface GetUsersByLocationId {
  location_id: string;
  users: User[];
}

export interface UpdateUserRequest {
  first_name?: string;
  last_name?: string;
  email?: string;
  picture_url?: string;
}

export interface UploadProfilePictureRequest {
  base64: string;
  extension: string;
}

export interface UpdateProfilePictureResponse {
  picture_url: string;
}

export interface InviteUserRequest {
  email: string;
  first_name: string;
  last_name: string;
  memberships: UserMembership[];
}

export interface UpdateUserRoleRequest {
  roles: Role[];
}

export interface LocationUser {
  user?: User;
  userId?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  roles?: Role[];
  membership?: UserMembership;
  locationIds: string[];
}

export interface User {
  id: string;
  avatar_url: string | null;
  email: string;
  first_name: string;
  last_name: string;
  memberships: UserMembership[];
  created_at: string;
  updated_at: string;
  is_active: boolean;
  is_confirmed: boolean;
}
