import { useRoutes, Navigate } from 'react-router-dom';
import Home from '@routes/Home';
import Login from '@routes/Login';
import Register from '@routes/Register';
import Dashboard from '@routes/Dashboard';
import Document from '@routes/Document';

interface RoutesProps {
  signedIn: boolean;
}

export const Routes = ({signedIn}: RoutesProps) => {
  const routes = useRoutes([
    {
      path: '*',
      element: signedIn?<Navigate to='/dashboard' />:<Navigate to='/' />
    },
    {
      path: '/',
      element: signedIn?<Navigate to='/dashboard' />:<Home />
    },
    {
      path: '/login',
      element: signedIn?<Navigate to='/dashboard' />:<Login />
    },
    {
      path: '/register',
      element: signedIn?<Navigate to='/dashboard' />:<Register />
    },
    {
      path: '/dashboard',
      element: signedIn?<Dashboard />:<Navigate to='/login' />
    },
    {
      path: '/document',
      element: signedIn?<Document />:<Navigate to='/login' />
    },
  ]);
  return <>{routes}</>;
}
