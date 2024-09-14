import { useRoutes, Navigate } from 'react-router-dom';
import { Home } from '@routes/Home';
import Login from '@routes/Login';
import Register from '@routes/Register';

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
    }
  ]);
  return <>{routes}</>;
}
