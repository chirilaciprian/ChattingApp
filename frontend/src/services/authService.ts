import api from '../utils/axios'
import { getErrorMessage } from '../utils/errorHandler';
import type { LoginCredentials, RegisterCredentials } from '../types/authTypes';

export const loginService = async (credentials: LoginCredentials): Promise<string> => {
  try {
    const res = await api.post(`/auth/signin`, credentials);
    return res.data.access_token;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const register = async (credentials: RegisterCredentials): Promise<boolean> => {
  try {
    const res = await api.post<RegisterCredentials>(`/auth/register`, credentials);
    if (res.status === 201) {
      return true;
    }
    return false;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};
