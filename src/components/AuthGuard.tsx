import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import useAuthStore from '@/stores/auth.store';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }: AuthGuardProps): React.ReactNode => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loading, checkAuth } = useAuthStore();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!isAuthenticated && token) {
      checkAuth();
    } else if (!isAuthenticated && !token && location.pathname !== '/login') {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, checkAuth, navigate, location]);

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated && location.pathname !== '/login') {
    navigate('/login', { replace: true });
    return null;
  }

  return <>{children}</>;
};

export default AuthGuard;
