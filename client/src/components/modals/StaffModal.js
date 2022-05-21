import { XIcon } from '@heroicons/react/outline';
import { useForm } from 'react-hook-form';
import useSend from '../../hooks/useSend';
import Spinner from '../Spinner';

const StaffModal = ({ handleClose, staffs, setStaffs, isEditing, defaultValues }) => {
  const { send, isLoading } = useSend();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isDirty, isValid },
  } = useForm({
    mode: 'onChange',
    defaultValues: isEditing ? defaultValues : { staff_firstname: '', staff_lastname: '', staff_designation: '', staff_doj: '', username: '' },
  });

  const addStaff = async (staffDetails) => {
    const { data, error } = await send(`${process.env.REACT_APP_API}/staffs`, {
      body: JSON.stringify(staffDetails),
    });
    if (error) {
      if (error.username) {
        setError('username', { type: 'focus', message: error.username }, { shouldFocus: true });
      }
    } else if (data) {
      setStaffs([...staffs, data]);
      navigator.clipboard.writeText(data.password);
      // TODO:- make toast
      alert('Password has been copied to clipboard');
      handleClose();
      window.scrollTo(0, document.body.scrollHeight);
    }
  };

  const updateStaff = async (staffDetails) => {
    const { data } = await send(`${process.env.REACT_APP_API}/staffs`, { method: 'PUT', body: JSON.stringify(staffDetails) });
    if (data) {
      setStaffs(
        staffs.map((staff) =>
          staff.staff_id === data.staff_id
            ? {
                ...staff,
                staff_firstname: data.staff_firstname,
                staff_lastname: data.staff_lastname,
                staff_designation: data.staff_designation,
                staff_doj: data.staff_doj,
              }
            : staff
        )
      );
    }
    handleClose();
  };

  const onSubmit = (staffDetails) => {
    isEditing ? updateStaff({ ...staffDetails, staff_id: defaultValues.staff_id }) : addStaff(staffDetails);
  };

  return (
    <div className='fixed left-0 right-0 bottom-0 z-40 flex h-screen w-screen items-center justify-center bg-black/25' onClick={handleClose}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex h-auto w-[400px] flex-col items-center justify-between rounded-[3px] bg-white p-6 drop-shadow-lg  md:w-[500px]'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='mb-6 flex w-full items-center justify-between'>
          <h1 className='text-lg font-bold text-primary'>{isEditing ? 'Edit Staff' : 'New Staff'}</h1>
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
            className={`peer h-10 w-[330px] rounded-[3px] border-2  p-3 text-sm font-bold ${errors.staff_firstname ? 'border-red-600' : 'border-secondary focus:border-accent'} `}
            {...register('staff_firstname', { required: true })}
          />
          <span className='pointer-events-none absolute  -top-[10px] left-4 bg-white p-1 text-xs text-[#909090]'>Firstname</span>
          {errors.staff_firstname && <p className='mt-2 ml-2 text-sm font-medium text-red-600 '>Firstname is required!</p>}
        </div>
        <div className='relative  h-20 w-auto'>
          <input
            type='text'
            className={`peer h-10 w-[330px] rounded-[3px] border-2  p-3 text-sm font-bold ${errors.staff_lastname ? 'border-red-600' : 'border-secondary focus:border-accent'} `}
            {...register('staff_lastname', { required: true })}
          />
          <span className='pointer-events-none absolute  -top-[10px] left-4 bg-white p-1 text-xs text-[#909090]'>Lastname</span>
          {errors.staff_lastname && <p className='mt-2 ml-2 text-sm font-medium text-red-600 '>Lastname is required!</p>}
        </div>
        <div className='relative h-20 w-auto'>
          <select
            className={`h-10 w-[330px] rounded-[3px] border-2 bg-white indent-3 text-sm font-bold outline-none ${
              errors.staff_designation ? 'border-red-600' : 'border-secondary focus:border-accent'
            }`}
            {...register('staff_designation', { required: true })}
          >
            <option hidden value=''>
              -- select a designation --
            </option>
            <option>Accountant</option>
            <option>Administrator</option>
            <option>Clerk</option>
            <option>Librarian</option>
          </select>
          {errors.staff_designation && <p className='mt-2 ml-2 text-sm font-medium text-red-600'>Please select a designation</p>}
        </div>
        <div className='relative h-20 w-auto'>
          <input
            type='date'
            className={`h-10 w-[330px] rounded-[3px] border-2 bg-white indent-2 text-sm font-bold outline-none ${
              errors.staff_doj ? 'border-red-600' : 'border-secondary focus:border-accent'
            }`}
            {...register('staff_doj', { required: 'Please select a date' })}
          />
          <span className='pointer-events-none absolute  -top-[10px] left-4 bg-white p-1 text-xs text-[#909090]'>Date of joining</span>
          {errors.staff_doj && <p className='mt-2 ml-2 text-sm font-medium text-red-600'>{errors.staff_doj.message}</p>}
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

export default StaffModal;
