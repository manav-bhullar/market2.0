import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';

/**
 * LoginPage - Google OAuth login page
 */
export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [error, setError] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleLoginSuccess = async (credentialResponse) => {
    try {
      setError('');
      await login(credentialResponse.credential);
      navigate('/');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Login failed. Please try again.'
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">🏪 Campus Market</h1>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome!</h2>
          <p className="text-gray-600">Sign in with your email account</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="mb-8 flex justify-center">
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={() => setError('Login failed. Please try again.')}
            theme="filled_blue"
            size="large"
            locale="en"
          />
        </div>

        <div className="bg-blue-50 rounded-lg p-4 text-sm text-gray-700">
          <p className="font-semibold text-blue-900 mb-2">📝 Important:</p>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>First-time users are automatically registered</li>
            <li>Your profile helps build seller reputation</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
