import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './store/auth';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Records from './pages/Records';
import UserManagement from './pages/UserManagement';
import { useAuth } from './store/auth';
import ProtectedRoute from './components/layout/ProtectedRoute';

const queryClient = new QueryClient();

const ProtectedRecords = () => {
  const { user } = useAuth();
  if (user?.role === 'Viewer') return <Navigate to="/" replace />;
  return <Records />;
};

const ProtectedUsers = () => {
  const { user } = useAuth();
  if (user?.role !== 'Admin') return <Navigate to="/" replace />;
  return <UserManagement />;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="records" element={<ProtectedRecords />} />
                <Route path="users" element={<ProtectedUsers />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
