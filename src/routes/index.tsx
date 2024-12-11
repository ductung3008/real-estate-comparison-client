import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import AuthGuard from '@/components/AuthGuard';
import LoadingScreen from '@/components/LoadingScreen';

const Dashboard = React.lazy(() => import('@/pages/Dashboard'));
const DashboardLayout = React.lazy(() => import('@/layouts/DashboardLayout'));
const ErrorPage = React.lazy(() => import('@/pages/ErrorPage'));
const Homepage = React.lazy(() => import('@/pages/Homepage'));
const HomepageLayout = React.lazy(() => import('@/layouts/HomepageLayout'));
const Login = React.lazy(() => import('@/pages/Login'));
const Places = React.lazy(() => import('@/pages/Places'));
const ProjectDetail = React.lazy(() => import('@/pages/ProjectDetail'));
const Projects = React.lazy(() => import('@/pages/Projects'));
const PropertyTypes = React.lazy(() => import('@/pages/PropertyType'));
const Users = React.lazy(() => import('@/pages/Users'));

const AppRouter = () => {
  return (
    <Router>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/" element={<HomepageLayout />}>
            <Route index element={<Homepage />} />
            <Route path="project/:name" element={<ProjectDetail />} />
          </Route>

          <Route path="error" element={<ErrorPage />} />

          <Route path="login" element={<Login />} />

          <Route
            path="dashboard"
            element={
              <AuthGuard>
                <DashboardLayout />
              </AuthGuard>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="projects" element={<Projects />} />
            <Route path="property-types" element={<PropertyTypes />} />
            <Route path="places" element={<Places />} />
            <Route path="users" element={<Users />} />
          </Route>

          {/* Catch-all route to redirect to homepage */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default AppRouter;
