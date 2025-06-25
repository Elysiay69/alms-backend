export const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
export const JWT_EXPIRY = '1h';
export const ERROR_MESSAGES = {
  // Authentication errors
  CREDENTIALS_REQUIRED: 'Username and password are required.',
  INVALID_USERNAME: 'Invalid username.',
  INVALID_PASSWORD: 'Invalid password.',
  NO_TOKEN_PROVIDED: 'No token provided.',
  INVALID_TOKEN: 'Invalid or expired token.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  SESSION_EXPIRED: 'Your session has expired. Please log in again.',
  
  // User errors
  USER_NOT_FOUND: 'User not found.',
  USER_ALREADY_EXISTS: 'User with this username already exists.',
  INVALID_USER_DATA: 'The provided user data is invalid.',
  
  // Permission errors
  FORBIDDEN: 'You do not have permission to access this resource.',
  INSUFFICIENT_PERMISSIONS: 'You do not have sufficient permissions for this action.',
  
  // Resource errors
  RESOURCE_NOT_FOUND: 'The requested resource was not found.',
  RESOURCE_ALREADY_EXISTS: 'This resource already exists.',
  
  // Database errors
  DATABASE_ERROR: 'A database error occurred.',
  QUERY_FAILED: 'The database query failed.',
  
  // Validation errors
  VALIDATION_ERROR: 'The provided data failed validation.',
  INVALID_INPUT: 'Invalid input provided.',
  MISSING_REQUIRED_FIELDS: 'Required fields are missing.',
  
  // Server errors
  INTERNAL_SERVER_ERROR: 'Internal server error.',
  SERVICE_UNAVAILABLE: 'The service is currently unavailable.',
  
  // Success messages
  LOGOUT_SUCCESS: 'Logged out successfully.'
};
