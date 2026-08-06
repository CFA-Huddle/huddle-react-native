export enum Role {
  TEAM_MEMBER = "TEAM_MEMBER",
  TEAM_LEADER = "TEAM_LEADER",
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
};

export const RolePriority: Record<Role, number> = {
  [Role.ADMIN]: 5,
  [Role.DIRECTOR]: 4,
  [Role.TEAM_LEADER]: 3,
  [Role.OPERATOR]: 2,
  [Role.TEAM_MEMBER]: 1,
};

export interface UserMembership {
  location_id: string;
  roles: Role[];
}

export interface GetMembershipsByUserId {
  memberships: UserMembership[];
}

export interface UserMembershipResponse {
  user_id: string;
  memberships: UserMembership[];
}