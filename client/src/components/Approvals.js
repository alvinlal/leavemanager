import { useEffect, useState } from 'react';
import { ExclamationIcon, EyeIcon } from '@heroicons/react/outline';
import useFetch from '../hooks/useFetch';
import useModal from '../hooks/useModal';
import ApprovalModal from './modals/ApprovalModal';
import PulseAnimation from './PulseAnimation';

const Approvals = () => {
  const [leaves, setLeaves] = useState(null);
  const [currentLeave, setCurrentLeave] = useState(null);
  const [data, error, isLoading] = useFetch(`${process.env.REACT_APP_API}/approvals`, {});

  const [isModalVisible, setIsModalVisible, toggleModal] = useModal(false);

  const renderLeaves = () => {
    if (isLoading) {
      return <PulseAnimation noOfCells={9} />;
    } else if (leaves) {
      return leaves.map((leave, index) => {
        const { teacher_firstname, teacher_lastname, category_name, leave_application_date, leave_startDate, leave_endDate, leave_approval_status } = leave;
        return (
          <div key={index} className='table-row h-24 w-full'>
            <div
              data-title='Sl.No'
              className={`flex w-full items-center justify-between  ${
                index !== 0 ? 'border-t-2' : 'md:border-t-2'
              } border-secondary p-3 text-center align-middle font-medium before:text-lg before:font-bold before:text-primary before:content-[attr(data-title)] md:table-cell md:w-auto md:border-l-2 md:before:content-none`}
            >
              {index + 1}
            </div>
            <div
              data-title='Applicant'
              className={`flex w-full items-center justify-between border-secondary p-3 text-center align-middle font-medium before:text-lg before:font-bold before:text-primary before:content-[attr(data-title)] md:table-cell md:w-auto md:border-l-2 md:border-t-2 md:before:content-none`}
            >
              {teacher_firstname + ' ' + teacher_lastname}
            </div>
            <div
              data-title='Category'
              className={`flex w-full items-center justify-between border-secondary p-3 text-center align-middle font-medium before:text-lg before:font-bold before:text-primary before:content-[attr(data-title)] md:table-cell md:w-auto md:border-l-2 md:border-t-2 md:before:content-none`}
            >
              {category_name}
            </div>
            <div
              data-title='Apply Date'
              className={`flex w-full items-center justify-between border-secondary p-3 text-center align-middle font-medium before:text-lg before:font-bold before:text-primary before:content-[attr(data-title)] md:table-cell md:w-auto md:border-l-2 md:border-t-2 md:before:content-none`}
            >
              {leave_application_date}
            </div>
            <div
              data-title='Start Date'
              className={`flex w-full items-center justify-between border-secondary p-3 text-center align-middle font-medium before:text-lg before:font-bold before:text-primary before:content-[attr(data-title)] md:table-cell md:w-auto md:border-l-2 md:border-t-2 md:before:content-none`}
            >
              {leave_startDate}
            </div>
            <div
              data-title='End Date'
              className={`flex w-full items-center justify-between border-secondary p-3 text-center align-middle font-medium before:text-lg before:font-bold before:text-primary before:content-[attr(data-title)] md:table-cell md:w-auto md:border-l-2 md:border-t-2 md:before:content-none`}
            >
              {leave_endDate}
            </div>
            <div
              data-title='Approval Status'
              className={`flex w-full items-center justify-between border-secondary p-3 text-center align-middle font-medium before:text-lg before:font-bold before:text-primary before:content-[attr(data-title)] md:table-cell md:w-auto md:border-l-2 md:border-t-2 md:before:content-none`}
            >
              {leave_approval_status}
            </div>
            <div
              data-title='Actions'
              className={`flex w-full items-center justify-between border-secondary p-3 text-center align-middle before:text-lg before:font-bold before:text-primary before:content-[attr(data-title)] md:table-cell  md:w-auto md:border-l-2 md:border-t-2 md:before:content-none`}
            >
              <div className='flex items-center justify-center'>
                <EyeIcon
                  className='h-7 w-7 cursor-pointer text-accent hover:scale-110 md:m-auto'
                  onClick={() => {
                    setCurrentLeave(leave);
                    toggleModal();
                  }}
                />
              </div>
            </div>
          </div>
        );
      });
    }
  };

  useEffect(() => {
    setLeaves(data);
  }, [data]);
  return (
    <div className='flex flex-col justify-center p-5 md:py-6 md:px-9'>
      {isModalVisible && (
        <ApprovalModal
          handleClose={() => {
            setIsModalVisible(false);
          }}
          leaves={leaves}
          setLeaves={setLeaves}
          leave={currentLeave}
        />
      )}
      <div className='flex items-center'>
        <h1 className='text-2xl font-bold text-primary md:text-3xl'>Approvals</h1>
      </div>
      <div className='mt-8 mb-28 table w-full border-2 border-secondary md:mb-5 md:rounded-tr-xl md:border-t-0 md:border-l-0'>
        <div className='hidden h-24 w-full md:table-row'>
          <div className='table-cell  rounded-tl-xl border-l-2 border-t-2 border-secondary p-3 text-center align-middle text-base font-bold text-primary'>Sl.No</div>
          <div className='table-cell border-l-2 border-t-2 border-secondary p-3 text-center align-middle text-base font-bold text-primary'>Applicant </div>
          <div className='table-cell border-l-2 border-t-2 border-secondary p-3 text-center align-middle text-base font-bold text-primary '>Category</div>
          <div className='table-cell border-l-2 border-t-2 border-secondary p-3 text-center align-middle text-base font-bold text-primary '>Apply Date</div>
          <div className='table-cell border-l-2 border-t-2 border-secondary p-3 text-center align-middle text-base font-bold text-primary '>Start Date</div>
          <div className='table-cell border-l-2 border-t-2 border-secondary p-3 text-center align-middle text-base font-bold text-primary '>End Date</div>
          <div className='table-cell border-l-2 border-t-2 border-secondary p-3 text-center align-middle text-base font-bold text-primary '> Approval Status</div>
          <div className='table-cell  rounded-tr-xl border-l-2 border-t-2 border-secondary p-3 text-center align-middle text-lg font-bold text-primary'>Actions</div>
        </div>
        {renderLeaves()}
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

export default Approvals;
