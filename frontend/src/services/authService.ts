import api from '../utils/axios'
import type { LoginCredentials, RegisterCredentials } from '../types/authTypes';

export const loginService = async (credentials: LoginCredentials): Promise<string> => {
  const res = await api.post(`/auth/signin`, credentials);  
  return res.data.token;
};

export const getMe = async () => {
  const res = await api.get('/auth/me');
  return res.data;
}

export const register = async (credentials: RegisterCredentials): Promise<boolean> => {
  const res = await api.post(`/auth/register`, credentials);
  return res.status === 201;
}
