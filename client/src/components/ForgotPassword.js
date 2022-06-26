import { useState } from 'react';
import { useForm } from 'react-hook-form';

const ForgotPassword = () => {
  const { register, handleSubmit } = useForm();
  const [message, setMessage] = useState('Enter your registered email to recieve a link for changing your password');
  const [status, setStatus] = useState('');

  const onSubmit = async ({ email }) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API}/forgotpassword`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email }),
      }).then((res) => res.json());
      if (res.success) {
        setMessage(`An email has been sent to the entered email with a link to reset your password.`);
        setStatus('success');
      } else {
        setMessage('email is not registered!');
        setStatus('failure');
      }
    } catch (err) {
      alert('something went wrong, please try again later');
    }
  };

  return (
    <div className='flex h-screen w-full items-center justify-center'>
      <form onSubmit={handleSubmit(onSubmit)} className='m-auto  flex h-[400px] w-full flex-col items-center justify-between rounded-md border-2 border-gray-300 p-8 md:w-[350px] '>
        <p className={`text-center font-medium ${status === 'success' && 'text-green-500'} ${status === 'failure' && 'text-red-500'}`}>{message}</p>
        <input type='email' placeholder='Email' required className='h-12 w-[300px] rounded-md border-2 border-gray-300 p-3 focus:border-accent' {...register('email')} />
        <button
          type='submit'
          className='flex h-[60px] w-full items-center justify-center rounded-md bg-primary p-4 text-xl font-bold text-white disabled:cursor-not-allowed disabled:bg-secondary'
        >
          CHANGE PASSWORD
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
