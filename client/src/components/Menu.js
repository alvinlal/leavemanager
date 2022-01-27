import useUser from '../hooks/useUser';
import useDeviceDetect from '../hooks/useDeviceDetect';
import { HomeIcon, UserGroupIcon, UserIcon, UserCircleIcon, DocumentTextIcon, LogoutIcon, XIcon } from '@heroicons/react/outline';
import { useNavigate } from 'react-router-dom';

const Menu = ({ menuVisible, toggleMenu }) => {
  const { user } = useUser();
  const isMobile = useDeviceDetect();
  const navigate = useNavigate();

  const signOut = () => {};

  const showComponent = (componentLink) => {
    if (isMobile) {
      toggleMenu(false);
    }
    navigate(componentLink);
  };

  const renderMenuOptions = () => {
    if (user.type === 'ADMIN') {
      return (
        <>
          <div onClick={() => showComponent('/')} className='flex h-[70px] w-[270px] cursor-pointer items-center px-6 py-3 text-white hover:bg-[#6C6E94]'>
            <div className='flex h-[46px] w-[42px] items-center justify-center rounded-[5px] bg-[#3E4173]'>
              <HomeIcon className='h-7 w-7 text-white' />
            </div>
            <p className='ml-4 text-lg'>DashBoard</p>
          </div>
          <div onClick={() => showComponent('/departments')} className='flex h-[70px] w-[270px] cursor-pointer items-center px-6 py-3 text-white hover:bg-[#6C6E94]'>
            <div className='flex h-[46px] w-[42px] items-center justify-center rounded-[5px] bg-[#3E4173]'>
              <UserGroupIcon className='h-7 w-7 text-white' />
            </div>
            <p className='ml-4 text-lg'>Departments</p>
          </div>
          <div onClick={() => showComponent('/teachers')} className='flex h-[70px] w-[270px] cursor-pointer items-center px-6 py-3 text-white hover:bg-[#6C6E94]'>
            <div className='flex h-[46px] w-[42px] items-center justify-center rounded-[5px] bg-[#3E4173]'>
              <UserIcon className='h-7 w-7 text-white' />
            </div>
            <p className='ml-4 text-lg'>Teachers</p>
          </div>
          <div onClick={() => showComponent('/staffs')} className='flex h-[70px] w-[270px] cursor-pointer items-center px-6 py-3 text-white hover:bg-[#6C6E94]'>
            <div className='flex h-[46px] w-[42px] items-center justify-center rounded-[5px] bg-[#3E4173]'>
              <UserCircleIcon className='h-7 w-7 text-white' />
            </div>
            <p className='ml-4 text-lg'>Staffs</p>
          </div>
          <div onClick={() => showComponent('/reports')} className='flex h-[70px] w-[270px] cursor-pointer items-center px-6 py-3 text-white hover:bg-[#6C6E94]'>
            <div className='flex h-[46px] w-[42px] items-center justify-center rounded-[5px] bg-[#3E4173]'>
              <DocumentTextIcon className='h-7 w-7 text-white' />
            </div>
            <p className='ml-4 text-lg'>Reports</p>
          </div>
          <div onClick={signOut} className='mt-14 flex h-[70px] w-[270px] cursor-pointer items-center px-6 py-3 text-white hover:bg-[#6C6E94]'>
            <div className='flex h-[46px] w-[42px] items-center justify-center rounded-[5px] bg-[#3E4173]'>
              <LogoutIcon className='h-7 w-7 text-white' />
            </div>
            <p className='ml-4 text-lg'>Signout</p>
          </div>
        </>
      );
    }
    if (user.type === 'TEACHER') {
    }
    if (user.type === 'STAFF') {
    }
  };

  return (
    <div className={`${!menuVisible && 'hidden'} fixed left-0 top-0 z-10 h-[100vh]  w-full bg-primary md:block md:w-[270px]`}>
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
