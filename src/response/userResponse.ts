import { User } from '@prisma/client';

/**
 * Response format for user data - excludes sensitive information
 */
export interface UserResponse {
  id: string;
  username: string;
  officeName: string;
  email?: string;
  phoneNo?: string;
  roleId: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Response format for user list data
 */
export interface UserListItemResponse {
  id: string;
  username: string;
  email?: string;
  role: string;
}

/**
 * Converts a User entity to a safe UserResponse object
 */
export const toUserResponse = (user: User): UserResponse => ({
  id: user.id,
  username: user.username,
  officeName: user.officeName,
  email: user.email ?? undefined,
  phoneNo: user.phoneNo ?? undefined,
  roleId: user.roleId,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt
});

/**
 * Converts an array of users (with roles) to a UserListItemResponse array
 * @param users Array of users with optional role information
 */
export const toUserListResponse = (users: any[]): UserListItemResponse[] => {
  return users.map(user => ({
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role?.name || user.roleId,
  }));
};
