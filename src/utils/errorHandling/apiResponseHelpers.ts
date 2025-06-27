/**
 * Helper function to create a standardized API response
 * @param statusCode - HTTP status code
 * @param responseBody - Response body object to be stringified
 * @returns Formatted API response
 */
export const createApiResponse = (statusCode: number, responseBody: any): APIResponse => {
    return {
        statusCode, // Ensure the HTTP status code is set correctly
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        },
        success: true,
        body: responseBody,
    };
};

export const createSuccessResponse = (statusCode: number, data: any): APIResponse => {
    return {
        statusCode,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        },
        success: true,
        body: data,
        error: null,
    };
};

export const createErrorResponse = (statusCode: number, message: string): APIResponse => {
    return {
        statusCode,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        },
        success: false,
        body: null,
        error: {
            message: message,
        },
    };
};

interface APIResponse {
    statusCode: number;
    body?: any;
    success: boolean; // Indicates if the request was successful
    headers?: {
        [header: string]: string | number | boolean;
    };
    error?: any;
}
