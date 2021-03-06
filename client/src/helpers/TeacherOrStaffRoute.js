import { Navigate } from 'react-router-dom';
import useUser from '../hooks/useUser';

const TeacherOrStaffRoute = ({ children }) => {
  const { user } = useUser();

  if (user.user_type !== 'TEACHER' && user.user_type !== 'STAFF') {
    return <Navigate to='/' replace />;
  }

  return children;
};

export default TeacherOrStaffRoute;
