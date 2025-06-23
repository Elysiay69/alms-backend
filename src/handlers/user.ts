import { prisma } from '../dbConfig/prisma';

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
