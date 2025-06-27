const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { JWT_SECRET, JWT_EXPIRY, ERROR_MESSAGES } = require('../constants/auth');
import { LoginRequest } from '../request/authRequest';
import { LoginResponse } from '../response/authResponse';
import * as userRepository from '../repositories/user';
import {
    ServiceResponse,
    Permission,
    Role,
    UserProfile,
    GetUserProfileResponse,
    JwtPayload,
    RolePermission,
    ExtractTokenFromHeader
} from '../utils/interfaces';

/**
 * Authenticate a user with username and password
 * @param {LoginRequest} loginData - The login request data containing username and password
 * @returns {Promise<ServiceResponse<LoginResponse>>} Authentication result with token or error message
 */

const authenticateUser = async (
    loginData: LoginRequest
): Promise<ServiceResponse<LoginResponse>> => {
    try {
        const { username, password } = loginData;

        if (!username || !password) {
            return { statusCode: 400, message: ERROR_MESSAGES.CREDENTIALS_REQUIRED };
        }

        const user = await userRepository.findUserByUsername(username);
        console.log('User found:====35', user);

        if (!user) {
            return { statusCode: 401, message: ERROR_MESSAGES.INVALID_USERNAME };
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return { statusCode: 401, message: ERROR_MESSAGES.INVALID_PASSWORD };
        }

        const token: string = jwt.sign(
            { userId: user.id, username: user.username, role: user.roleId },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRY }
        );

        return { statusCode: 200, data: { token } };
    } catch (error: any) {
        console.error('Authentication error:', error);

        // Log additional details if available
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        const errorStack = error instanceof Error ? error.stack : null;

        if (errorStack) {
            console.error('Error stack:', errorStack);
        }

        return {
            statusCode: 500,
            message: errorMessage || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        };
    }
};

/**
 * Create a new user
 * @param {Object} data - User data
 * @param {string} data.username - Username
 * @param {string} data.email - Email
 * @param {string} data.password - Password
 * @param {number} data.roleId - Role ID
 * @returns {Promise<{success: boolean, data?: Object, message?: string}>}
 */

/**
 * Get user profile from token
 * @param {string} token - JWT token
 * @returns {Promise<{success: boolean, data?: Object, message?: string}>}
 */
const getUserProfile = async (token: string): Promise<ServiceResponse<UserProfile>> => {
    try {
        console.log('Get user profile with token:', token);
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
        console.log({decoded})
        if (!decoded) {
            return { statusCode: 401, message: ERROR_MESSAGES.INVALID_TOKEN };
        }
        const user = await userRepository.getUserWithRoleAndPermissions(decoded.userId.toString());
        console.log('User retrieved:', user);
        if (!user) {
            return { statusCode: 404, message: ERROR_MESSAGES.USER_NOT_FOUND };
        }

        const permissions: Permission[] = (user.role?.rolePermissions as RolePermission[])?.map((rp: RolePermission) => ({
            id: rp.permission.id,
            code: rp.permission.code,
            name: rp.permission.name,
            category: rp.permission.category
        })) || [];

        return {
            statusCode: 200,
            data: {
                id: Number(user.id),
                username: user.username,
                email: user.email ?? '',
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                roleId: Number(user.roleId),
                role: {
                    id: user.role?.id,
                    code: user.role?.code,
                    name: user.role?.name
                },
                permissions: permissions
            }
        };
    } catch (error) {
        console.error('Get user profile error:', error);
        return { statusCode: 401, message: ERROR_MESSAGES.INVALID_TOKEN };
    }
};

/**
 * Extract token from authorization header
 * @param {string|undefined} authHeader - Authorization header
 * @returns {string|null} - JWT token or null
 */
const extractTokenFromHeader: ExtractTokenFromHeader = (authHeader) => {
    if (!authHeader) {
        return null;
    }
    return authHeader.replace('Bearer ', '');
};

const enhanceErrorHandling = (error: any, defaultMessage: string) => {
    console.error('Error:', error);

    // Log additional details if available
    const errorMessage = error instanceof Error ? error.message : defaultMessage;
    const errorStack = error instanceof Error ? error.stack : null;

    if (errorStack) {
        console.error('Error stack:', errorStack);
    }

    return {
    
        statusCode: 500,
        message: errorMessage,
    };
};

module.exports = {
  authenticateUser,
  getUserProfile,
  extractTokenFromHeader
};
