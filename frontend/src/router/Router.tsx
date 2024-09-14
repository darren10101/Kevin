import { useRoutes, Navigate } from 'react-router-dom';
import { Home } from '@routes/Home';

export const Routes = () => {
  const routes = useRoutes([
    {
      path: '*',
      element: <Navigate to="/" replace />
    },
    {
      path: '/',
      element: <Home />
    }
  ]);
  return <>{routes}</>;
}
