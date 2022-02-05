import React, { useEffect, useState } from 'react';
import Error from '../components/Error';
import useFetch from '../hooks/useFetch';
const UserContext = React.createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const { data, error } = useFetch(`${process.env.REACT_APP_API}/me`, {});

  useEffect(() => {
    setUser(data);
  }, [data]);

  const renderApp = () => {
    if (user) {
      return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
    }
    if (error) {
      return <Error />;
    }
    return <h1>Loading...</h1>;
  };

  return <>{renderApp()}</>;
};

export { UserContext, UserProvider };
