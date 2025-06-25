import {
  createRole,
  createPermission,
  updateRole,
  updatePermission,
  getRolesHierarchy,
  getRoleActions,
} from '../repositories/roleRepository';

// Service to add a new role
export const addRoleService = async (data: { code: string; name: string; is_active: boolean }) => {
  return await createRole(data);
};

// Service to add a new permission
export const addPermissionService = async (data: { code: string; name: string; category: string }) => {
  return await createPermission(data);
};

// Service to update a role by ID
export const updateRoleService = async (id: number, data: { name?: string; is_active?: boolean }) => {
  return await updateRole(id, data);
};

// Service to update a permission by ID
export const updatePermissionService = async (id: number, data: { name?: string; category?: string }) => {
  return await updatePermission(id, data);
};

// Service to get roles hierarchy
export const getRolesHierarchyService = async () => {
  return await getRolesHierarchy();
};

// Service to get actions for a specific role
export const getRoleActionsService = async (id: number) => {
  return await getRoleActions(id);
};
