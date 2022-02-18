import { XIcon } from '@heroicons/react/outline';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import useFetch from '../../hooks/useFetch';
import useSend from '../../hooks/useSend';
import Spinner from '../Spinner';

const LeaveModal = ({ handleClose, leaves, setLeaves, isEditing, defaultValues }) => {
  const [categories, setCategories] = useState(null);
  const [data, error, isCategoriesLoading] = useFetch(`${process.env.REACT_APP_API}/categories`, {});
  const { send, isLoading } = useSend();
  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors, isDirty, isValid },
  } = useForm({
    mode: 'onChange',
    defaultValues: isEditing
      ? defaultValues
      : {
          category_id: '',
          leave_startDate: '',
          leave_endDate: '',
          leave_reason: '',
        },
  });
  const watchStartDate = watch('leave_startDate');
  const watchEndDate = watch('leave_endDate');

  const addLeave = async (leaveDetails) => {
    const formData = new FormData();
    //eslint-disable-next-line
    leaveDetails = { ...leaveDetails, ...categories.filter((category) => category.category_id == leaveDetails.category_id)[0] };

    Object.keys({ ...leaveDetails }).forEach((key) => {
      if (key === 'leave_slip_image') {
        formData.append(key, leaveDetails[key][0]);
      } else {
        formData.append(key, leaveDetails[key]);
      }
    });
    const { data, error } = await send(`${process.env.REACT_APP_API}/leaves`, {
      headers: {},
      body: formData,
    });
    if (error) {
      if (error.category) {
        setError('category', { type: 'focus', message: error.category }, { shouldFocus: true });
      }
      if (error.leave_slip_image) {
        setError('leave_slip_image', { message: error.leave_slip_image });
      }
    } else if (data) {
      setLeaves([...leaves, data]);
      handleClose();
      window.scrollTo(0, document.body.scrollHeight);
    }
  };

  const getCategoryName = () => {
    const categorySelect = document.getElementById('category');
    return categorySelect.options[categorySelect.selectedIndex].text;
  };

  const updateLeave = async (leaveDetails) => {
    const { data } = await send(`${process.env.REACT_APP_API}/leaves`, { method: 'PUT', body: JSON.stringify(leaveDetails) });
    if (data) {
      setLeaves(
        leaves.map((leave) =>
          leave.leave_id === data.leave_id
            ? {
                ...leave,
                leave_application_date: data.leave_application_date,
                leave_startDate: data.leave_startDate,
                leave_endDate: data.leave_endDate,
                leave_reason: data.leave_reason,
                Category: {
                  category_name: getCategoryName(),
                },
                category_id: data.category_id,
              }
            : leave
        )
      );
    }
    handleClose();
  };

  const onSubmit = (leaveDetails) => {
    isEditing ? updateLeave({ ...leaveDetails, leave_id: defaultValues.leave_id }) : addLeave(leaveDetails);
  };

  const renderCategoryOptions = () => {
    if (isCategoriesLoading) {
      return <option>Loading...</option>;
    }
    if (error) {
      return (
        <option className='text-red-900' disabled>
          Something went wrong, please try again later
        </option>
      );
    }
    if (categories) {
      return (
        categories
          // eslint-disable-next-line
          .filter((category) => category.category_status && (isEditing ? category.category_id != defaultValues.category_id : true))
          .map((category, index) => (
            <option key={index} value={category.category_id}>
              {category.category_name}
            </option>
          ))
      );
    }
  };

  useEffect(() => {
    setCategories(data);
  }, [data]);

  return (
    <div className='fixed left-0 right-0 bottom-0 z-40 flex h-screen w-screen items-center justify-center bg-black/25' onClick={handleClose}>
      <form
        encType='multipart/form-data'
        onSubmit={handleSubmit(onSubmit)}
        className='flex h-auto w-[400px] flex-col items-center justify-between rounded-[3px] bg-white p-6 drop-shadow-lg  md:w-[500px]'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='mb-6 flex w-full items-center justify-between'>
          <h1 className='text-lg font-bold text-primary'>{isEditing ? 'Edit Leave' : 'New Leave'}</h1>
          <button type='button' onClick={handleClose} disabled={isLoading} className='cursor-pointer hover:bg-secondary disabled:cursor-not-allowed'>
            <XIcon className={`h-8 w-8 ${isLoading ? 'text-secondary' : ''} `} />
          </button>
        </div>
        <div className='relative  h-20 w-auto'>
          <input
            type='date'
            className={`peer h-10 w-[330px] rounded-[3px] border-2  p-3 text-sm font-bold ${errors.leave_startDate ? 'border-red-600' : 'border-secondary focus:border-accent'} `}
            {...register('leave_startDate', {
              validate: {
                isBeforeEndError: (startDate) => (watchEndDate ? new Date(startDate) <= new Date(watchEndDate) : true),
              },
              required: 'Start Date is required',
            })}
          />
          <span className='pointer-events-none absolute  -top-[10px] left-4 bg-white p-1 text-xs text-[#909090]'>Start Date</span>
          {errors.leave_startDate && (
            <p className='mt-2 ml-2 text-sm font-medium text-red-600 '>{errors.leave_startDate.type === 'isBeforeEndError' ? 'Invalid start date' : 'Start Date is required'}</p>
          )}
        </div>
        <div className='relative  h-20 w-auto'>
          <input
            type='date'
            className={`peer h-10 w-[330px] rounded-[3px] border-2  p-3 text-sm font-bold ${errors.leave_endDate ? 'border-red-600' : 'border-secondary focus:border-accent'} `}
            {...register('leave_endDate', {
              validate: {
                isAfterStartError: (endDate) => (watchStartDate ? new Date(watchStartDate) <= new Date(endDate) : true),
              },
              required: 'End Date is required',
            })}
          />
          <span className='pointer-events-none absolute  -top-[10px] left-4 bg-white p-1 text-xs text-[#909090]'>End Date</span>
          {errors.leave_endDate && (
            <p className='mt-2 ml-2 text-sm font-medium text-red-600 '>{errors.leave_endDate.type === 'isAfterStartError' ? 'Invalid end date' : 'End date is required'}</p>
          )}
        </div>
        <div className='relative  h-20 w-auto'>
          <select
            id='category'
            className={`h-10 w-[330px] rounded-[3px] border-2  indent-3 text-sm font-bold outline-none ${
              errors.category_id ? 'border-red-600' : 'border-secondary focus:border-accent'
            }`}
            {...register('category_id', { required: true })}
          >
            <option hidden value=''>
              {isEditing ? defaultValues.category_name : '-- select a category --'}
            </option>
            {renderCategoryOptions()}
          </select>
          {errors.category_id && <p className='mt-2 ml-2 text-sm font-medium text-red-600'>Please select a category</p>}
        </div>
        <div className='relative  h-20 w-auto'>
          <input
            type='text'
            className={`peer h-10 w-[330px] rounded-[3px] border-2  p-3 text-sm font-bold ${errors.leave_reason ? 'border-red-600' : 'border-secondary focus:border-accent'} `}
            {...register('leave_reason', { required: 'Leave reason is required' })}
          />
          <span className='pointer-events-none absolute  -top-[10px] left-4 bg-white p-1 text-xs text-[#909090]'>Leave Reason</span>
          {errors.leave_reason && <p className='mt-2 ml-2 text-sm font-medium text-red-600 '>{errors.leave_reason.message}</p>}
        </div>
        <div className='relative  h-20 w-auto  '>
          <input
            id='file'
            type='file'
            className='block w-full text-sm text-slate-500 file:mr-4
      file:cursor-pointer file:rounded-full file:border-0
      file:bg-violet-50 file:py-2
      file:px-4 file:text-sm
      file:font-semibold file:text-violet-700
      hover:file:bg-violet-100'
            {...register('leave_slip_image', {
              required: 'Slip image is required',
              validate: {
                sizeError: (files) => files[0].size < 5000000,
              },
            })}
            accept='image/*'
          />

          {errors.leave_slip_image && (
            <p className='ml-2 mt-2 text-sm font-medium text-red-600 '>{errors.leave_slip_image.type === 'sizeError' ? 'Max file size is 5mb !' : 'Slip image is required'}</p>
          )}
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

export default LeaveModal;
