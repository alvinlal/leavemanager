import useUser from '../hooks/useUser';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const { user } = useUser();

  if (user.type !== 'ADMIN') {
    return <Navigate to='/' replace />;
  }

  return children;
};

export default AdminRoute;
