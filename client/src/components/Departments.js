import { useEffect, useState } from 'react';
import { XIcon } from '@heroicons/react/outline';
import useFetch from '../hooks/useFetch';
import useModal from '../hooks/useModal';
import DepartmentModal from './modals/DepartmentModal';
import PulseAnimation from './PulseAnimation';
import ToggleButton from './ToggleButton';

const Departments = () => {
  const [departments, setDepartments] = useState(null);
  const { data } = useFetch(`${process.env.REACT_APP_API}/departments`, {});
  const [isAddModalVisible, setIsAddModalVisible, toggleModal] = useModal(false);

  const toggleStatus = async (id, currentStatus) => {
    return await fetch(`${process.env.REACT_APP_API}/departments/togglestatus`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ dept_id: id, current_dept_status: currentStatus }),
    });
  };

  const addDepartment = async (departmentDetails) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API}/departments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(departmentDetails),
      });
      const newDepartment = await res.json();
      setDepartments([...departments, newDepartment.data]);
    } catch (error) {
      // TODO :- add toast
      alert('something went wrong, please try again later');
    }
  };

  useEffect(() => {
    setDepartments(data);
  }, [data]);

  return (
    <div className='p-5 md:py-6 md:px-9'>
      {isAddModalVisible && <DepartmentModal handleClose={() => setIsAddModalVisible(false)} addDepartment={addDepartment} />}
      <div className='flex items-center'>
        <h1 className='text-2xl font-bold text-primary md:text-4xl'>Departments</h1>
        <div className='z-9 fixed bottom-6 right-6 ml-3 flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-[#44B35C] hover:scale-110 md:static md:h-11  md:w-11'>
          <XIcon className='h-12 w-12 rotate-45 text-white md:h-9 md:w-9' onClick={toggleModal} />
        </div>
      </div>
      <div className='mt-8 mb-28 table w-full border-2 border-secondary md:mb-5 md:rounded-tr-xl md:border-t-0 md:border-l-0'>
        <div className='hidden h-24 w-full md:table-row'>
          <div className='table-cell w-24 rounded-tl-xl border-l-2 border-t-2 border-secondary p-3 text-center align-middle text-xl font-bold text-primary'>Sl.No</div>
          <div className='table-cell border-l-2 border-t-2 border-secondary p-3 text-center align-middle text-xl font-bold text-primary'>Name</div>
          <div className='table-cell w-28 rounded-tr-xl border-l-2 border-t-2 border-secondary p-3 text-center align-middle text-xl font-bold text-primary'>Status</div>
        </div>
        {departments ? (
          departments.map((department, index) => (
            <div key={index} className='table-row h-24 w-full'>
              <div
                data-title='Sl.No'
                className={`flex w-full items-center justify-between  ${
                  index !== 0 ? 'border-t-2' : 'md:border-t-2'
                } border-secondary p-3 text-center align-middle before:text-lg before:font-bold before:text-primary before:content-[attr(data-title)] md:table-cell md:w-auto md:border-l-2 md:before:content-none`}
              >
                {index + 1}
              </div>
              <div
                data-title='Name'
                className={` flex w-full items-center justify-between border-secondary p-3 text-center align-middle before:text-lg before:font-bold before:text-primary before:content-[attr(data-title)] md:table-cell md:w-auto md:border-l-2 md:border-t-2 md:before:content-none`}
              >
                {department.dept_name}
              </div>
              <div
                data-title='Status'
                className={`flex w-full  items-center justify-between border-secondary p-3 text-center align-middle before:text-lg before:font-bold before:text-primary before:content-[attr(data-title)] md:table-cell md:w-auto md:border-l-2 md:border-t-2 md:before:content-none`}
              >
                <ToggleButton status={department.dept_status} onToggle={() => toggleStatus(department.dept_id, department.dept_status)} />
              </div>
            </div>
          ))
        ) : (
          <PulseAnimation noOfCells={3} />
        )}
      </div>
    </div>
  );
};

export default Departments;
