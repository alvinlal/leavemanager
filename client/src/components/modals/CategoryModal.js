import { XIcon } from '@heroicons/react/outline';
import { useForm } from 'react-hook-form';
import useSend from '../../hooks/useSend';
import Spinner from '../Spinner';

const CategoryModal = ({ handleClose, categories, setCategories, isEditing, defaultValues }) => {
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isDirty, isValid },
  } = useForm({ mode: 'onChange', defaultValues: isEditing ? defaultValues : { category_name: '', hasLimit: false, max_days_staff: 0, max_days_teacher: 0 } });
  const hasLimitWatch = watch('hasLimit');
  const { send, isLoading } = useSend();

  const addCategory = async (categoryDetails) => {
    const { data, error } = await send(`${process.env.REACT_APP_API}/categories`, { body: JSON.stringify(categoryDetails) });
    if (error) {
      if (error.category_name) {
        setError('category_name', { type: 'focus', message: error.category_name });
      }
    } else if (data) {
      setCategories([...categories, data]);
      handleClose();
      window.scrollTo(0, document.body.scrollHeight);
    }
  };

  const updateCategory = async (categoryDetails) => {
    const { data } = await send(`${process.env.REACT_APP_API}/categories`, { method: 'PUT', body: JSON.stringify(categoryDetails) });
    if (data) {
      setCategories(categories.map((category) => (category.category_id === data.category_id ? data : category)));
    }
    handleClose();
  };

  const onSubmit = (categoryDetails) => {
    isEditing ? updateCategory(categoryDetails) : addCategory(categoryDetails);
  };

  return (
    <div className='fixed left-0 right-0 bottom-0 z-40 flex h-screen w-screen items-center justify-center bg-black/25' onClick={handleClose}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex h-auto w-[400px] flex-col items-start justify-between rounded-[3px] bg-white p-6 drop-shadow-lg  md:w-[500px]'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='mb-6 flex w-full items-center justify-between'>
          <h1 className='text-lg font-bold text-primary'>{isEditing ? 'Edit Category' : 'New Category'}</h1>
          <button type='button' onClick={handleClose} disabled={isLoading} className='cursor-pointer hover:bg-secondary disabled:cursor-not-allowed'>
            <XIcon className={`h-8 w-8 ${isLoading ? 'text-secondary' : ''} `} />
          </button>
        </div>
        <div className='relative h-20 w-auto'>
          <input
            type='text'
            className={`peer h-10 w-[330px] rounded-[3px] border-2  p-3 text-sm font-bold ${errors.category_name ? 'border-red-600' : 'border-secondary focus:border-accent'} `}
            {...register('category_name', { required: 'Category name is required' })}
          />
          <span className='pointer-events-none absolute  -top-[10px] left-4 bg-white p-1 text-xs text-[#909090]'>Category Name</span>
          {errors.category_name && <p className='mt-2 ml-2 text-sm font-medium text-red-600 '>{errors.category_name.message}</p>}
        </div>
        <div className='mb-7 flex w-auto items-center'>
          <input id='haslimit' type='checkbox' {...register('hasLimit')} />
          <label htmlFor='haslimit' className='ml-3 '>
            has limit ?
          </label>
        </div>
        {hasLimitWatch && (
          <div className='flex flex-col items-start justify-between md:w-auto md:flex-row md:justify-start'>
            <label htmlFor='stafflimit' className='flex w-[200px] items-center justify-between  text-sm md:justify-center'>
              Staff Limit:
              <input
                type='number'
                min='1'
                id='stafflimit'
                className=' ml-3 h-10 w-[80px] rounded-[3px] border-2  border-secondary p-3 text-sm font-bold focus:border-accent'
                {...register('max_days_staff', { required: true })}
              />
            </label>
            <label htmlFor='teacherlimit' className='ml-0 mt-3 flex w-[200px] items-center justify-between text-sm  md:ml-3 md:mt-0 md:justify-center'>
              Teacher Limit:
              <input
                type='number'
                min='1'
                id='teacherlimit'
                className='ml-3 h-10 w-[80px] rounded-[3px] border-2  border-secondary p-3 text-sm font-bold focus:border-accent'
                {...register('max_days_teacher', { required: true })}
              />
            </label>
          </div>
        )}
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

export default CategoryModal;
