import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../store/auth';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Activity, Loader2, Eye, EyeOff } from 'lucide-react';

const authSchema = z.object({
  name: z.string().optional(),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['Viewer', 'Analyst']).optional(),
}).refine(data => !data.name || data.name.length > 0 || !data.role, {
  message: "Name is required for registration",
  path: ["name"]
});

type AuthForm = z.infer<typeof authSchema>;

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  
  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue } = useForm<AuthForm>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      role: 'Viewer'
    }
  });

  const onSubmit = async (data: AuthForm) => {
    try {
      setError('');
      if (isLogin) {
        const response = await api.post('/auth/login', { email: data.email, password: data.password });
        login(response.data, response.data.token);
      } else {
        const response = await api.post('/auth/register', data);
        login(response.data, response.data.token);
      }
      navigate('/');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || `Failed to ${isLogin ? 'login' : 'register'}.`);
    }
  };

  const autofillAdmin = () => {
    setValue('email', 'admin@zoryn.com');
    setValue('password', 'admin123');
    setIsLogin(true);
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-zinc-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="mx-auto w-12 h-12 bg-emerald-500 rounded-xl shadow-lg shadow-emerald-500/30 flex items-center justify-center">
          <Activity className="w-8 h-8 text-zinc-950" />
        </div>
        <h2 className="mt-6 text-3xl font-bold tracking-tight text-white">
          {isLogin ? 'Sign in to Zoryn' : 'Create an Account'}
        </h2>
        <p className="mt-2 text-sm text-zinc-400">
          Enterprise Financial Intelligence
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-zinc-900 py-8 px-4 rounded-xl shadow-lg shadow-emerald-500/10 sm:px-10 border border-zinc-800">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {error && (
              <div className="bg-red-950/50 rounded-lg text-red-400 text-sm p-3 border border-red-900">
                {error}
              </div>
            )}
            
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-zinc-300">Full Name</label>
                <div className="mt-1">
                  <input
                    {...register('name')}
                    type="text"
                    className="appearance-none block w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                    placeholder="John Doe"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-zinc-300">Email address</label>
              <div className="mt-1">
                <input
                  {...register('email')}
                  type="email"
                  className="appearance-none block w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  placeholder="you@example.com"
                />
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300">Password</label>
              <div className="mt-1 relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  className="appearance-none block w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-emerald-500"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
                {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-zinc-300">System Role</label>
                <div className="mt-1">
                  <select
                    {...register('role')}
                    className="appearance-none block w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  >
                    <option value="Viewer">Viewer (Read Only)</option>
                    <option value="Analyst">Analyst (Data Access)</option>
                  </select>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-zinc-950 bg-emerald-500 hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (isLogin ? 'Sign in' : 'Create Account')}
              </button>
            </div>
          </form>
          
          <div className="mt-6 flex flex-col space-y-4">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
            
            {isLogin && (
              <button
                type="button"
                onClick={autofillAdmin}
                className="text-xs text-emerald-500 hover:text-emerald-400 border border-emerald-900/50 rounded-xl py-2 w-full transition-colors"
              >
                Quick Login as Admin
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
