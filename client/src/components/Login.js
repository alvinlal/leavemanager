import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import useSend from '../hooks/useSend';
import useUser from '../hooks/useUser';
import Spinner from './Spinner';

const Login = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const { user, setUser } = useUser();
  const { send, isLoading } = useSend();
  const location = useLocation();

  const from = location.state?.from || '/';

  const onSubmit = async (data) => {
    const { email, password } = data;
    try {
      const { data, error } = await send(`${process.env.REACT_APP_API}/login`, { body: JSON.stringify({ email, password }) });
      if (error) {
        setError(error + '!');
      } else if (data) {
        setUser(data);
      }
    } catch (error) {
      // TODO : add toast notification
      alert('something went wrong, please try again later');
    }
  };

  useEffect(() => {
    if (user.isLoggedIn) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  return (
    <div className='flex h-[calc(100vh-90px)] w-full items-center justify-center'>
      <form onSubmit={handleSubmit(onSubmit)} className='m-auto flex h-[455px] w-[350px] flex-col items-center justify-between rounded-md border-2 border-gray-300 py-8'>
        <h1 className='text-4xl font-bold text-primary'>Login</h1>
        <input type='email' placeholder='Email' required className='h-12 w-[300px] rounded-md border-2 border-gray-300 p-3 focus:border-accent' {...register('email')} />
        <input type='password' placeholder='Password' required className='h-12 w-[300px] rounded-md border-2 border-gray-300 p-3 focus:border-accent' {...register('password')} />
        <p className='font-semibold text-red-500'>{error}</p>
        <p className='cursor-pointer text-blue-500' onClick={() => navigate('/forgotpassword')}>
          Forgot password ?
        </p>
        <button
          disabled={isLoading}
          type='submit'
          className='flex h-[60px] w-60 items-center justify-center rounded-md bg-primary p-4 text-2xl font-bold text-white disabled:cursor-not-allowed disabled:bg-secondary'
        >
          {isLoading && <Spinner />}
          LOGIN
        </button>
      </form>
    </div>
  );
};

export default Login;
