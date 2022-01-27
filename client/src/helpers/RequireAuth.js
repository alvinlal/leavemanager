import useUser from '../hooks/useUser';
import { useLocation, Navigate } from 'react-router-dom';

const RequireAuth = ({ children }) => {
  const { user } = useUser();
  const { pathname } = useLocation();

  if (!user.isLoggedIn) {
    return <Navigate to='/login' state={{ from: pathname }} replace />;
  }

  return children;
};

export default RequireAuth;
