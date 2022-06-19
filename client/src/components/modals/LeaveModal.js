import { XIcon } from '@heroicons/react/outline';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import useFetch from '../../hooks/useFetch';
import useSend from '../../hooks/useSend';
import useUser from '../../hooks/useUser';
import Spinner from '../Spinner';

const LeaveModal = ({ handleClose, leaves, setLeaves, isEditing, defaultValues }) => {
  const [categories, setCategories] = useState(null);
  const [data, error, isCategoriesLoading] = useFetch(`${process.env.REACT_APP_API}/categories`, {});
  const { send, isLoading } = useSend();
  const { user } = useUser();
  const {
    register,
    handleSubmit,
    setError,
    watch,
    getValues,
    formState: { errors, isValid, dirtyFields },
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
      if (error.date) {
        setError('leave_endDate', { type: 'focus', message: error.date });
      }
      if (error.category) {
        setError('category_id', { type: 'focus', message: error.category });
      }
      if (error.leave_slip_image) {
        setError('leave_slip_image', { message: error.leave_slip_image });
      }
    } else if (data) {
      setLeaves([data, ...leaves]);
      handleClose();
    }
  };

  const getCategoryName = () => {
    const categorySelect = document.getElementById('category');
    return categorySelect.options[categorySelect.selectedIndex].text;
  };

  const updateLeave = async (leaveDetails) => {
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
    formData.append('category_name', getCategoryName());
    formData.append('current_leave_slip_image', defaultValues.current_leave_slip_image);
    const { data, error } = await send(`${process.env.REACT_APP_API}/leaves`, {
      method: 'PUT',
      headers: {},
      body: formData,
    });
    if (error) {
      if (error.date) {
        setError('leave_endDate', { type: 'focus', message: error.date });
      }
      if (error.category) {
        setError('category_id', { type: 'focus', message: error.category }, { shouldFocus: true });
      }
      if (error.leave_slip_image) {
        setError('leave_slip_image', { message: error.leave_slip_image });
      }
    } else if (data) {
      setLeaves(
        leaves.map((leave) =>
          leave.leave_id === data.leave_id
            ? {
                ...leave,
                Category: { category_name: getCategoryName() },
                category_id: data.category_id,
                leave_startDate: data.leave_startDate,
                leave_endDate: data.leave_endDate,
                leave_reason: data.leave_reason,
                leave_slip_image: data.leave_slip_image,
              }
            : leave
        )
      );
      handleClose();
    }
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
          .filter((category) => category.category_status)
          .map((category, index) => (
            <option key={index} value={category.category_id}>
              {category.category_name}
            </option>
          ))
      );
    }
  };
  const isDirty = () =>
    dirtyFields.leave_startDate ||
    dirtyFields.leave_endDate ||
    dirtyFields.category_id ||
    dirtyFields.leave_reason ||
    (getValues('leave_slip_image') && dirtyFields.leave_slip_image);

  useEffect(() => {
    setCategories(data);
  }, [data]);

  return (
    <div className='fixed left-0 right-0 bottom-0 z-40 flex h-screen w-screen items-center justify-center bg-black/25' onClick={handleClose}>
      <form
        encType='multipart/form-data'
        onSubmit={handleSubmit(onSubmit)}
        className='flex h-auto w-full flex-col items-center justify-between rounded-[3px] bg-white p-6 drop-shadow-lg   md:w-[500px]'
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
            //eslint-disable-next-line
            min={new Date().getFullYear() == new Date(user.doj).getFullYear() ? user.doj : new Date(new Date().getFullYear(), 0, 1).toLocaleDateString('en-CA')}
            max={new Date(new Date().getFullYear(), 11, 31).toLocaleDateString('en-CA')}
            className={`peer h-10 w-[330px] rounded-[3px] border-2 bg-white  p-3 text-sm font-bold ${
              errors.leave_startDate ? 'border-red-600' : 'border-secondary focus:border-accent'
            } `}
            {...register('leave_startDate', {
              required: 'Start Date is required',
              validate: {
                isBeforeEndError: (startDate) => (watchEndDate ? new Date(startDate) <= new Date(watchEndDate) : true),
              },
            })}
          />
          <span className='pointer-events-none absolute  -top-[10px] left-4 bg-white p-1 text-xs text-[#909090]'>Start Date</span>
          {errors.leave_startDate && (
            <p className='mt-2 ml-2 text-sm font-medium text-red-600 '>
              {errors.leave_startDate.type === 'isBeforeEndError' ? 'Invalid start date' : errors.leave_startDate.message}
            </p>
          )}
        </div>
        <div className='relative h-auto min-h-[5rem] w-auto'>
          <input
            type='date'
            min={new Date().getFullYear() === new Date(user.doj).getFullYear() ? user.doj : new Date(new Date().getFullYear(), 0, 1).toLocaleDateString('en-CA')}
            max={new Date(new Date().getFullYear(), 11, 31).toLocaleDateString('en-CA')}
            className={`peer h-10 w-[330px] rounded-[3px] border-2 bg-white  p-3 text-sm font-bold ${
              errors.leave_endDate ? 'border-red-600' : 'border-secondary focus:border-accent'
            } `}
            {...register('leave_endDate', {
              validate: {
                isAfterStartError: (endDate) => (watchStartDate ? new Date(watchStartDate) <= new Date(endDate) : true),
              },
              required: 'End Date is required',
            })}
          />
          <span className='pointer-events-none absolute  -top-[10px] left-4 bg-white p-1 text-xs text-[#909090]'>End Date</span>
          {errors.leave_endDate && (
            <p className='mb-2 mt-2 ml-2  w-[300px] break-words text-sm font-medium text-red-600 '>
              {errors.leave_endDate.type === 'isAfterStartError' ? 'Invalid end date' : errors.leave_endDate.message}
            </p>
          )}
        </div>
        <div className='relative  h-auto min-h-[5rem] w-auto'>
          <select
            id='category'
            className={`h-10 w-[330px] rounded-[3px] border-2 bg-white  indent-3 text-sm font-bold outline-none ${
              errors.category_id ? 'border-red-600' : 'border-secondary focus:border-accent'
            }`}
            {...register('category_id', { required: true, valueAsNumber: true })}
          >
            {!isEditing ? (
              <option hidden value=''>
                -- select a category --
              </option>
            ) : (
              <option hidden value={defaultValues.category_id}>
                {defaultValues.category_name}
              </option>
            )}
            {renderCategoryOptions()}
          </select>
          {errors.category_id && <p className='mb-2 mt-2 ml-2 w-[300px] break-words text-sm font-medium text-red-600'>{errors.category_id.message}</p>}
        </div>
        <div className='relative  h-20 w-auto'>
          <input
            type='text'
            className={`peer h-10 w-[330px] rounded-[3px] border-2 bg-white  p-3 text-sm font-bold ${
              errors.leave_reason ? 'border-red-600' : 'border-secondary focus:border-accent'
            } `}
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
              ...(!isEditing && { required: 'Slip image is required' }),
              validate: {
                sizeError: (files) => (files.length ? files[0].size < 5000000 : true),
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
            disabled={!isValid || !isDirty() || Object.keys(errors).length !== 0 || isLoading}
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
