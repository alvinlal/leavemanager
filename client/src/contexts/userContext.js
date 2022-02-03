import React, { useEffect, useState } from 'react';
import useFetch from '../hooks/useFetch';
const UserContext = React.createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const { data } = useFetch(`${process.env.REACT_APP_API}/me`, {});

  useEffect(() => {
    setUser(data);
  }, [data]);

  return <>{user ? <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider> : <h1>Loading...</h1>}</>;
};

export { UserContext, UserProvider };
