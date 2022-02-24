import { useEffect, useState } from 'react';
import { PencilIcon, XIcon, ExclamationIcon } from '@heroicons/react/outline';
import useFetch from '../hooks/useFetch';
import useModal from '../hooks/useModal';
import CategoryModal from './modals/CategoryModal';
import PulseAnimation from './PulseAnimation';
import ToggleButton from './ToggleButton';

const Categories = () => {
  const [categories, setCategories] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [defaultValues, setDefaultValues] = useState(null);
  const [data, error, isLoading] = useFetch(`${process.env.REACT_APP_API}/categories`, {});
  const [isModalVisible, setIsModalVisible, toggleModal] = useModal(false);

  const toggleStatus = async (id, currentStatus) => {
    return await fetch(`${process.env.REACT_APP_API}/categories/togglestatus`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ category_id: id, current_category_status: currentStatus }),
    });
  };

  useEffect(() => {
    setCategories(data);
  }, [data]);

  const renderCategories = () => {
    if (isLoading) {
      return <PulseAnimation noOfCells={5} />;
    } else if (categories) {
      return categories.map((category, index) => {
        const { category_id, category_name, hasLimit, max_days_teacher, max_days_staff, category_status } = category;
        return (
          <div key={index} className='table-row h-24 w-full '>
            <div
              data-title='Sl.No'
              className={`flex w-full items-center justify-between  ${
                index !== 0 ? 'border-t-2' : 'md:border-t-2'
              } border-secondary p-3 text-center align-middle font-medium before:text-lg before:font-bold before:text-primary before:content-[attr(data-title)] md:table-cell md:w-auto md:border-l-2 md:before:content-none`}
            >
              {index + 1}
            </div>
            <div
              data-title='Name'
              className={`flex w-full items-center justify-between border-secondary p-3 text-center align-middle font-medium before:text-lg before:font-bold before:text-primary before:content-[attr(data-title)] md:table-cell md:w-auto md:border-l-2 md:border-t-2 md:before:content-none`}
            >
              {category_name}
            </div>
            <div
              data-title='Teacher Limit'
              className={`flex w-full items-center justify-between border-secondary p-3 text-center align-middle font-medium before:text-lg before:font-bold before:text-primary before:content-[attr(data-title)] md:table-cell md:w-auto md:border-l-2 md:border-t-2 md:before:content-none`}
            >
              {max_days_teacher ? max_days_teacher : 'unlimited'}
            </div>
            <div
              data-title='Staff Limit'
              className={`flex w-full items-center justify-between border-secondary p-3 text-center align-middle font-medium before:text-lg before:font-bold before:text-primary before:content-[attr(data-title)] md:table-cell md:w-auto md:border-l-2 md:border-t-2 md:before:content-none`}
            >
              {max_days_staff ? max_days_staff : 'unlimited'}
            </div>
            <div
              data-title='Status'
              className={`flex w-full items-center justify-between border-secondary p-3 text-center align-middle before:text-lg before:font-bold before:text-primary before:content-[attr(data-title)] md:table-cell md:w-auto md:border-l-2 md:border-t-2 md:before:content-none`}
            >
              <ToggleButton status={category_status} onToggle={() => toggleStatus(category_id, category_status)} />
            </div>
            <div
              data-title='Actions'
              className={`flex w-full items-center justify-between border-secondary p-3 text-center align-middle before:text-lg before:font-bold before:text-primary before:content-[attr(data-title)] md:table-cell md:w-auto md:border-l-2 md:border-t-2 md:before:content-none`}
            >
              <PencilIcon
                className='h-7 w-7 cursor-pointer text-accent hover:scale-110 md:m-auto'
                onClick={() => {
                  toggleModal();
                  setIsEditing(true);
                  setDefaultValues({ category_name, category_id, hasLimit, max_days_teacher, max_days_staff });
                }}
              />
            </div>
          </div>
        );
      });
    }
  };

  return (
    <div className='flex flex-col justify-center p-5 md:py-6 md:px-9'>
      {isModalVisible && (
        <CategoryModal
          handleClose={() => {
            setIsEditing(false);
            setDefaultValues(null);
            setIsModalVisible(false);
          }}
          categories={categories}
          setCategories={setCategories}
          isEditing={isEditing}
          defaultValues={defaultValues}
        />
      )}
      <div className='flex items-center'>
        <h1 className='md:textlgxl text-2xl font-bold text-primary'>Categories</h1>
        <div className='fixed bottom-6 right-6 z-20 ml-3 flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-[#44B35C] hover:scale-110 md:static md:h-11  md:w-11'>
          <XIcon className='h-12 w-12 rotate-45 text-white md:h-9 md:w-9' onClick={toggleModal} />
        </div>
      </div>
      <div className='mt-8 mb-28 table w-full border-2 border-secondary md:mb-5 md:rounded-tr-xl md:border-t-0 md:border-l-0'>
        <div className='hidden h-24 w-full md:table-row'>
          <div className='table-cell  rounded-tl-xl border-l-2 border-t-2 border-secondary p-3 text-center align-middle text-lg font-bold text-primary'>Sl.No</div>
          <div className='table-cell border-l-2 border-t-2 border-secondary p-3 text-center align-middle text-lg font-bold text-primary '>Name</div>
          <div className='table-cell border-l-2 border-t-2 border-secondary p-3 text-center align-middle text-lg font-bold text-primary '>Teacher Limit</div>
          <div className='table-cell border-l-2 border-t-2 border-secondary p-3 text-center align-middle text-lg font-bold text-primary '>Staff Limit</div>
          <div className='table-cell border-l-2 border-t-2 border-secondary p-3 text-center align-middle text-lg font-bold text-primary'>Status</div>
          <div className='table-cell  rounded-tr-xl border-l-2 border-t-2 border-secondary p-3 text-center align-middle text-lg font-bold text-primary'>Actions</div>
        </div>
        {renderCategories()}
      </div>
      {error && (
        <div className='m-auto flex flex-col items-center text-center font-bold text-orange-600 md:flex-row'>
          <ExclamationIcon className='mr-2 h-8 w-8  text-orange-600' />
          Something went wrong on our side, Please try again later.
        </div>
      )}
    </div>
  );
};

export default Categories;
