import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '../types';

export interface RegisterFormData {
  fullName: string;
  email: string;
  mobile?: string;
  role: Role;
  username?: string;
  password?: string;
  department?: string;
}

interface AuthContextType {
  user: User | null;
  role: Role;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authError: string | null;
  login: (email: string, password?: string, targetRole?: Role, rememberMe?: boolean) => Promise<boolean>;
  register: (data: RegisterFormData) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: Role) => void;
}

const STORAGE_KEY_USER = 'urbanpulse_auth_user';
const STORAGE_KEY_ROLE = 'urbanpulse_auth_role';
const STORAGE_KEY_TOKEN = 'urbanpulse_auth_token';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

import { API_BASE_URL as CENTRAL_API_BASE_URL } from '../config/api';

const API_BASE_URL = `${CENTRAL_API_BASE_URL}/auth`;

const mapBackendUserToFrontendUser = (backendUser: any): User => {
  return {
    id: backendUser._id || backendUser.id || `usr-${Date.now()}`,
    name: backendUser.fullName || backendUser.name || backendUser.username || 'User',
    email: backendUser.email || '',
    role: (backendUser.role as Role) || 'citizen',
    status: backendUser.isActive ? 'active' : 'suspended',
    department: backendUser.department || undefined,
    createdAt: backendUser.createdAt ? String(backendUser.createdAt).split('T')[0] : new Date().toISOString().split('T')[0],
    complaintsSubmittedCount: 0,
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role>('guest');
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const logout = () => {
    setUser(null);
    setRole('guest');
    setToken(null);
    setAuthError(null);

    localStorage.removeItem(STORAGE_KEY_USER);
    localStorage.removeItem(STORAGE_KEY_ROLE);
    localStorage.removeItem(STORAGE_KEY_TOKEN);

    sessionStorage.removeItem(STORAGE_KEY_USER);
    sessionStorage.removeItem(STORAGE_KEY_ROLE);
    sessionStorage.removeItem(STORAGE_KEY_TOKEN);
  };

  // Restore session from token on mount
  useEffect(() => {
    const restoreSession = async () => {
      const savedToken =
        localStorage.getItem(STORAGE_KEY_TOKEN) ||
        sessionStorage.getItem(STORAGE_KEY_TOKEN);

      if (!savedToken) {
        logout();
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/me`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${savedToken}`,
            'Content-Type': 'application/json',
          },
        });

        const result = await response.json();

        if (response.ok && result.success && result.data) {
          const mappedUser = mapBackendUserToFrontendUser(result.data);
          setUser(mappedUser);
          setRole(mappedUser.role);
          setToken(savedToken);
        } else {
          logout();
        }
      } catch (error) {
        console.error('Error verifying token on session restore:', error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (
    email: string,
    password?: string,
    _targetRole?: Role,
    rememberMe: boolean = true
  ): Promise<boolean> => {
    setAuthError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password: password || '',
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success || !result.token) {
        const message = result.message || 'Authentication failed. Please check your credentials.';
        setAuthError(message);
        return false;
      }

      const realToken = result.token;
      const backendUser = result.user;
      const mappedUser = mapBackendUserToFrontendUser(backendUser);

      setUser(mappedUser);
      setRole(mappedUser.role);
      setToken(realToken);
      setAuthError(null);

      const storage = rememberMe ? localStorage : sessionStorage;
      const altStorage = rememberMe ? sessionStorage : localStorage;

      altStorage.removeItem(STORAGE_KEY_USER);
      altStorage.removeItem(STORAGE_KEY_ROLE);
      altStorage.removeItem(STORAGE_KEY_TOKEN);

      storage.setItem(STORAGE_KEY_USER, JSON.stringify(mappedUser));
      storage.setItem(STORAGE_KEY_ROLE, mappedUser.role);
      storage.setItem(STORAGE_KEY_TOKEN, realToken);

      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Network error during login';
      setAuthError(message);
      return false;
    }
  };

  const register = async (data: RegisterFormData): Promise<boolean> => {
    setAuthError(null);
    try {
      const payload = {
        fullName: data.fullName,
        email: data.email.trim().toLowerCase(),
        password: data.password || 'password123',
        username: data.username || data.email.trim().toLowerCase().split('@')[0],
        role: data.role || 'citizen',
        department: data.department || '',
      };

      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        const message = result.message || 'Registration failed';
        setAuthError(message);
        return false;
      }

      setAuthError(null);
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Network error during registration';
      setAuthError(message);
      return false;
    }
  };

  const switchRole = (_newRole: Role) => {
    console.warn('Role switching is disabled. The user role is determined by the backend token.');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        token,
        isAuthenticated: !!user && !!token && role !== 'guest',
        isLoading,
        authError,
        login,
        register,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
