import { XIcon } from '@heroicons/react/outline';
import { useForm } from 'react-hook-form';

const DepartmentModal = ({ data, handleClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm(data || { name: '', hod: '' });

  const onSubmit = async (depDetails) => {
    console.log(depDetails);
  };

  return (
    <div className='fixed left-0 right-0 bottom-0 z-20 flex h-screen w-screen items-center justify-center bg-black/25' onClick={handleClose}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex h-auto w-[400px] flex-col items-start justify-between rounded-[3px] bg-white p-6 drop-shadow-lg  md:w-[500px]'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='mb-6 flex w-full items-center justify-between'>
          <h1 className='text-lg font-bold text-primary'>New Department</h1>
          <XIcon className='h-8 w-8 cursor-pointer hover:bg-secondary' onClick={handleClose} />
        </div>
        <div className='relative  h-20 w-auto'>
          <input
            type='text'
            className={`peer h-10 w-[330px] rounded-[3px] border-2  p-3 text-sm font-bold ${errors.name ? 'border-red-600' : 'border-secondary focus:border-accent'} `}
            {...register('name', { required: true })}
          />
          <span className='pointer-events-none absolute top-[25%] left-4 -translate-y-2/4 bg-white p-1 text-sm text-[#909090] transition-all ease-in peer-valid:top-0 peer-valid:left-4 peer-valid:text-xs peer-focus:top-0 peer-focus:left-4 peer-focus:text-xs'>
            Name
          </span>
          {errors.name && <p className='mt-2 ml-2  text-sm font-medium text-red-600 '>Department name is required!</p>}
        </div>
        <div className='relative mt-2 h-20 w-auto'>
          <select
            className={`h-10 w-[330px] rounded-[3px] border-2 border-secondary indent-3 text-sm font-bold outline-none ${
              errors.hod ? 'border-red-600' : 'border-secondary focus:border-accent'
            }`}
            {...register('hod', { required: true })}
          >
            <option hidden value=''>
              -- select an option --
            </option>
            <option>hod 1</option>
            <option>hod 2</option>
          </select>
          {errors.hod && <p className='mt-2 ml-2 text-sm font-medium text-red-600'>Please select an HOD</p>}
        </div>
        <div className='mt-6 flex w-full items-center justify-between'>
          <button type='button' onClick={handleClose} className='text-primay h-8 w-20 cursor-pointer border-2 border-secondary font-bold text-[#E14646]'>
            Cancel
          </button>
          <input type='submit' className='text-primay h-8 w-20 cursor-pointer border-2 border-secondary font-bold text-primary' value='Save' />
        </div>
      </form>
    </div>
  );
};

export default DepartmentModal;
