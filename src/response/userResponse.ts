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
