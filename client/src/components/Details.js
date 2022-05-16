import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
// import useUser from '../hooks/useUser';
import useFetch from '../hooks/useFetch';
import useSend from '../hooks/useSend';
import Spinner from './Spinner';
import { ExclamationIcon } from '@heroicons/react/outline';

const Details = () => {
  // const [departments, setDepartments] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  // const [data, departmentError, isDepartmentsLoading] = useFetch(`${process.env.REACT_APP_API}/departments`, {});
  const [formValues, error, isFormValuesLoading] = useFetch(`${process.env.REACT_APP_API}/user/details`, {});
  const { send, isLoading } = useSend();
  // const { user } = useUser();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm({
    mode: 'onChange',
  });
  var timeoutId;

  const onSubmit = async (userDetails) => {
    const { data } = await send(`${process.env.REACT_APP_API}/user/details`, { method: 'PUT', body: JSON.stringify(userDetails) });
    if (data) {
      reset(data);
      setSuccessMessage('Updated Successfully 👍');
      timeoutId = setTimeout(() => setSuccessMessage(''), 2000);
    }
  };

  // const renderDepartmentOptions = () => {
  //   if (isDepartmentsLoading) {
  //     // show pulse animation
  //     return <option>Loading...</option>;
  //   }
  //   if (departmentError) {
  //     return (
  //       <option className='text-red-900' disabled>
  //         Something went wrong, please try again later
  //       </option>
  //     );
  //   }
  //   if (departments) {
  //     return departments
  //       .filter((department) => department.dept_status)
  //       .map((department, index) => (
  //         <option key={index} value={department.dept_id}>
  //           {department.dept_name}
  //         </option>
  //       ));
  //   }
  // };

  const renderForm = () => {
    if (isFormValuesLoading) {
      return <div className='h-[250px] w-auto animate-pulse rounded-md bg-slate-300 md:w-[600px]'></div>;
    } else if (formValues) {
      return (
        <form onSubmit={handleSubmit(onSubmit)} className='flex  w-auto flex-col flex-wrap items-center justify-between md:w-[600px] md:flex-row'>
          <div className='relative  h-20 w-auto'>
            <input
              type='text'
              className={`peer h-10 w-[260px] rounded-[3px] border-2  p-3 text-sm font-bold ${errors.firstname ? 'border-red-600' : 'border-secondary focus:border-accent'} `}
              {...register('firstname', { required: true })}
            />
            <span className='pointer-events-none absolute  -top-[10px] left-4 bg-white p-1 text-xs text-[#909090]'>Firstname</span>
            {errors.firstname && <p className='mt-2 ml-2 text-sm font-medium text-red-600 '>Firstname is required!</p>}
          </div>
          <div className='relative   h-20 w-auto'>
            <input
              type='text'
              className={`peer h-10 w-[260px] rounded-[3px] border-2  p-3 text-sm font-bold ${errors.lastname ? 'border-red-600' : 'border-secondary focus:border-accent'} `}
              {...register('lastname', { required: true })}
            />
            <span className='pointer-events-none absolute  -top-[10px] left-4 bg-white p-1 text-xs text-[#909090]'>Lastname</span>
            {errors.lastname && <p className='mt-2 ml-2 text-sm font-medium text-red-600 '>Lastname is required!</p>}
          </div>
          {/* <div className='relative h-20 w-auto'>
            <select
              className={`h-10 w-[260px] rounded-[3px] border-2 bg-white indent-3 text-sm font-bold outline-none ${
                errors.teacher_designation ? 'border-red-600' : 'border-secondary focus:border-accent'
              }`}
              {...register('designation', { required: true })}
            >
              {user.user_type === 'TEACHER' ? (
                <>
                  <option>Prof</option>
                  <option>Asst.Prof</option>
                  <option>HOD</option>
                </>
              ) : (
                <>
                  <option>Accountant</option>
                  <option>Administrator</option>
                  <option>Clerk</option>
                  <option>Librarian</option>
                </>
              )}
            </select>
            {errors.designation && <p className='mt-2 ml-2 text-sm font-medium text-red-600'>Please select a designation</p>}
          </div> */}
          {/* {user.user_type === 'TEACHER' && (
            <div className='relative  h-20 w-auto'>
              <select
                className={`h-10 w-[300px]  rounded-[3px] border-2 border-secondary bg-white indent-3 text-sm font-bold outline-none ${
                  errors.dept_id ? 'border-red-600' : 'border-secondary focus:border-accent'
                }`}
                {...register('dept_id', { required: true, valueAsNumber: true })}
              >
                <option hidden value={formValues.dept_id}>
                  {formValues.dept_name}
                </option>
                {renderDepartmentOptions()}
              </select>
              {errors.dept_id && <p className='mt-2 ml-2 text-sm font-medium text-red-600'>Please select a department</p>}
            </div>
          )} */}
          <div className='mt-6 flex w-full flex-col items-center justify-start md:flex-row'>
            <button
              disabled={!isValid || !isDirty || Object.keys(errors).length !== 0 || isLoading}
              type='submit'
              className='flex h-8 w-[100px] cursor-pointer items-center justify-center border-2 border-secondary p-3 font-bold text-primary disabled:cursor-not-allowed disabled:text-secondary '
            >
              {isLoading && <Spinner />}
              {isLoading ? 'Saving' : 'Save'}
            </button>
            {successMessage && <p className='ml-3 mt-3 text-base font-bold text-green-400 md:mt-0'>{successMessage}</p>}
          </div>
        </form>
      );
    }
  };

  useEffect(() => {
    // setDepartments(data);
    reset(formValues);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [formValues, reset, timeoutId]);

  return (
    <div className='align-start flex flex-col justify-start p-5 md:py-6 md:px-9'>
      {error ? (
        <div className='m-auto flex flex-col items-center text-center font-bold text-orange-600 md:flex-row'>
          <ExclamationIcon className='mr-2 h-8 w-8  text-orange-600' />
          Something went wrong on our side, Please try again later.
        </div>
      ) : (
        <>
          <h1 className='mb-10 text-2xl font-bold text-primary md:text-3xl'>Your Details</h1>
          {renderForm()}
        </>
      )}
    </div>
  );
};

export default Details;
