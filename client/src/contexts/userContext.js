import React, { useEffect, useState } from 'react';

const UserContext = React.createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const getUser = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API}/me`, {
        credentials: 'include',
      });
      const data = await res.json();
      setUser(data);
    } catch (error) {
      // TODO :- redirect to error page
      alert('something went wrong, please try again later');
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <>
      {user ? (
        <UserContext.Provider value={{ user, setUser }}>
          {children}
        </UserContext.Provider>
      ) : (
        <h1>Loading...</h1>
      )}
    </>
  );
};

export { UserContext, UserProvider };
