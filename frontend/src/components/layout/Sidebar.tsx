import { NavLink } from 'react-router-dom';
import { LayoutDashboard, WalletCards } from 'lucide-react';
import { useAuth } from '../../store/auth';
import clsx from 'clsx';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
];

const Sidebar = () => {
  const { user } = useAuth();

  return (
    <aside className="w-64 bg-zinc-950 text-white flex flex-col h-screen sticky top-0 border-r border-zinc-800">
      <div className="p-6">
        <h2 className="text-2xl font-bold flex items-center gap-2 tracking-tight">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <WalletCards className="w-5 h-5 text-zinc-950" />
          </div>
          Zoryn
        </h2>
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-6">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-200 font-medium',
                isActive
                  ? 'bg-zinc-900 text-white shadow-sm'
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
              )
            }
          >
            <item.icon className="w-5 h-5" />
            {item.name}
          </NavLink>
        ))}
        {user?.role !== 'Viewer' && (
          <NavLink
            to="/records"
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-200 font-medium',
                isActive
                  ? 'bg-zinc-900 text-white shadow-sm'
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
              )
            }
          >
            <WalletCards className="w-5 h-5" />
            Records
          </NavLink>
        )}
        {user?.role === 'Admin' && (
          <NavLink
            to="/users"
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-200 font-medium',
                isActive
                  ? 'bg-zinc-900 text-white shadow-sm'
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
              )
            }
          >
            <LayoutDashboard className="w-5 h-5" />
            User Management
          </NavLink>
        )}
      </nav>
      
      <div className="p-4 m-4 bg-zinc-900 border border-zinc-800 rounded-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-2 h-2 bg-emerald-500 animate-pulse"></div>
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">System Status</p>
        </div>
        <p className="text-sm text-zinc-300">All systems operational</p>
      </div>
    </aside>
  );
};

export default Sidebar;
