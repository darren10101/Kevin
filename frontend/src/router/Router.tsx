import { useRoutes, Navigate } from 'react-router-dom';
import Home from '@routes/Home';
import Login from '@routes/Login';
import Register from '@routes/Register';
import Dashboard from '@routes/Dashboard';

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
      path: '/login',
      element: <Login />
    },
    {
      path: '/register',
      element: <Register />
    },
    {
      path: '/dashboard',
      element: <Dashboard />
    }
  ]);
  return <>{routes}</>;
}
