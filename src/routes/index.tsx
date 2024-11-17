import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';

import AuthGuard from '@/components/AuthGuard';
import DashboardLayout from '@/layouts/DashboardLayout';
import Dashboard from '@/pages/Dashboard';
import Homepage from '@/pages/Homepage';
import Login from '@/pages/Login';
import Places from '@/pages/Places';
import Projects from '@/pages/Projects';
import Users from '@/pages/Users';
import ErrorPage from '@/pages/ErrorPage';
import PropertyTypes from '@/pages/PropertyType';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <AuthGuard>{children}</AuthGuard>;
};

const router = createBrowserRouter([
  {
    path: '/',
    children: [
      {
        index: true,
        element: <Homepage />,
      },
      {
        path: 'error',
        element: <ErrorPage />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: 'projects',
            element: <Projects />,
          },
          {
            path: 'property-types',
            element: <PropertyTypes />,
          },
          {
            path: 'places',
            element: <Places />,
          },
          {
            path: 'users',
            element: <Users />,
          },
        ],
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
