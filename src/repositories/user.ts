import { prisma } from '../dbConfig/prisma';
import { Prisma, User } from '@prisma/client';

// Define a type for user with role and permissions
type UserWithRoleAndPermissions = User & {
  role: {
    id: number;
    code: string;
    name: string;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
    rolePermissions: {
      id: number;
      role_id: number;
      permission_id: number;
      created_at: Date;
      updated_at: Date;
      permission: {
        id: number;
        code: string;
        name: string;
        category: string;
        created_at: Date;
        updated_at: Date;
      };
    }[];
  };
};

export const getAllUsers = async (includeRole: boolean = false): Promise<User[]> => {
  return prisma.user.findMany({
    include: includeRole ? { role: true } : undefined
  });
};

export const getUsersByRole = async (roleName: string): Promise<User[]> => {
  return prisma.user.findMany({
    where: { role: { name: roleName } },
    include: { role: true }
  });
};

export const getUserById = async (id: string): Promise<User | null> => prisma.user.findUnique({ where: { id } });
export const updateUser = async (id: string, data: any): Promise<User> => prisma.user.update({ where: { id }, data });
export const deleteUser = async (id: string): Promise<User> => prisma.user.delete({ where: { id } });
export const findUserByUsername = async (username: string): Promise<User | null> => {
  // Ensure username is properly passed
  if (!username) {
    throw new Error('Username is required for findUserByUsername');
  }
  return prisma.user.findUnique({ 
    where: { 
      username: username  // Explicitly use the property name
    } 
  });
};

/**
 * Get user with role and permissions by ID
 * @param {string} id - User ID
 * @returns {Promise<UserWithRoleAndPermissions|null>} User with role and permissions
 */
export const getUserWithRoleAndPermissions = async (id: string): Promise<UserWithRoleAndPermissions|null> => {
  try {
    if (!id) {
      throw new Error('User ID is required for getUserWithRoleAndPermissions');
    }
    return prisma.user.findUnique({
      where: { id },
      // include: {
      //   role: {
      //     include: {
      //       rolePermissions: {
      //         include: {
      //           permission: true
      //         }
      //       }
      //     }
      //   }
      // }
    }) as Promise<UserWithRoleAndPermissions|null>;

  } catch (error) {
    console.error('Error in getUserWithRoleAndPermissions:', error);
    throw new Error('Failed to fetch user with role and permissions');
    
  }
};

export const createUser = async (data: {
  username: string;
  officeName: string;
  email?: string;
  phoneNo?: string;
  password: string;
  roleId: number;
}): Promise<User> => {
  return prisma.user.create({
    data: {
      username: data.username,
      officeName: data.officeName,
      email: data.email,
      phoneNo: data.phoneNo,
      password: data.password,
      roleId: data.roleId
    }
  });
};