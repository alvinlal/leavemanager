import useUser from '../hooks/useUser';
import AdminDashBoard from './AdminDashBoard';
import UserDashBoard from './UserDashBoard';

const Home = () => {
  const { user } = useUser();

  const renderDashBoad = () => {
    if (user.user_type === 'TEACHER' || user.user_type === 'STAFF') return <UserDashBoard />;
    if (user.user_type === 'ADMIN') return <AdminDashBoard />;
  };

  return <>{renderDashBoad()}</>;
};

export default Home;
