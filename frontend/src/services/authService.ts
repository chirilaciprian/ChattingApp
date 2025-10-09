/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  user?: {
    id: string;
    username: string;
    email: string;
    avatar: string;
  };
  token?: string;
  error?: string;
}

/**
 * Login user
 * TODO: Replace with actual API call
 */
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  // Mock successful login
  return {
    success: true,
    user: {
      id: '1',
      username: credentials.email.split('@')[0],
      email: credentials.email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${credentials.email}`,
    },
    token: 'mock-jwt-token',
  };
};

/**
 * Register new user
 * TODO: Replace with actual API call
 */
export const register = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  // Mock successful registration
  return {
    success: true,
    user: {
      id: Date.now().toString(),
      username: credentials.username,
      email: credentials.email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${credentials.username}`,
    },
    token: 'mock-jwt-token',
  };
};

/**
 * Logout user
 * TODO: Replace with actual API call
 */
export const logout = async (): Promise<void> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200));
  
  // Clear local storage, cookies, etc.
  localStorage.removeItem('authToken');
};

/**
 * Verify authentication token
 * TODO: Replace with actual API call
 */
export const verifyToken = async (token: string): Promise<boolean> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  // Mock token verification
  return !!token;
};
