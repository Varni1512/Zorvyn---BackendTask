import { useAuth } from '../../store/auth';
import { LogOut, User as UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 transition-all duration-300">
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-semibold text-gray-800 hidden sm:block">Welcome back, {user?.name}</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-zinc-50 px-3 py-1.5 border border-zinc-200 rounded-full">
          <div className="bg-emerald-100 p-1 rounded-full">
            <UserIcon className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-sm font-medium text-gray-700">{user?.role}</span>
        </div>
        
        <button 
          onClick={handleLogout}
          className="p-2 text-zinc-500 hover:text-red-600 hover:bg-red-50 transition-colors rounded-full"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
