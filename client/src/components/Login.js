import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import useUser from '../hooks/useUser';

const Login = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const { user, setUser } = useUser();
  console.log(user);
  const onSubmit = async (data) => {
    const { email, password } = data;
    try {
      const data = await fetch(`${process.env.REACT_APP_API}/login`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email,
          password,
        }),
      });
      const res = await data.json();
      if (res.error) {
        setError(res.errmsg + '!');
      } else {
        setUser(res.user);
      }
    } catch (error) {
      // TODO : add toast notification
      alert('something went wrong, please try again later');
    }
  };

  useEffect(() => {
    if (user.isLoggedIn) {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <div className='w-full h-[calc(100vh-90px)] flex justify-center items-center'>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='w-[350px] h-[455px] border-2 border-gray-300 m-auto rounded-md flex flex-col items-center justify-between py-8'
      >
        <h1 className='text-primary text-4xl font-bold'>Login</h1>
        <input
          type='email'
          placeholder='Email'
          required
          className='w-[300px] h-12 border-2 border-gray-300 rounded-md p-3 focus:border-accent'
          {...register('email')}
        />
        <input
          type='text'
          placeholder='Password'
          required
          className='w-[300px] h-12 border-2 border-gray-300 rounded-md p-3 focus:border-accent'
          {...register('password')}
        />
        <p className='text-red-500 font-semibold'>{error}</p>
        <button
          type='submit'
          className='w-60 h-[60px] text-white font-bold p-4 rounded-md bg-primary text-2xl'
        >
          LOGIN
        </button>
      </form>
    </div>
  );
};

export default Login;
