import { useEffect } from 'react';
import AppRouter from '@/routes';
import useAuthStore from '@/stores/auth.store';

const App = () => {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      checkAuth();
    }
  }, [checkAuth]);

  return <AppRouter />;
};

export default App;
