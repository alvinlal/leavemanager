import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import useSend from '../hooks/useSend';
import Spinner from './Spinner';

const ChangePassword = () => {
  const {
    register,
    handleSubmit,
    getValues,
    trigger,
    watch,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onChange',
  });
  const { send, isLoading } = useSend();
  const { token } = useParams();
  const [successMessage, setSuccessMessage] = useState('');
  const watchPassword = watch('password');

  const onSubmit = async (details) => {
    const { error } = await send(`${process.env.REACT_APP_API}/changepassword`, {
      method: 'POST',
      body: JSON.stringify({ newPassword: details.password, token }),
    });
    if (error) {
      alert('token expired');
    } else {
      setSuccessMessage('Updated successfully 👍');
    }
  };

  useEffect(() => {
    trigger('confirm_password'); // retriggers validation
  }, [watchPassword, trigger]);

  return (
    <div className='flex w-full flex-col   justify-center p-5 md:py-6 md:px-9'>
      <form onSubmit={handleSubmit(onSubmit)} className='m-auto flex h-[400px] w-full flex-col items-center justify-between rounded-md border-2 border-gray-300 py-8 md:w-[350px] '>
        <h1 className='mb-8 text-xl font-bold text-primary'>Change Password</h1>
        <input
          type='password'
          placeholder='New Password'
          required
          className='h-12 w-[300px] rounded-md border-2 border-gray-300 p-3 focus:border-accent'
          {...register('password', {
            required: 'Password is required',
            validate: {
              isValidPassword: (password) => password.indexOf(' ') < 0 && password.length >= 6,
            },
          })}
        />
        <p className='ml-2 h-16 justify-center p-3 text-center text-sm font-medium text-red-600'>
          {errors.password && (errors.password.type === 'isValidPassword' ? 'password should be atleast 6 characters with no white space' : errors.password.message)}
        </p>
        <input
          type='password'
          placeholder='Confirm new password'
          required
          className='h-12 w-[300px] rounded-md border-2 border-gray-300 p-3 focus:border-accent'
          {...register('confirm_password', {
            validate: {
              isSame: (confirm_password) => confirm_password === getValues()['password'],
            },
          })}
        />
        {successMessage && !errors.password && !errors.confirm_password ? (
          <p className='ml-2 h-16 justify-center p-3 text-center text-sm  font-bold text-green-400'>{successMessage}</p>
        ) : (
          <p className='ml-2 h-16 justify-center p-3 text-center text-sm font-medium text-red-600'>
            {errors.confirm_password && !errors.password && (errors.confirm_password.type === 'isSame' ? "Password's don't match" : errors.confirm_password.message)}
          </p>
        )}

        <div className='mt-6 flex w-full flex-col items-center justify-start '>
          <button
            disabled={!isValid || isLoading}
            type='submit'
            className='flex h-8 w-[100px] cursor-pointer items-center justify-center border-2 border-secondary p-3 font-bold text-primary disabled:cursor-not-allowed disabled:text-secondary '
          >
            {isLoading && <Spinner />}
            {isLoading ? 'Saving' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
