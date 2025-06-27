import { prisma } from '../dbConfig/prisma';

// Reverted to use the correct model name "roles" (plural)
export const getAllRoles = async () => prisma.role.findMany();
export const getRoleById = async (id: number) => prisma.role.findUnique({ where: { id } });
export const createRole = async (data: { name: string; code: string; is_active?: boolean }) => prisma.role.create({ data });
export const updateRole = async (id: number, data: { name?: string; is_active?: boolean }) => prisma.role.update({ where: { id }, data });
export const deleteRole = async (id: number) => prisma.role.delete({ where: { id } });