import { useEffect, useState } from 'react';

const useFetch = (url, options) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const res = await fetch(url, { ...options, credentials: 'include' });
      const data = await res.json();

      setData(data);
    } catch (error) {
      //TODO:- make toast
      alert('something went wrong, please try again later');
      setError(error);
    }
  };

  useEffect(() => {
    fetchData();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, error };
};

export default useFetch;
