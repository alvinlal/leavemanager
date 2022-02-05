import { useState } from 'react';

// sends data to server using a method and body
const useSend = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const send = async (url, body, method = 'POST') => {
    try {
      setIsLoading(true);
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(body),
      });
      setIsLoading(false);
      return await res.json();
    } catch (error) {
      setError(error);
      return { data: null };
    } finally {
      setIsLoading(false);
    }
  };

  return { send, isLoading, error };
};

export default useSend;
