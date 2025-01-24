import { useState } from 'react';
import { User, Lock } from 'lucide-react';
import { LoginCredentials } from '../types/auth';
import { authService } from '../services/api';

interface LoginFormProps {
  onAuthSuccess: (userData: { username: string; }) => void;
  onSignupClick: () => void;
}

const LoginForm = ({ onAuthSuccess, onSignupClick }: LoginFormProps) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError('');
    
    try {
      const credentials: LoginCredentials = {
        username: formData.username,
        password: formData.password
      };
      
      // const response = await authService.login(credentials);
      const response = undefined;
      if (true) {
        const userData = {
          username: formData.username
        };
        sessionStorage.setItem('userData', JSON.stringify(userData));
        onAuthSuccess(userData);
      } else {
        const userData = {
          username: formData.username
        };
        sessionStorage.setItem('userData', JSON.stringify(userData));
        onAuthSuccess(userData);
      }
    } catch (error) {
      console.error('Authentication failed:', error);
      setError('Invalid username or password');
    }
  };

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    setError('');
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-center mb-2">Welcome back</h1>
      <p className="text-center text-gray-600 mb-8">Please sign in to your account</p>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <div className="relative">
            <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button type="button" className="text-blue-600 hover:underline text-sm">
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Sign in
        </button>

        <div className="text-center text-sm">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={onSignupClick}
              className="text-blue-600 hover:underline"
            >
              Sign up
            </button>
          </p>
        </div>
      </form>
    </>
  );
};

export default LoginForm;