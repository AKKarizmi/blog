import React, { useState } from 'react';
import { EyeIcon, EyeOffIcon, Loader2Icon, User, Lock, Globe, Linkedin, Github } from 'lucide-react';
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
                <Google className="w-5 h-5" />
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