import { useLocation } from 'react-router-dom';
import useUser from '../hooks/useUser';

const Header = ({ toggleMenu }) => {
  const { user } = useUser();
  const { pathname } = useLocation();

  return (
    <>
      {pathname === '/login' ? (
        <header className='flex h-[90px] w-full items-center justify-center border-2 border-secondary'>
          <div className='flex h-[60px] w-[240px] items-center justify-center rounded-md bg-primary '>
            <h1 className='text-2xl font-bold text-white'>LEAVEMANAGER</h1>
          </div>
        </header>
      ) : (
        <>
          <header className='flex h-16 w-full items-center border-2 border-secondary px-5 py-3 md:h-[90px]'>
            <div className='flex h-8 w-9 cursor-pointer flex-col justify-between md:hidden' onClick={() => toggleMenu(true)}>
              <span className='h-[6px] w-full bg-primary'></span>
              <span className='h-[6px] w-full bg-primary'></span>
              <span className='h-[6px] w-full bg-primary'></span>
            </div>
            <div className='m-auto my-2 flex h-[46px] w-[186px] items-center justify-center rounded-md bg-primary md:hidden'>
              <h1 className='text-lg font-bold text-white'>LEAVEMANAGER</h1>
            </div>
            <p className='ml-auto hidden text-xl text-primary md:block'>Hello, {user.name}</p>
          </header>
        </>
      )}
    </>
  );
};

export default Header;
