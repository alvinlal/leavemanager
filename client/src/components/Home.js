import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useUser from '../hooks/useUser';
import AdminDashBoard from './AdminDashBoard';
import TeacherDashBoard from './TeacherDashBoard';
import StaffDashBoard from './StaffDashBoard';

const Home = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const performRedirect = () => {
    if (!user.isLoggedIn) {
      navigate('/login');
    }
  };

  const renderDashBoad = () => {
    if (user.type === 'TEACHER') return <TeacherDashBoard />;
    if (user.type === 'ADMIN') return <AdminDashBoard />;
    if (user.type === 'STAFF') return <StaffDashBoard />;
  };

  useEffect(() => {
    performRedirect();
  });

  return <>{renderDashBoad()}</>;
};

export default Home;
