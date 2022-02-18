import { useState } from 'react';

// sends data to server using a method and body
const useSend = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const send = async (url, options) => {
    const defaultOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      credentials: 'include',
    };
    try {
      setIsLoading(true);
      const res = await fetch(url, {
        ...defaultOptions,
        ...options,
      });

      setIsLoading(false);
      return await res.json();
    } catch (error) {
      setError(error);
      //show toast
      alert('something went wrong, please try again later');
      return { data: null };
    } finally {
      setIsLoading(false);
    }
  };

  return { send, isLoading, error };
};

export default useSend;
