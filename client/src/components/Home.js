import useUser from '../hooks/useUser';
import AdminDashBoard from './AdminDashBoard';
import TeacherDashBoard from './TeacherDashBoard';
import StaffDashBoard from './StaffDashBoard';

const Home = () => {
  const { user } = useUser();

  const renderDashBoad = () => {
    if (user.type === 'TEACHER') return <TeacherDashBoard />;
    if (user.type === 'ADMIN') return <AdminDashBoard />;
    if (user.type === 'STAFF') return <StaffDashBoard />;
  };

  return <>{renderDashBoad()}</>;
};

export default Home;
