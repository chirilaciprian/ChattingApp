import { AxiosError } from 'axios';

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {    
    return error.response?.data?.message 
      || error.response?.data?.error 
      || error.message 
      || 'Something went wrong';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred';
};