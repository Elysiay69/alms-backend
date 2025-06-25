import { prisma } from '../dbConfig/prisma';

// Add a new role
export const createRole = async (data: { code: string; name: string; is_active: boolean }) => {
  return prisma.role.create({ data });
};

// Add a new permission
export const createPermission = async (data: { code: string; name: string; category: string }) => {
  return prisma.permission.create({ data });
};

// Update a role by ID
export const updateRole = async (id: number, data: { name?: string; is_active?: boolean }) => {
  return prisma.role.update({ where: { id }, data });
};

// Update a permission by ID
export const updatePermission = async (id: number, data: { name?: string; category?: string }) => {
  return prisma.permission.update({ where: { id }, data });
};

// Get all roles in hierarchical order
export const getRolesHierarchy = async () => {
  return prisma.role.findMany({ orderBy: { name: 'asc' } });
};

// Get actions for a specific role
export const getRoleActions = async (id: number) => {
  return prisma.role.findUnique({
    where: { id },
    include: {
      rolePermissions: {
        include: {
          permission: true,
        },
      },
    },
  });
};
