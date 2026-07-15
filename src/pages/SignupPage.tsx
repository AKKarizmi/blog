import React, { useState } from 'react';
import { Loader2Icon, Globe, Linkedin, Github, User, Mail, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { useToast } from '../hooks/useToast';
import { ToastContainer } from '../components/ui/Toast';

export function SignupPage() {
  const { toasts, addToast, removeToast } = useToast();
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gender, setGender] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSocialSignup = (provider: string) => {
    addToast('Under Construction...', 'info');
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      addToast('Passwords do not match.', 'error');
      return;
    }
    setIsSubmitting(true);
    const data = {
      fullName,
      username,
      email,
      password,
      confirmPassword,
      gender
    };
    console.log('[signup] form data', data);
    addToast('Signup is under construction...', 'info');
    setTimeout(() => {
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
        <div className="w-16 h-16 bg-white ring-1 ring-gray-200 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
          <img src="/favicon.svg" alt="FOROZ logo" className="w-10 h-10" />
        </div>
        <h1 className="text-center text-2xl font-bold text-gray-900">Create your account</h1>
        <p className="mt-1 text-center text-sm text-gray-500">Join FOROZ Admin to get started</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="py-8 px-4 sm:px-10">
          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                Full name
              </label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                required
                icon={<User className="w-4 h-4" />}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Jane Doe"
              />
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
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
                onChange={(e) => setUsername(e.target.value)}
                placeholder="janedoe"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                icon={<Mail className="w-4 h-4" />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                icon={<Lock className="w-4 h-4" />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm password
              </label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                icon={<Lock className="w-4 h-4" />}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
                className="block w-full rounded-lg border border-gray-300 bg-white py-2 px-3 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
                  Creating account…
                </>
              ) : (
                'Create account'
              )}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative text-center text-sm text-gray-500">
              <span className="bg-white px-2">Or continue with</span>
            </div>
            <div className="mt-4 grid gap-3 grid-cols-3">
              <Button
                type="button"
                variant="outline"
                className="h-11 w-full p-0"
                aria-label="Continue with Google"
                onClick={() => handleSocialSignup('Google')}>
                <Globe className="w-5 h-5" />
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-11 w-full p-0"
                aria-label="Continue with LinkedIn"
                onClick={() => handleSocialSignup('LinkedIn')}>
                <Linkedin className="w-5 h-5" />
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-11 w-full p-0"
                aria-label="Continue with GitHub"
                onClick={() => handleSocialSignup('GitHub')}>
                <Github className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Already have an account?</span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/login"
                className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                Sign in instead
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
