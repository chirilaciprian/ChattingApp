/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import type { LoginCredentials } from "../types/authTypes";
import * as tokenService from "../utils/token";
import * as authService from "../services/authService";
import type { User } from "../types/types";
import { getErrorMessage } from "../utils/errorHandler";
import Loading from "../components/common/Loading";

type AuthContextType = {
    isAuthenticated: boolean;
    isLoading: boolean;
    token: string | null;
    user: User | null;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchUser = async () => {
        try {
            const userData = await authService.getMe();
            setUser(userData);
        } catch (error) {
            console.log(error);
            logout();
        }
    }

    useEffect(() => {
        const initAuth = async () => {
            const storedToken = tokenService.getToken();
            if (storedToken) {
                setToken(storedToken);
                try {
                    await fetchUser();
                } catch (error) {
                    console.error('Failed to restore session:', getErrorMessage(error));
                    logout();
                }
            }
            setIsLoading(false);
        };
        initAuth();
    }, []);

    const login = async (credentials: LoginCredentials) => {
        const token = await authService.loginService(credentials);
        tokenService.setToken(token);
        setToken(token);
        await fetchUser();
    }

    const logout = () => {
        tokenService.removeToken();
        setToken(null);
        setUser(null);
    }

    if (isLoading) {
        return <Loading>Loading authentication...</Loading>;
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated: !!token, token, user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    )
};

export const useAuth = () => useContext(AuthContext);