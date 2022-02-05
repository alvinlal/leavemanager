import { XIcon } from '@heroicons/react/outline';
import { useForm } from 'react-hook-form';
import useSend from '../../hooks/useSend';
import Spinner from '../Spinner';

const DepartmentModal = ({ handleClose, departments, setDepartments, isEditing, defaultValues = { dept_name: '' } }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({ mode: 'onChange', defaultValues: isEditing ? defaultValues : { dept_name: '' } });

  const { send, isLoading } = useSend();

  const addDepartment = async (departmentDetails) => {
    const { data } = await send(`${process.env.REACT_APP_API}/departments`, departmentDetails);
    if (data) {
      setDepartments([...departments, data]);
    }
    handleClose();
  };

  const updateDepartment = async (departmentDetails) => {
    const { data } = await send(`${process.env.REACT_APP_API}/departments`, departmentDetails, 'PUT');
    if (data) {
      setDepartments(departments.map((department) => (department.dept_id === data.dept_id ? { ...department, dept_name: data.dept_name } : department)));
    }
    handleClose();
  };

  const onSubmit = (departmentDetails) => {
    const { dept_name } = departmentDetails;
    isEditing ? updateDepartment({ dept_name, dept_id: defaultValues.dept_id }) : addDepartment({ dept_name });
  };

  return (
    <div className='fixed left-0 right-0 bottom-0 z-40 flex h-screen w-screen items-center justify-center bg-black/25' onClick={handleClose}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex h-auto w-[400px] flex-col items-start justify-between rounded-[3px] bg-white p-6 drop-shadow-lg  md:w-[500px]'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='mb-6 flex w-full items-center justify-between'>
          <h1 className='text-lg font-bold text-primary'>{isEditing ? 'Edit Department' : 'New Department'}</h1>
          <button type='button' onClick={handleClose} disabled={isLoading} className='cursor-pointer hover:bg-secondary disabled:cursor-not-allowed'>
            <XIcon className={`h-8 w-8 ${isLoading ? 'text-secondary' : ''} `} />
          </button>
        </div>
        <div className='relative  h-20 w-auto'>
          <input
            type='text'
            className={`peer h-10 w-[330px] rounded-[3px] border-2  p-3 text-sm font-bold ${errors.dept_name ? 'border-red-600' : 'border-secondary focus:border-accent'} `}
            {...register('dept_name', { required: true })}
          />
          <span
            className={`pointer-events-none absolute top-[25%] left-4 -translate-y-2/4 bg-white p-1 text-sm text-[#909090] transition-all ease-in peer-valid:top-0 peer-valid:left-4 peer-valid:text-xs peer-focus:top-0 peer-focus:left-4 peer-focus:text-xs`}
          >
            Name
          </span>
          {errors.dept_name && <p className='mt-2 ml-2 text-sm font-medium text-red-600 '>Department name is required!</p>}
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
            disabled={!isDirty || Object.keys(errors).length !== 0 || isLoading}
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

export default DepartmentModal;
