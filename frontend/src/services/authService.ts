import api from '../utils/axios'
import type { LoginCredentials } from '../types/authTypes';

export const loginService = async (credentials: LoginCredentials): Promise<string> => {
  const res = await api.post(`/auth/signin`, credentials);  
  return res.data.token;
};

export const getMe = async () => {
  const res = await api.get('/auth/me');
  return res.data;
}

export const register = () => {

}
