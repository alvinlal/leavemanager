import { XIcon } from '@heroicons/react/outline';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import useFetch from '../../hooks/useFetch';
import useSend from '../../hooks/useSend';
import Spinner from '../Spinner';

const TeacherModal = ({ handleClose, teachers, setTeachers, isEditing, defaultValues }) => {
  const [departments, setDepartments] = useState(null);
  const [data, error, isDepartmentsLoading] = useFetch(`${process.env.REACT_APP_API}/departments`, {});
  const { send, isLoading } = useSend();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isDirty, isValid },
  } = useForm({
    mode: 'onChange',
    defaultValues: isEditing ? defaultValues : { teacher_firstname: '', teacher_lastname: '', dept_id: '', teacher_designation: '', username: '' },
  });
  useEffect(() => {
    setDepartments(data);
  }, [data]);

  const addTeacher = async (teacherDetails) => {
    const { data, error } = await send(`${process.env.REACT_APP_API}/teachers`, {
      body: JSON.stringify({ ...teacherDetails, dept_name: getDepartmentName() }),
    });
    if (error) {
      if (error.username) {
        setError('username', { type: 'focus', message: error.username }, { shouldFocus: true });
      }
    } else if (data) {
      setTeachers([...teachers, data]);
      navigator.clipboard.writeText(data.password);
      // TODO:- make toast
      alert('Password has been copied to clipboard');
      handleClose();
      window.scrollTo(0, document.body.scrollHeight);
    }
  };

  const getDepartmentName = () => {
    const departmentSelect = document.getElementById('department');
    return departmentSelect.options[departmentSelect.selectedIndex].text;
  };

  const updateTeacher = async (teacherDetails) => {
    const { data } = await send(`${process.env.REACT_APP_API}/teachers`, { method: 'PUT', body: JSON.stringify(teacherDetails) });
    if (data) {
      setTeachers(
        teachers.map((teacher) =>
          teacher.teacher_id === data.teacher_id
            ? {
                ...teacher,
                teacher_firstname: data.teacher_firstname,
                teacher_lastname: data.teacher_lastname,
                Department: {
                  dept_name: getDepartmentName(),
                },
                teacher_designation: data.teacher_designation,
                dept_id: data.dept_id,
              }
            : teacher
        )
      );
    }
    handleClose();
  };

  const onSubmit = (teacherDetails) => {
    isEditing ? updateTeacher({ ...teacherDetails, teacher_id: defaultValues.teacher_id }) : addTeacher(teacherDetails);
  };

  const renderDepartmentOptions = () => {
    if (isDepartmentsLoading) {
      return <option>Loading...</option>;
    }
    if (error) {
      return (
        <option className='text-red-900' disabled>
          Something went wrong, please try again later
        </option>
      );
    }
    if (departments) {
      return (
        departments
          // eslint-disable-next-line
          .filter((department) => department.dept_status)
          .map((department, index) => (
            <option key={index} value={department.dept_id}>
              {department.dept_name}
            </option>
          ))
      );
    }
  };

  return (
    <div className='fixed left-0 right-0 bottom-0 z-40 flex h-screen w-screen items-center justify-center bg-black/25' onClick={handleClose}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex h-auto w-[400px] flex-col items-center justify-between rounded-[3px] bg-white p-6 drop-shadow-lg  md:w-[500px]'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='mb-6 flex w-full items-center justify-between'>
          <h1 className='text-lg font-bold text-primary'>{isEditing ? 'Edit Teacher' : 'New Teacher'}</h1>
          <button type='button' onClick={handleClose} disabled={isLoading} className='cursor-pointer hover:bg-secondary disabled:cursor-not-allowed'>
            <XIcon className={`h-8 w-8 ${isLoading ? 'text-secondary' : ''} `} />
          </button>
        </div>
        {!isEditing && (
          <div className='relative  h-20 w-auto'>
            <input
              type='text'
              className={`peer h-10 w-[330px] rounded-[3px] border-2  p-3 text-sm font-bold ${errors.username ? 'border-red-600' : 'border-secondary focus:border-accent'} `}
              {...register('username', {
                required: 'Email is required!',
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: 'Entered value does not match email format',
                },
              })}
            />
            <span className='pointer-events-none absolute  -top-[10px] left-4 bg-white p-1 text-xs text-[#909090]'>Email</span>
            {errors.username && <p className='mt-2 ml-2 text-sm font-medium text-red-600 '>{errors.username.message}</p>}
          </div>
        )}
        <div className='relative  h-20 w-auto'>
          <input
            type='text'
            className={`peer h-10 w-[330px] rounded-[3px] border-2  p-3 text-sm font-bold ${errors.teacher_firstname ? 'border-red-600' : 'border-secondary focus:border-accent'} `}
            {...register('teacher_firstname', { required: true })}
          />
          <span className='pointer-events-none absolute  -top-[10px] left-4 bg-white p-1 text-xs text-[#909090]'>Firstname</span>
          {errors.teacher_firstname && <p className='mt-2 ml-2 text-sm font-medium text-red-600 '>Firstname is required!</p>}
        </div>
        <div className='relative  h-20 w-auto'>
          <input
            type='text'
            className={`peer h-10 w-[330px] rounded-[3px] border-2  p-3 text-sm font-bold ${errors.teacher_lastname ? 'border-red-600' : 'border-secondary focus:border-accent'} `}
            {...register('teacher_lastname', { required: true })}
          />
          <span className='pointer-events-none absolute  -top-[10px] left-4 bg-white p-1 text-xs text-[#909090]'>Lastname</span>
          {errors.teacher_lastname && <p className='mt-2 ml-2 text-sm font-medium text-red-600 '>Lastname is required!</p>}
        </div>
        <div className='relative  h-20 w-auto'>
          <select
            id='department'
            className={`h-10 w-[330px] rounded-[3px] border-2 border-secondary indent-3 text-sm font-bold outline-none ${
              errors.dept_id ? 'border-red-600' : 'border-secondary focus:border-accent'
            }`}
            {...register('dept_id', { required: true, valueAsNumber: true })}
          >
            {!isEditing ? (
              <option hidden value=''>
                -- select a department --
              </option>
            ) : (
              <option hidden value={defaultValues.dept_id}>
                {defaultValues.dept_name}
              </option>
            )}
            {renderDepartmentOptions()}
          </select>
          {errors.dept_id && <p className='mt-2 ml-2 text-sm font-medium text-red-600'>Please select a department</p>}
        </div>
        <div className='relative h-20 w-auto'>
          <select
            className={`h-10 w-[330px] rounded-[3px] border-2 indent-3 text-sm font-bold outline-none ${
              errors.teacher_designation ? 'border-red-600' : 'border-secondary focus:border-accent'
            }`}
            {...register('teacher_designation', { required: true })}
          >
            <option hidden value=''>
              -- select a designation --
            </option>
            <option>Prof</option>
            <option>Asst.Prof</option>
            <option>HOD</option>
          </select>
          {errors.teacher_designation && <p className='mt-2 ml-2 text-sm font-medium text-red-600'>Please select a designation</p>}
        </div>
        <div className='mt-6 flex w-full items-center justify-between'>
          <button
            disabled={isLoading}
            type='button'
            onClick={handleClose}
            className='text-primay h-8 w-20 cursor-pointer border-2 border-secondary font-bold text-[#E14646] disabled:cursor-not-allowed disabled:text-secondary'
          >
            Cancel
          </button>
          <button
            disabled={!isValid || !isDirty || Object.keys(errors).length !== 0 || isLoading}
            type='submit'
            className='flex h-8 w-auto cursor-pointer items-center justify-center border-2 border-secondary p-3 font-bold text-primary disabled:cursor-not-allowed disabled:text-secondary '
          >
            {isLoading && <Spinner />}
            {isLoading ? (isEditing ? 'Updating' : 'Saving') : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TeacherModal;
