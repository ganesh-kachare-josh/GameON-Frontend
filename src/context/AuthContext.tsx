import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { authApi } from '../lib/api';
import { AuthUser, LoginRequest, RegisterRequest } from '../lib/types';

interface AuthContextType {
    user: AuthUser | null;
    loading: boolean;
    login: (data: LoginRequest) => Promise<void>;
    register: (data: RegisterRequest) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    // Check for token on initial load
    useEffect(() => {
        const token = Cookies.get('token');
        const userStr = localStorage.getItem('user');

        if (token && userStr) {
            try {
                const userData = JSON.parse(userStr);
                setUser(userData);
            } catch (error) {
                console.error('Failed to parse user data:', error);
                localStorage.removeItem('user');
                Cookies.remove('token');
            }
        }

        setLoading(false);
    }, []);

    const login = async (data: LoginRequest) => {
        setLoading(true);
        try {
            const response = await authApi.login(data);
            const userData = response.data;

            console.log(userData);
            
            // // Store token in httpOnly cookie

            if (userData.token) {
                Cookies.set('token', userData.token, { expires: 7 });
            }

            // Store user data in localStorage
            localStorage.setItem('user', JSON.stringify(userData));

            setUser(userData);
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const register = async (data: RegisterRequest) => {
        setLoading(true);
        try {
            const response = await authApi.register(data);
            const userData = response.data;

            // // Store token in httpOnly cookie
            // Cookies.set('token', userData.token, { expires: 7 });

            if (userData.token) {
                Cookies.set('token', userData.token, { expires: 7 });
            }

            // Store user data in localStorage
            localStorage.setItem('user', JSON.stringify(userData));

            // Name, Email, Id, Token
            // setUser(userData);
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        authApi.logout();
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                register,
                logout,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};