import { useEffect, useState } from 'react';
import { PencilIcon, XIcon, ExclamationIcon, EyeIcon } from '@heroicons/react/outline';
import useUser from '../hooks/useUser';
import useFetch from '../hooks/useFetch';
import useModal from '../hooks/useModal';
import LeaveModal from './modals/LeaveModal';
import PulseAnimation from './PulseAnimation';

const Leaves = () => {
  const [leaves, setLeaves] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [defaultValues, setDefaultValues] = useState(null);
  const [data, error, isLoading] = useFetch(`${process.env.REACT_APP_API}/leaves`, {});
  const [isModalVisible, setIsModalVisible, toggleModal] = useModal(false);
  const { user } = useUser();

  const renderLeaves = () => {
    if (isLoading) {
      return <PulseAnimation noOfCells={user.user_type === 'STAFF' ? 7 : 8} />;
    } else if (leaves) {
      return leaves.map((leave, index) => {
        const {
          leave_id,
          Category: { category_name },
          category_id,
          leave_application_date,
          leave_startDate,
          leave_endDate,
          leave_approval_status,
          leave_slip_image,
          leave_reason,
        } = leave;
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
              data-title='Reason'
              className={`flex w-full items-center justify-between border-secondary p-3 text-center align-middle font-medium before:text-lg before:font-bold before:text-primary before:content-[attr(data-title)] md:table-cell md:w-auto md:border-l-2 md:border-t-2 md:before:content-none`}
            >
              {leave_reason}
            </div>
            {user.user_type !== 'STAFF' && (
              <div
                data-title='Approval Status'
                className={`flex w-full items-center justify-between border-secondary p-3 text-center align-middle font-medium before:text-lg before:font-bold before:text-primary before:content-[attr(data-title)] md:table-cell md:w-auto md:border-l-2 md:border-t-2 md:before:content-none`}
              >
                {leave_approval_status}
              </div>
            )}
            <div
              data-title='Actions'
              className={`flex w-full items-center justify-between border-secondary p-3 text-center align-middle before:text-lg before:font-bold before:text-primary before:content-[attr(data-title)] md:table-cell  md:w-auto md:border-l-2 md:border-t-2 md:before:content-none`}
            >
              <div className='flex items-center justify-center'>
                {user.user_type === 'STAFF' ? (
                  <PencilIcon
                    className='h-7 w-7 cursor-pointer text-accent hover:scale-110 md:m-auto'
                    onClick={() => {
                      toggleModal();
                      setIsEditing(true);
                      setDefaultValues({ leave_id, category_name, category_id, leave_startDate, leave_endDate, leave_reason, current_leave_slip_image: leave_slip_image });
                    }}
                  />
                ) : (
                  leave_approval_status === 'pending' && (
                    <PencilIcon
                      className='h-7 w-7 cursor-pointer text-accent hover:scale-110 md:m-auto'
                      onClick={() => {
                        toggleModal();
                        setIsEditing(true);
                        setDefaultValues({ leave_id, category_name, category_id, leave_startDate, leave_endDate, leave_reason });
                      }}
                    />
                  )
                )}
                <a href={`${process.env.REACT_APP_STATIC}/uploads/slips/${leave_slip_image}`} target='_blank' rel='noreferrer'>
                  <EyeIcon className='ml-3 h-7 w-7 cursor-pointer text-accent hover:scale-110 md:m-auto' />
                </a>
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
        <LeaveModal
          handleClose={() => {
            setIsEditing(false);
            setDefaultValues(null);
            setIsModalVisible(false);
          }}
          leaves={leaves}
          setLeaves={setLeaves}
          isEditing={isEditing}
          defaultValues={defaultValues}
        />
      )}
      <div className='flex items-center'>
        <h1 className='text-2xl font-bold text-primary md:text-3xl'>Leaves</h1>
        <div className='fixed bottom-6 right-6 z-20 ml-3 flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-[#44B35C] hover:scale-110 md:static md:h-11  md:w-11'>
          <XIcon className='h-12 w-12 rotate-45 text-white md:h-9 md:w-9' onClick={toggleModal} />
        </div>
      </div>
      <div className='mt-8 mb-28 table w-full border-2 border-secondary md:mb-5 md:rounded-tr-xl md:border-t-0 md:border-l-0'>
        <div className='hidden h-24 w-full md:table-row'>
          <div className='table-cell  rounded-tl-xl border-l-2 border-t-2 border-secondary p-3 text-center align-middle text-lg font-bold text-primary'>Sl.No</div>
          <div className='table-cell border-l-2 border-t-2 border-secondary p-3 text-center align-middle text-lg font-bold text-primary '>Category</div>
          <div className='table-cell border-l-2 border-t-2 border-secondary p-3 text-center align-middle text-lg font-bold text-primary '>Apply Date</div>
          <div className='table-cell border-l-2 border-t-2 border-secondary p-3 text-center align-middle text-lg font-bold text-primary '>Start Date</div>
          <div className='table-cell border-l-2 border-t-2 border-secondary p-3 text-center align-middle text-lg font-bold text-primary '>End Date</div>
          <div className='table-cell border-l-2 border-t-2 border-secondary p-3 text-center align-middle text-lg font-bold text-primary '>Reason</div>
          {user.user_type !== 'STAFF' && (
            <div className='table-cell border-l-2 border-t-2 border-secondary p-3 text-center align-middle text-lg font-bold text-primary '> Approval Status</div>
          )}
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

export default Leaves;
