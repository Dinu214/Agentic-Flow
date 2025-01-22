import { useState } from 'react';
import { Mail, Lock, User, Phone } from 'lucide-react';
import { authService } from '../services/api';

interface SignupFormProps {
  onAuthSuccess: (userData: { email: string; username: string; firstName: string; lastName: string; }) => void;
  onLoginClick: () => void;
}

const SignupForm = ({ onAuthSuccess, onLoginClick }: SignupFormProps) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    username: '',
    mobile: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError('');
    
    try {
      // Convert number to numeric type before sending
      const signupData = {
        ...formData,
        mobile: parseInt(formData.mobile, 10)
      };

      const response = await authService.signup(signupData);
      console.log('Signup response:', response);
      if (response.access_token) {
        const userData = {
          email: formData.email,
          username: formData.username,
          firstName: formData.firstName,
          lastName: formData.lastName
        };
        sessionStorage.setItem('userData', JSON.stringify(userData));
        onAuthSuccess(userData);
      } else {
        setError('Failed to create account');
      }
    } catch (error) {
      console.error('Signup failed:', error);
      setError('Failed to create account');
    }
  };

  const handleChange = (e: { target: { name: string; value: string; }; }) => {
    setError('');
    
    // Special handling for number field
    if (e.target.name === 'mobile') {
      // Remove any non-digit characters
      const numericValue = e.target.value.replace(/\D/g, '');
      setFormData({
        ...formData,
        [e.target.name]: numericValue
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-center mb-2">Create Account</h1>
      <p className="text-center text-gray-600 mb-8">Please create your account</p>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* First Name and Last Name fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="firstName"
                placeholder="John"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="lastName"
                placeholder="Doe"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Username field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <div className="relative">
            <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              name="username"
              placeholder="johndoe123"
              value={formData.username}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        {/* Email field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="john.doe@example.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        {/* Phone Number field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <div className="relative">
            <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              name="mobile"
              placeholder="1234567890"
              value={formData.mobile}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              maxLength={10}
              pattern="[0-9]*"
            />
          </div>
        </div>

        {/* Password field */}
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

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Create account
        </button>

        <div className="text-center text-sm">
          <p className="text-gray-600">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onLoginClick}
              className="text-blue-600 hover:underline"
            >
              Sign in
            </button>
          </p>
        </div>
      </form>
    </>
  );
};

export default SignupForm;