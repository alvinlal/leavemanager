import { XIcon } from '@heroicons/react/outline';
import useModal from '../hooks/useModal';
import DepartmentModal from './modals/DepartmentModal';
import ToggleButton from './ToggleButton';

const Departments = () => {
  const [isAddModalVisible, setIsAddModalVisible, toggleModal] = useModal(false);

  const changeStatus = (id) => {};

  return (
    <div className='p-5 md:py-6 md:px-9'>
      {isAddModalVisible && <DepartmentModal handleClose={() => setIsAddModalVisible(false)} />}
      <div className='flex items-center'>
        <h1 className='text-2xl font-bold text-primary md:text-4xl'>Departments</h1>
        <div className='fixed bottom-6 right-6 z-10 ml-3 flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-[#44B35C] hover:scale-110 md:static md:h-11  md:w-11'>
          <XIcon className='h-12 w-12 rotate-45 text-white md:h-9 md:w-9' onClick={toggleModal} />
        </div>
      </div>
      <div className='mt-8 table w-full border-2 border-secondary md:rounded-tr-xl md:border-t-0 md:border-l-0'>
        <div className='hidden h-24 w-full  md:table-row'>
          <div className='table-cell w-24 rounded-tl-xl border-l-2 border-t-2 border-secondary p-3 text-center align-middle text-xl font-bold text-primary'>Sl.No</div>
          <div className='table-cell border-l-2 border-t-2 border-secondary p-3 text-center align-middle text-xl font-bold text-primary'>Name</div>
          <div className='table-cell w-[300px] border-l-2 border-t-2 border-secondary p-3 text-center align-middle text-xl font-bold text-primary'>HOD</div>
          <div className='table-cell w-28 rounded-tr-xl border-l-2 border-t-2 border-secondary p-3 text-center align-middle text-xl font-bold text-primary'>Status</div>
        </div>
        <div className='table-row h-24 w-full  '>
          <div
            data-title='Sl.No'
            className='flex w-full items-center justify-between border-secondary p-3 text-center align-middle before:text-lg before:font-bold before:text-primary before:content-[attr(data-title)] md:table-cell md:w-24 md:border-l-2 md:border-t-2 md:before:content-none'
          >
            1
          </div>
          <div
            data-title='Name'
            className='flex w-full items-center justify-between border-secondary p-3 text-center align-middle before:text-lg before:font-bold before:text-primary before:content-[attr(data-title)] md:table-cell md:w-auto md:border-l-2 md:border-t-2 md:before:content-none'
          >
            Department of computer science
          </div>
          <div
            data-title='HOD'
            className='flex w-full items-center justify-between border-secondary p-3 text-center align-middle before:text-lg before:font-bold before:text-primary before:content-[attr(data-title)] md:table-cell md:w-[300px] md:border-l-2 md:border-t-2 md:before:content-none'
          >
            A really long name for sake
          </div>
          <div
            data-title='Status'
            className='flex w-full  items-center justify-between border-secondary p-3 text-center align-middle before:text-lg before:font-bold before:text-primary before:content-[attr(data-title)] md:table-cell md:w-28 md:border-l-2 md:border-t-2 md:before:content-none'
          >
            <ToggleButton onToggle={() => changeStatus} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Departments;
