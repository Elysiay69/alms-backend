import { prisma } from '../dbConfig/prisma';
import { toUserResponse, toUserListResponse } from '../response/userResponse';
import { 
  getAllUsersService, 
  getUsersByRoleService, 
  getUserByIdService, 
  createUserService, 
  updateUserService, 
  deleteUserService 
} from '../services/userService';
import * as bcrypt from 'bcryptjs';
import { ApiResponse, UserResponse, UserListItemResponse, Nullable } from '../utils/types';

function createApiResponse<T>(success: boolean, data: T | null = null, message?: string): ApiResponse<T> {
  return {
    success,
    data: data || undefined,
    message,
  };
}

export const getUsers = async (event: any): Promise<ApiResponse<UserListItemResponse[]>> => {
  try {
    // Always retrieve all users with their role data
    const usersData = await getAllUsersService(true); // true to include role data
    
    const result = toUserListResponse(usersData);
    
    return createApiResponse(true, result);
  } catch (error) {
    console.error('Get Users Error:', error);
    return createApiResponse(false, null as unknown as UserListItemResponse[], 'Internal server error.');
  }
};

export const createUser = async (event: any): Promise<ApiResponse<UserResponse>> => {
  try {
    // Parse the request body if it's a string
    const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    
    // Hash password
    const hashedPassword = await bcrypt.hash(body.password, 10);
    const user = await createUserService({
      username: body.username,
      officeName: body.officeName,
      email: body.email,
      phoneNo: body.phoneNo,
      password: hashedPassword,
      roleId: body.roleId,
    });
    return createApiResponse(true, toUserResponse(user));
  } catch (error) {
    console.error('Create User Error:', error);
    return createApiResponse(false, null as Nullable<UserResponse>, 'Internal server error.');
  }
};

export const getUserById = async (event: any): Promise<ApiResponse<UserResponse>> => {
  try {
    const id = event.query;
    if (!id) {
      return createApiResponse(false, null as Nullable<UserResponse>, 'Missing path parameter: id');
    }
    
    const user = await getUserByIdService(id);
    if (!user) {
      return createApiResponse(false, null as Nullable<UserResponse>, 'User not found.');
    }
    
    return createApiResponse(true, toUserResponse(user));
  } catch (error) {
    console.error('Get User By ID Error:', error);
    return createApiResponse(false, null as Nullable<UserResponse>, 'Internal server error.');
  }
};

export const updateUserById = async (event: any) => {
  try {
    // Check if pathParameters exists
    // if (!event.pathParameters) {
    //   return { 
    //     statusCode: 400, 
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Access-Control-Allow-Origin': '*', // CORS header
    //     },
    //     body: JSON.stringify({ message: 'Missing path parameter: id' }) 
    //   };
    // }
    
    const id = event.query;
    // if (!id) {
    //   return { 
    //     statusCode: 400, 
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Access-Control-Allow-Origin': '*', // CORS header
    //     },
    //     body: JSON.stringify({ message: 'Missing path parameter: id' }) 
    //   };
    // }
    
    const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    
    if (body.password) {
      body.password = await bcrypt.hash(body.password, 10);
    }
    const user = await updateUserService(id, body);
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // CORS header
      },
      body: JSON.stringify({ data: toUserResponse(user) }),
    };
  } catch (error) {
    console.error('Update User Error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // CORS header
      },
      body: JSON.stringify({ message: 'Internal server error.' }),
    };
  }
};

export const deleteUserById = async (event: any) => {
  try {
    // Check if pathParameters exists
    if (!event.pathParameters) {
      return { 
        statusCode: 400, 
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*', // CORS header
        },
        body: JSON.stringify({ message: 'Missing path parameter: id' }) 
      };
    }
    
    const id = event.pathParameters.id;
    if (!id) {
      return { 
        statusCode: 400, 
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*', // CORS header
        },
        body: JSON.stringify({ message: 'Missing path parameter: id' }) 
      };
    }
    
    await deleteUserService(id);
    return {
      statusCode: 204,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // CORS header
      },
      body: '',
    };
  } catch (error) {
    console.error('Delete User Error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // CORS header
      },
      body: JSON.stringify({ message: 'Internal server error.' }),
    };
  }
};
