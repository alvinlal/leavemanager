import { useLocation } from 'react-router-dom';
import Header from './Header';
import { useState } from 'react';
import Menu from './Menu';

const Base = ({ children }) => {
  const { pathname } = useLocation();
  const [menuVisible, setMenuVisible] = useState(false);
  const changePassPattern = /^\/user\/change-password\/./;

  return (
    <>
      {pathname !== '/forgotpassword' && pathname !== '/404' && !changePassPattern.test(pathname) && <Header toggleMenu={setMenuVisible} />}
      {pathname !== '/login' && pathname !== '/forgotpassword' && pathname !== '/404' && !changePassPattern.test(pathname) && (
        <Menu menuVisible={menuVisible} toggleMenu={setMenuVisible} />
      )}
      <div className={`${pathname !== '/login' && pathname !== '/forgotpassword' && !changePassPattern.test(pathname) && 'md:ml-[270px] '}`}>{children}</div>
    </>
  );
};

export default Base;
