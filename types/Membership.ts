export enum Role {
  TEAM_MEMBER = "TEAM_MEMBER",
  TEAM_LEADER = "TEAM_LEADER",
  TRAINER = "TRAINER",
  DIRECTOR = "DIRECTOR",
  OPERATOR = "OPERATOR",
  ADMIN = "ADMIN",
}

export const RoleLabels: Record<Role, string> = {
  [Role.TEAM_MEMBER]: "Team Member",
  [Role.TEAM_LEADER]: "Team Leader",
  [Role.DIRECTOR]: "Director",
  [Role.OPERATOR]: "Operator",
  [Role.ADMIN]: "Admin",
  [Role.TRAINER]: "Trainer",
};

export const RolePriority: Record<Role, number> = {
  [Role.ADMIN]: 6,
  [Role.OPERATOR]: 5,
  [Role.DIRECTOR]: 4,
  [Role.TEAM_LEADER]: 3,
  [Role.TRAINER]: 2,
  [Role.TEAM_MEMBER]: 1,
};

export const AuthorizedRoles = [Role.DIRECTOR, Role.OPERATOR];

export const HiddenRoles = [Role.ADMIN, Role.OPERATOR];

export interface UserMembership {
  location_id: string;
  roles: Role[];
}

export interface DeleteMembershipRequest {
  userId: string;
  location_id: string;
}

export interface GetMembershipsByUserId {
  memberships: UserMembership[];
}

export interface UserMembershipResponse {
  user_id: string;
  memberships: UserMembership[];
}