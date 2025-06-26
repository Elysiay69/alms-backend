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

export const getUsers = async (event: any) => {
  try {
    // Always retrieve all users with their role data
    const usersData = await getAllUsersService(true); // true to include role data
    
    const result = toUserListResponse(usersData);
    
    // Return the response in a format API Gateway expects
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // CORS header
      },
      body:  result,
    };
  } catch (error) {
    console.error('Get Users Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error.' }),
    };
  }
};

export const createUser = async (event: any) => {
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
      roleId: body.roleId
    });
    return {
      statusCode: 201,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // CORS header
      },
      body: JSON.stringify({ data: toUserResponse(user) }),
    };
  } catch (error: any) {
    console.error('Create User Error:', error);
    
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

export const getUserById = async (event: any) => {
  try {
    const id = event.query;
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
    
    const user = await getUserByIdService(id);
    if (!user) {
      return { 
        statusCode: 404, 
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*', // CORS header
        },
        body: JSON.stringify({ message: 'User not found.' }) 
      };
    }
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // CORS header
      },
      body: JSON.stringify({ data: toUserResponse(user) }),
    };
  } catch (error) {
    console.error('Get User By ID Error:', error);
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
