// // api.ts
import axios from 'axios';
import { LoginCredentials, SignUpCredentials, AuthResponse } from '../types/auth';


const KEYCLOAK_URL = import.meta.env.VITE_KEYCLOAK_URL;
const REALM = import.meta.env.VITE_REALM;
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET;
const ADMIN_USERNAME = import.meta.env.VITE_ADMIN_USERNAME;
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

const api = axios.create({
  baseURL: KEYCLOAK_URL,
  timeout: 10000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  withCredentials: false
});

const handleError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      throw new Error('Unable to reach the server. Please check if Keycloak is running.');
    }
    const message = error.response.data?.error_description || 
                    error.response.data?.error || 
                    error.response.data?.message ||
                    'Server error';
    throw new Error(message);
  }
  throw new Error('An unexpected error occurred');
};

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const data = new URLSearchParams();
    data.append('client_id', CLIENT_ID || '');
    data.append('grant_type', 'password');
    data.append('username', credentials.username);
    data.append('password', credentials.password);

    if (CLIENT_SECRET) {
      data.append('client_secret', CLIENT_SECRET);
    }

    try {
      const response = await api.post(
        `/realms/${REALM}/protocol/openid-connect/token`,
        data.toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },


  async signup(credentials: SignUpCredentials): Promise<AuthResponse> {
    try {
      // Step 1: Get admin token from master realm
      const tokenData = new URLSearchParams();
      tokenData.append('client_id', 'admin-cli');
      tokenData.append('grant_type', 'password');
      tokenData.append('username', ADMIN_USERNAME);
      tokenData.append('password', ADMIN_PASSWORD);

      console.log('Attempting to get admin token...');

      const tokenResponse = await api.post(
        `/realms/${REALM}/protocol/openid-connect/token`,
        tokenData.toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
      
      if (!tokenResponse.data?.access_token) {
        console.error('Admin token response:', tokenResponse.data);
        throw new Error('Failed to obtain admin token');
      }

      const adminToken = tokenResponse.data.access_token;
      console.log('Admin token obtained successfully');

      // Step 2: Create new user
      await api.post(
        `/admin/realms/${REALM}/users`,
        {
          username: credentials.username,
          email: credentials.email,
          firstName: credentials.firstName,
          lastName: credentials.lastName,
          attributes: {
            mobile: [credentials.mobile]
          },
          enabled: true,
          credentials: [{
            type: 'password',
            value: credentials.password,
            temporary: false
          }]
        },
        {
          headers: {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Step 3: Use existing login method to get user token
      return await this.login({
        username: credentials.username,
        password: credentials.password
      });

    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Signup error details:', {
          name: error.name,
          message: error.message,
          response: (error as any).response?.data,
          status: (error as any).response?.status,
          config: (error as any).config
        });
      }

      if (axios.isAxiosError(error)) {
        if (!error.response) {
          throw new Error(`Connection failed. Please check server accessibility and CORS configuration.`);
        }
        const message = error.response.data?.error_description || 
                       error.response.data?.error || 
                       error.response.data?.message ||
                       'Failed to create user';
        throw new Error(message);
      }
      throw error;
    }
  },  async testConnection(): Promise<boolean> {
    try {
      await api.get(`/realms/${REALM}`);
      return true;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return true;
      }
      return false;
    }
  }
};