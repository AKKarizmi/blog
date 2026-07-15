import { useState } from 'react';
import { EyeIcon, EyeOffIcon, Loader2Icon, User, Lock, Linkedin, Github } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
export function LoginPage() {
  const { login } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[login] submit clicked', { username });
    if (isSubmitting) return;
    setError(null);
    setIsSubmitting(true);
    (async () => {
      try {
        const success = await login(username, password);
        console.log('[login] login result', success);
        if (!success) {
          setError('Invalid username or password. Please try again.');
        }
      } catch (err) {
        console.error('[login] unexpected error', err);
        setError('An unexpected error occurred');
      } finally {
        setIsSubmitting(false);
      }
    })();
  };

  const handleSocialLogin = (provider: string) => {
    alert(`${provider} login is under construction...`);
  };

  const handleForgotPassword = () => {
    alert('Forgot password flow is under construction...');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
        <div className="w-16 h-16 bg-white ring-1 ring-gray-200 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
          <img
            src="/favicon.svg"
            alt="FOROZ logo"
            className="w-10 h-10" />
          
        </div>
        <h1 className="text-center text-2xl font-bold text-gray-900">
          Sign in to FOROZ Admin
        </h1>
        <p className="mt-1 text-center text-sm text-gray-500">
          Manage volunteers, events, and communications
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="py-8 px-4 sm:px-10">
          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1">
                
                Username
              </label>
              <Input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                icon={<User className="w-4 h-4" />}
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (error) setError(null);
                }}
                aria-invalid={error ? true : undefined}
                placeholder="admin" />
              
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1">
                
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  icon={<Lock className="w-4 h-4" />}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  aria-invalid={error ? true : undefined}
                  className="pr-10" />
                
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  
                  {showPassword ?
                  <EyeOffIcon className="w-5 h-5" /> :

                  <EyeIcon className="w-5 h-5" />
                  }
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <button type="button" onClick={handleForgotPassword} className="font-medium text-indigo-600 hover:text-indigo-700 focus:outline-none">
                Forgot password?
              </button>
              <Link to="/signup" className="text-indigo-600 hover:text-indigo-700 font-medium">
                Create account
              </Link>
            </div>

            {error &&
            <p
              role="alert"
              className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              
                {error}
              </p>
            }

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ?
              <>
                  <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
                  Signing in…
                </> :

              'Sign in'
              }
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative text-center text-sm text-gray-500">
              <span className="bg-slate-50 px-2">Or continue with</span>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <Button
                type="button"
                variant="outline"
                className="h-11 w-full p-0"
                aria-label="Continue with Google"
                onClick={() => handleSocialLogin('Google')}>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-11 w-full p-0"
                aria-label="Continue with LinkedIn"
                onClick={() => handleSocialLogin('LinkedIn')}>
                <Linkedin className="w-5 h-5" />
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-11 w-full p-0"
                aria-label="Continue with GitHub"
                onClick={() => handleSocialLogin('GitHub')}>
                <Github className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>);

}