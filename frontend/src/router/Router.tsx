import { useRoutes, Navigate } from 'react-router-dom';
import { Home } from '@routes/Home';
import { Dashboard } from '@routes/Dashboard';

export const Routes = () => {
  const routes = useRoutes([
    {
      path: '*',
      element: <Navigate to="/" replace />
    },
    {
      path: '/',
      element: <Home />
    },
    {
      path: '/dashboard',
      element: <Dashboard />
    }
  ]);
  return <>{routes}</>;
}
