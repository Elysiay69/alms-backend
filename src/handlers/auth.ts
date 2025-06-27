import { LoginRequest } from '../request/authRequest';
import { LoginResponse, UserProfileResponse, ErrorResponse } from '../response/authResponse';
const authService = require('../services/authService');
const { ERROR_MESSAGES } = require('../constants/auth');
import { ApiResponse, Nullable } from '../utils/types';
import { createApiResponse, createSuccessResponse, createErrorResponse } from '../utils/errorHandling/apiResponseHelpers';

interface APIGatewayEvent {
    body?: string | null;
    headers: { [key: string]: string | undefined };
}

interface APIResponse {
    statusCode: number;
    body?: any;
    success: boolean; // Indicates if the request was successful
    headers?: {
        [header: string]: string | number | boolean;
    };
    error?: any;
}

/**
 * Login handler
 * @param event - API Gateway event
 * @returns API response
 */
exports.login = async (event: APIGatewayEvent): Promise<APIResponse> => {
    try {
        // Parse request body
        const body: LoginRequest = typeof event.body === 'string' ? JSON.parse(event.body) : event.body || {};
        const { username, password } = body;

        // Validate input
        if (!username || !password) {
            return createApiResponse(400, {
                message: ERROR_MESSAGES.CREDENTIALS_REQUIRED,
            });
        }

        // Process authentication in service
        const result: ApiResponse<LoginResponse> = await authService.authenticateUser({ username, password });

        console.log('Login successful:', result);
        if (result.statusCode !== 200) {
            return createApiResponse(result.statusCode || 401, {
                message: result.message,
            });
        }
        console.log('Result:', result.data);
        return createApiResponse(200,result.data);
    } catch (error) {
        console.error('Login Error:', error);
        return createApiResponse(500, {
            success: false,
            message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
};
/**
 * Logout handler
 * For JWT, logout is handled on the client by deleting the token
 */
exports.logout = async (event: APIGatewayEvent): Promise<APIResponse> => {
    // For JWT, logout is usually handled on the client by deleting the token
    return createApiResponse(200, { message: ERROR_MESSAGES.LOGOUT_SUCCESS });
};

/**
 * Get current user profile
 */
exports.getMe = async (event: APIGatewayEvent): Promise<APIResponse> => {
    try {
        // Extract JWT from Authorization header
        const authHeader = event.headers.Authorization || event.headers.authorization;
        console.log('Auth Header:', authHeader);
        if (!authHeader) {
            return createApiResponse(401, {
                message: ERROR_MESSAGES.NO_TOKEN_PROVIDED,
            });
        }

        // Extract token
        const token = authService.extractTokenFromHeader(authHeader);
        
        if (!token) {
            return createApiResponse(401, {
                message: ERROR_MESSAGES.INVALID_TOKEN,
            });
        }

        // Get user profile from service
        const result = await authService.getUserProfile(token);

        if (result.statusCode !== 200 || !result.data) {
            return createApiResponse(result.statusCode || 500, {
                message: result.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
            });
        }

        return createApiResponse(200, result.data);
    } catch (error) {
        console.error('GetMe Error:', error);
        return createApiResponse(500, {
            message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
};
