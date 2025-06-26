import { 
  getAllUsers, 
  getUserById, 
  createUser, 
  updateUser, 
  deleteUser, 
  getUsersByRole 
} from '../repositories/user';

// Service to get all users
export const getAllUsersService = async (includeRole: boolean = false) => {
  return await getAllUsers(includeRole);
};

// Service to get users by role
export const getUsersByRoleService = async (roleName: string) => {
  return await getUsersByRole(roleName);
};

// Service to get user by ID
export const getUserByIdService = async (id: string) => {
  return await getUserById(id);
};

// Service to create a new user
export const createUserService = async (userData: {
  username: string;
  officeName: string;
  email?: string;
  phoneNo?: string;
  password: string;
  roleId: number;
}) => {
  return await createUser(userData);
};

// Service to update a user
export const updateUserService = async (id: string, userData: any) => {
  return await updateUser(id, userData);
};

// Service to delete a user
export const deleteUserService = async (id: string) => {
  return await deleteUser(id);
};
