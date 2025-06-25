// User Request Types
export interface GetUsersRequest {
  role?: string;
}

/**
 * Represents a User entity in the database
 */
export interface User {
  id: string;
  username: string;
  officeName: string;
  email?: string;
  phoneNo?: string;
  password: string;
  roleId: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Represents a Permission in the system
 */
export interface Permission {
  id: number;
  code: string;
  name: string;
  category: string;
  created_at: Date;
  updated_at: Date;
}

/**
 * Represents a RolePermission relationship
 */
export interface RolePermission {
  id: number;
  role_id: number;
  permission_id: number;
  created_at: Date;
  updated_at: Date;
  permission: Permission;
}

/**
 * Represents a Role with permissions
 */
export interface Role {
  id: number;
  code: string;
  name: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  rolePermissions: RolePermission[];
}

/**
 * Represents a User with role and permissions
 */
export interface UserWithRoleAndPermissions extends User {
  role: Role;
}
