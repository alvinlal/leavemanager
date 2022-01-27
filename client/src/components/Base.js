import { useLocation } from 'react-router-dom';
import Header from './Header';
import { useState } from 'react';
import Menu from './Menu';

const Base = ({ children }) => {
  const { pathname } = useLocation();
  const [menuVisible, setMenuVisible] = useState(false);
  return (
    <>
      <Header toggleMenu={setMenuVisible} />
      {pathname !== '/login' && <Menu menuVisible={menuVisible} toggleMenu={setMenuVisible} />}
      <div className={`${pathname !== '/login' && 'ml-[270px] '}`}>{children}</div>
    </>
  );
};

export default Base;
