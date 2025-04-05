import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Spline from '@splinetool/react-spline';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [splineError, setSplineError] = useState(false);
  const { login, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const onSplineError = (e) => {
    console.error("Spline loading error:", e);
    setSplineError(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      // Handle Firebase auth errors
      switch(error.code) {
        case 'auth/invalid-email':
          setError('Invalid email address');
          break;
        case 'auth/user-disabled':
          setError('This account has been disabled');
          break;
        case 'auth/user-not-found':
          setError('No account found with this email');
          break;
        case 'auth/wrong-password':
          setError('Incorrect password');
          break;
        case 'auth/too-many-requests':
          setError('Too many failed login attempts. Please try again later');
          break;
        case 'auth/configuration-not-found':
          setError('Firebase configuration error. Please contact support.');
          break;
        default:
          setError('Failed to login. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setError('');
    
    try {
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (error) {
      console.error('Google sign-in failed:', error);
      setError('Failed to sign in with Google. Please try again.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Spline Animation Container */}
      <div className="absolute inset-0 z-0">
        {!splineError && (
          <Spline 
            scene="https://prod.spline.design/6QqI5NemvdHbYKDH/scene.splinecode"
            onError={onSplineError}
          />
        )}
      </div>

      {/* Login Form Container */}
      <div className="glass-effect p-8 w-full max-w-md z-10 animate-fade-in">
        <div className="text-center mb-8">
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-blue-500 rounded-2xl animate-float" style={{ animationDelay: '0ms' }} />
            <div className="w-12 h-12 bg-purple-500 rounded-2xl -ml-4 animate-float" style={{ animationDelay: '200ms' }} />
            <div className="w-12 h-12 bg-indigo-500 rounded-2xl -ml-4 animate-float" style={{ animationDelay: '400ms' }} />
          </div>
          <h1 className="text-3xl font-bold mt-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
            Welcome Back
          </h1>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg mb-6 animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2 text-white">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all placeholder-white text-white"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-white">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all placeholder-white text-white"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full button-animate bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-medium"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Logging in...</span>
              </div>
            ) : (
              'Login'
            )}
          </button>
          
          <div className="relative flex items-center justify-center my-4">
            <div className="border-t border-gray-300/30 flex-grow"></div>
            <span className="px-3 text-gray-400 text-sm">or</span>
            <div className="border-t border-gray-300/30 flex-grow"></div>
          </div>
          
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
            className="w-full flex items-center justify-center bg-white text-gray-800 py-3 rounded-lg font-medium transition-all hover:bg-gray-100"
          >
            {isGoogleLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                <span>Connecting...</span>
              </div>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign in with Google
              </>
            )}
          </button>
          
          <div className="text-center mt-4">
            <p className="text-white">
              Don't have an account?{' '}
              <Link to="/signup" className="text-blue-400 hover:text-blue-300">
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login; 