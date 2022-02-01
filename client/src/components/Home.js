import useUser from '../hooks/useUser';
import AdminDashBoard from './AdminDashBoard';
import TeacherDashBoard from './TeacherDashBoard';
import StaffDashBoard from './StaffDashBoard';

const Home = () => {
  const { user } = useUser();

  const renderDashBoad = () => {
    if (user.user_type === 'TEACHER') return <TeacherDashBoard />;
    if (user.user_type === 'ADMIN') return <AdminDashBoard />;
    if (user.user_type === 'STAFF') return <StaffDashBoard />;
  };

  return <>{renderDashBoad()}</>;
};

export default Home;
