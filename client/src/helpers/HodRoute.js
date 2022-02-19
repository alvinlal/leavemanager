import { Navigate } from 'react-router-dom';
import useUser from '../hooks/useUser';

const HodRoute = ({ children }) => {
  const { user } = useUser();

  if (!user.isHOD) {
    return <Navigate to='/' replace />;
  }

  return children;
};

export default HodRoute;
