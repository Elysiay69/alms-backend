import { prisma } from '../dbConfig/prisma';
import { createUser as repoCreateUser, getUserById as repoGetUserById, updateUser as repoUpdateUser, deleteUser as repoDeleteUser } from '../repositories/user';
import { toUserResponse } from '../response/userResponse';
import * as bcrypt from 'bcryptjs';

export const getUsers = async (event: any) => {
  try {
    const role = event.queryStringParameters?.role;
    let usersData;    if (role) {
      usersData = await prisma.user.findMany({
        where: { role: { name: role } },
        include: { role: true },
      });
    } else {
      usersData = await prisma.user.findMany({ include: { role: true } });
    }
    // Format response
    interface Role {
      id: string;
      name: string;
    }

    interface User {
      id: string;
      username: string;
      email: string;
      roleId: string;
      role?: Role | null;
    }

    interface UserResult {
      id: string;
      username: string;
      email: string;
      role: string;
    }

    const result: UserResult[] = usersData.map((u: any) => ({
      id: u.id,
      username: u.username,
      email: u.email,
      role: u.role?.name || u.roleId,
    }));
    return {
      statusCode: 200,
      body: JSON.stringify(result),
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
    const body = JSON.parse(event.body);
    // Hash password
    const hashedPassword = await bcrypt.hash(body.password, 10);
    const user = await repoCreateUser({
      username: body.username,
      officeName: body.officeName,
      email: body.email,
      phoneNo: body.phoneNo,
      password: hashedPassword,
      roleId: body.roleId
    });
    return {
      statusCode: 201,
      body: JSON.stringify(toUserResponse(user)),
    };
  } catch (error) {
    console.error('Create User Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error.' }),
    };
  }
};

export const getUserById = async (event: any) => {
  try {
    const id = event.pathParameters.id;
    const user = await repoGetUserById(id);
    if (!user) {
      return { statusCode: 404, body: JSON.stringify({ message: 'User not found.' }) };
    }
    return {
      statusCode: 200,
      body: JSON.stringify(toUserResponse(user)),
    };
  } catch (error) {
    console.error('Get User By ID Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error.' }),
    };
  }
};

export const updateUserById = async (event: any) => {
  try {
    const id = event.pathParameters.id;
    const body = JSON.parse(event.body);
    if (body.password) {
      body.password = await bcrypt.hash(body.password, 10);
    }
    const user = await repoUpdateUser(id, body);
    return {
      statusCode: 200,
      body: JSON.stringify(toUserResponse(user)),
    };
  } catch (error) {
    console.error('Update User Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error.' }),
    };
  }
};

export const deleteUserById = async (event: any) => {
  try {
    const id = event.pathParameters.id;
    await repoDeleteUser(id);
    return {
      statusCode: 204,
      body: '',
    };
  } catch (error) {
    console.error('Delete User Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error.' }),
    };
  }
};
