import useUser from '../hooks/useUser';
import useDeviceDetect from '../hooks/useDeviceDetect';
import { HomeIcon, UserGroupIcon, UserIcon, UserCircleIcon, DocumentTextIcon, LogoutIcon, XIcon, ChevronRightIcon } from '@heroicons/react/outline';
import { useNavigate, useLocation } from 'react-router-dom';

const Menu = ({ menuVisible, toggleMenu }) => {
  const { user, setUser } = useUser();
  const isMobile = useDeviceDetect();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const logOut = async () => {
    try {
      await fetch(`${process.env.REACT_APP_API}/logout`, { credentials: 'include' });
      setUser({ isLoggedIn: false });
      navigate('/');
    } catch (error) {
      // TODO:- make toast
      console.log(error);
      alert('Something went wrong, please try again later');
    }
  };

  const showComponent = (componentLink) => {
    if (isMobile) {
      toggleMenu(false);
    }
    navigate(componentLink);
  };

  const renderMenuOptions = () => {
    if (user.user_type === 'ADMIN') {
      return (
        <>
          <div onClick={() => showComponent('/')} className='flex h-[70px] w-[270px] cursor-pointer items-center px-6 py-3 text-white hover:bg-[#6C6E94]'>
            <div className='flex h-[46px] w-[42px] items-center justify-center rounded-[5px] bg-[#3E4173]'>
              <HomeIcon className='h-7 w-7 text-white' />
            </div>
            <p className='ml-4 text-lg'>DashBoard</p>
            {pathname === '/' && <ChevronRightIcon className='ml-auto hidden h-9 w-9 md:block' />}
          </div>
          <div onClick={() => showComponent('/departments')} className='flex h-[70px] w-[270px] cursor-pointer items-center px-6 py-3 text-white hover:bg-[#6C6E94]'>
            <div className='flex h-[46px] w-[42px] items-center justify-center rounded-[5px] bg-[#3E4173]'>
              <UserGroupIcon className='h-7 w-7 text-white' />
            </div>
            <p className='ml-4 text-lg'>Departments</p>
            {pathname === '/departments' && <ChevronRightIcon className='ml-auto hidden h-9 w-9 md:block' />}
          </div>
          <div onClick={() => showComponent('/teachers')} className='flex h-[70px] w-[270px] cursor-pointer items-center px-6 py-3 text-white hover:bg-[#6C6E94]'>
            <div className='flex h-[46px] w-[42px] items-center justify-center rounded-[5px] bg-[#3E4173]'>
              <UserIcon className='h-7 w-7 text-white' />
            </div>
            <p className='ml-4 text-lg'>Teachers</p>
            {pathname === '/teachers' && <ChevronRightIcon className='ml-auto hidden h-9 w-9 md:block' />}
          </div>
          <div onClick={() => showComponent('/staffs')} className='flex h-[70px] w-[270px] cursor-pointer items-center px-6 py-3 text-white hover:bg-[#6C6E94]'>
            <div className='flex h-[46px] w-[42px] items-center justify-center rounded-[5px] bg-[#3E4173]'>
              <UserCircleIcon className='h-7 w-7 text-white' />
            </div>
            <p className='ml-4 text-lg'>Staffs</p>
            {pathname === '/staffs' && <ChevronRightIcon className='ml-auto hidden h-9 w-9 md:block' />}
          </div>
          <div onClick={() => showComponent('/reports')} className='flex h-[70px] w-[270px] cursor-pointer items-center px-6 py-3 text-white hover:bg-[#6C6E94]'>
            <div className='flex h-[46px] w-[42px] items-center justify-center rounded-[5px] bg-[#3E4173]'>
              <DocumentTextIcon className='h-7 w-7 text-white' />
            </div>
            <p className='ml-4 text-lg'>Reports</p>
            {pathname === '/reports' && <ChevronRightIcon className='ml-auto hidden h-9 w-9 md:block' />}
          </div>
          <div onClick={logOut} className='mt-14 flex h-[70px] w-[270px] cursor-pointer items-center px-6 py-3 text-white hover:bg-[#6C6E94]'>
            <div className='flex h-[46px] w-[42px] items-center justify-center rounded-[5px] bg-[#3E4173]'>
              <LogoutIcon className='h-7 w-7 text-white' />
            </div>
            <p className='ml-4 text-lg'>Logout</p>
          </div>
        </>
      );
    }
    if (user.user_type === 'TEACHER') {
    }
    if (user.user_type === 'STAFF') {
    }
  };

  return (
    <div className={`${!menuVisible && 'hidden'} fixed  left-0 top-0 z-30 h-[100vh] w-full overflow-y-auto  overflow-x-hidden bg-primary md:block md:w-[270px]`}>
      <div className='m-auto my-5 hidden h-[46px] w-[186px] items-center justify-center rounded-md bg-[#3E4173] md:flex '>
        <h1 className='text-lg font-bold text-white'>LEAVEMANAGER</h1>
      </div>
      <div onClick={() => toggleMenu(false)} className='ml-auto mt-4 mr-7 flex h-9 w-9 items-center justify-center rounded-[5px] bg-[#3E4173] hover:cursor-pointer md:hidden'>
        <XIcon className='h-7 w-7 text-white' />
      </div>
      <div className='mt-[76px] flex h-auto w-full flex-col items-center justify-center'>{renderMenuOptions()}</div>
    </div>
  );
};

export default Menu;
