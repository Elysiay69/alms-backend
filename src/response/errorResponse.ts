// Error Response Type
export interface ErrorResponse {
  message: string;
  code?: number;
  details?: any;
  stack?: string;
}

// HTTP Status codes
export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503
}

/**
 * Creates an error response with the given message, status code, and optional details
 */
export function createError(
  message: string,
  statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR,
  details?: any
): ErrorResponse {
  return {
    message,
    code: statusCode,
    details: process.env.NODE_ENV === 'development' ? details : undefined,
    stack: process.env.NODE_ENV === 'development' ? new Error().stack : undefined
  };
}

/**
 * Formats any error into a standardized ErrorResponse
 */
export function formatErrorResponse(error: any): ErrorResponse {
  // If it's already an ErrorResponse, return it
  if (error && typeof error === 'object' && 'message' in error && 'code' in error) {
    return {
      message: error.message,
      code: error.code,
      details: process.env.NODE_ENV === 'development' ? error.details : undefined,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    };
  }
  
  // Handle Prisma errors
  if (error && typeof error === 'object' && error.name === 'PrismaClientKnownRequestError') {
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Database error occurred';
    
    // Not found error
    if (error.code === 'P2025') {
      statusCode = HttpStatus.NOT_FOUND;
      message = 'Resource not found';
    }
    // Unique constraint violation
    else if (error.code === 'P2002') {
      statusCode = HttpStatus.CONFLICT;
      const field = error.meta?.target ? (error.meta.target as string[])[0] : 'field';
      message = `Resource with this ${field} already exists`;
    }
    // Foreign key constraint violation
    else if (error.code === 'P2003') {
      statusCode = HttpStatus.BAD_REQUEST;
      const field = error.meta?.field_name ? error.meta.field_name as string : 'field';
      message = `Related ${field} does not exist`;
    }
    
    return {
      message,
      code: statusCode,
      details: process.env.NODE_ENV === 'development' ? { code: error.code, meta: error.meta } : undefined,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    };
  }
  
  // Handle validation errors from libraries
  if (
    error && 
    typeof error === 'object' && 
    (error.name === 'ValidationError' || error.name === 'SyntaxError')
  ) {
    return {
      message: error.message || 'Validation error',
      code: HttpStatus.BAD_REQUEST,
      details: process.env.NODE_ENV === 'development' ? error.details : undefined,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    };
  }
  
  // Generic error
  return {
    message: error && typeof error === 'object' && 'message' in error ? 
      error.message : 'An unexpected error occurred',
    code: HttpStatus.INTERNAL_SERVER_ERROR,
    stack: process.env.NODE_ENV === 'development' ? 
      (error && typeof error === 'object' && 'stack' in error ? error.stack : new Error().stack) : 
      undefined
  };
}

/**
 * Helper functions to create specific types of errors
 */
export const errorFactory = {
  badRequest: (message: string = 'Bad request', details?: any): ErrorResponse => 
    createError(message, HttpStatus.BAD_REQUEST, details),
    
  unauthorized: (message: string = 'Unauthorized', details?: any): ErrorResponse => 
    createError(message, HttpStatus.UNAUTHORIZED, details),
    
  forbidden: (message: string = 'Forbidden', details?: any): ErrorResponse => 
    createError(message, HttpStatus.FORBIDDEN, details),
    
  notFound: (message: string = 'Resource not found', details?: any): ErrorResponse => 
    createError(message, HttpStatus.NOT_FOUND, details),
    
  conflict: (message: string = 'Conflict', details?: any): ErrorResponse => 
    createError(message, HttpStatus.CONFLICT, details),
    
  validation: (message: string = 'Validation error', details?: any): ErrorResponse => 
    createError(message, HttpStatus.UNPROCESSABLE_ENTITY, details),
    
  internal: (message: string = 'Internal server error', details?: any): ErrorResponse => 
    createError(message, HttpStatus.INTERNAL_SERVER_ERROR, details),
    
  serviceUnavailable: (message: string = 'Service unavailable', details?: any): ErrorResponse => 
    createError(message, HttpStatus.SERVICE_UNAVAILABLE, details)
};

/**
 * Creates an API Gateway-compatible response from an error
 */
export function createAPIErrorResponse(error: any): {
  statusCode: number;
  body: string;
  headers: Record<string, string | boolean>;
} {
  const errorResponse = formatErrorResponse(error);
  
  return {
    statusCode: errorResponse.code || HttpStatus.INTERNAL_SERVER_ERROR,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify(errorResponse)
  };
}

/**
 * Creates a wrapper for Lambda handlers to provide error handling
 */
export function withErrorHandling(handler: Function) {
  return async (event: any, context: any) => {
    try {
      return await handler(event, context);
    } catch (error) {
      console.error('Error in handler:', error);
      return createAPIErrorResponse(error);
    }
  };
}

/**
 * Utility functions for common error handling tasks
 */
export const errorUtils = {
  /**
   * Safely parse request body JSON
   */
  parseBody: <T>(body: string | null | undefined): T => {
    if (!body) {
      throw errorFactory.badRequest('Request body is required');
    }
    
    try {
      return JSON.parse(body) as T;
    } catch (e) {
      throw errorFactory.badRequest('Invalid JSON in request body');
    }
  },
  
  /**
   * Validate required fields in an object
   */
  validateRequiredFields: (data: Record<string, any>, requiredFields: string[]): void => {
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      throw errorFactory.validation('Required fields are missing', { missingFields });
    }
  },
  
  /**
   * Handle database operations safely
   */
  async dbOperation<T>(operation: () => Promise<T>, resourceName: string = 'resource'): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      console.error(`Database error on ${resourceName}:`, error);
      throw error; // Will be caught by the error handler and formatted
    }
  },
  /**
   * Handle Prisma errors and convert them to application errors
   */
  handlePrismaError(error: unknown, resourceName: string = 'resource'): ErrorResponse {
    if (error && typeof error === 'object' && 'code' in error) {
      // Prisma not found error
      if (error.code === 'P2025') {
        return errorFactory.notFound(`${resourceName} not found`);
      }

      // Prisma unique constraint violation
      if (error.code === 'P2002' && 'meta' in error && error.meta && typeof error.meta === 'object') {
        let field = 'field';
        if (error.meta && typeof error.meta === 'object' && 'target' in error.meta && Array.isArray(error.meta.target)) {
          field = error.meta.target[0] as string;
        }
        return errorFactory.conflict(`${resourceName} with this ${field} already exists`, { field });
      }

      // Prisma foreign key constraint violation
      if (error.code === 'P2003' && 'meta' in error && error.meta && typeof error.meta === 'object') {
        let field = 'field';
        if (error.meta && typeof error.meta === 'object' && 'field_name' in error.meta) {
          field = error.meta.field_name as string;
        }
        return errorFactory.badRequest(`Related ${field} does not exist`, { field });
      }
    }

    // Generic database error
    console.error('Database error:', error);
    return errorFactory.internal('Database operation failed');
  },

  /**
   * Safely execute a function and handle common errors
   */
  async safeExecute<T>(
    fn: () => Promise<T>, 
    errorMessage: string = 'Operation failed'
  ): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      console.error('Execution error:', error);
      if (error && typeof error === 'object' && 'message' in error && 'code' in error) {
        throw error; // Re-throw if it's already an ErrorResponse
      }
      throw errorFactory.internal(errorMessage, error);
    }
  }
};
