import { ApiResponse } from './types';

export const createSuccessResponse = <T>(statusCode: number, data: T): ApiResponse<T> => {
  return {
    success: true,
    statusCode,
    data,
  };
};

export const createErrorResponse = (statusCode: number, message: string): ApiResponse<null> => {
  return {
    success: false,
    statusCode,
    message,
  };
};
