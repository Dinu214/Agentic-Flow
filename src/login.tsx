import { useState } from 'react';
import { Shield } from 'lucide-react';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';

interface AuthPageProps {
  onAuthSuccess: (userData: { email: string; name?: string }) => void;
}

const AuthPage = ({ onAuthSuccess }: AuthPageProps) => {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="flex justify-center mb-6">
          <Shield className="w-10 h-10 text-blue-600" />
        </div>

        {authMode === 'login' ? (
          <LoginForm 
            onAuthSuccess={(userData: { username: string }) => onAuthSuccess({ email: userData.username })}
            onSignupClick={() => setAuthMode('signup')}
          />
        ) : (
          <SignupForm
            onAuthSuccess={(userData: { email: string; username: string; firstName: string; lastName: string; }) => onAuthSuccess({ email: userData.username })}
            onLoginClick={() => setAuthMode('login')}
          />
        )}
      </div>
    </div>
  );
};
export default AuthPage;