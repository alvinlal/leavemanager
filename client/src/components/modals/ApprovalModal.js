import { XIcon } from '@heroicons/react/outline';
import Spinner from '../Spinner';
import useSend from '../../hooks/useSend';

const ApprovalModal = ({ handleClose, leave, leaves, setLeaves }) => {
  const { send, isLoading } = useSend();

  const changeApprovalStatus = async (leave_approval_status) => {
    const { data } = await send(`${process.env.REACT_APP_API}/changeapprovalstatus`, { body: JSON.stringify({ leave_approval_status, leave_id: leave.leave_id }) });

    if (data) {
      setLeaves(leaves.map((leave) => (leave.leave_id === data.leave_id ? { ...leave, leave_approval_status: data.leave_approval_status } : leave)));
      handleClose();
    }
  };

  return (
    <div className='fixed left-0  right-0 bottom-0 z-40 flex h-screen w-screen items-center justify-center bg-black/25' onClick={handleClose}>
      <div
        className='no-scrollbar flex h-[500px]  w-[90%] flex-col overflow-scroll scroll-smooth rounded-[3px] bg-white px-6 pb-6  drop-shadow-lg md:w-[650px]'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='sticky top-0 mb-3 flex w-full items-center justify-between bg-white pt-6'>
          <h1 className='text-lg font-bold text-primary'>Review Leave</h1>
          <button type='button' onClick={handleClose} disabled={isLoading} className='cursor-pointer hover:bg-secondary disabled:cursor-not-allowed'>
            <XIcon className={`h-8 w-8 ${isLoading ? 'text-secondary' : ''} `} />
          </button>
        </div>
        <div className='flex flex-col items-center justify-center md:flex-row md:flex-wrap md:items-start '>
          <img
            className='h-auto w-auto rounded-md object-scale-down md:h-[400px]'
            src={`${process.env.REACT_APP_STATIC}/uploads/slips/${leave.leave_slip_image}`}
            alt='leave slip'
          />
          <div className='item-center flex w-full flex-col p-6  md:w-auto'>
            <div className='flex w-full justify-between'>
              <p className='font-bold text-primary'>Applicant&nbsp;</p>
              <p className='w-1/2 break-words text-right font-medium text-primary'>{leave.teacher_firstname + ' ' + leave.teacher_lastname}</p>
            </div>
            <div className='mt-2 flex w-full justify-between'>
              <p className='font-bold text-primary'>Apply Date&nbsp;</p>
              <p className='w-1/2 break-words text-right font-medium text-primary'>{leave.leave_application_date}</p>
            </div>
            <div className='mt-2 flex w-full justify-between'>
              <p className='font-bold text-primary'>Start Date&nbsp;</p>
              <p className='w-1/2 break-words text-right font-medium text-primary'>{leave.leave_startDate}</p>
            </div>
            <div className='mt-2 flex w-full justify-between'>
              <p className='font-bold text-primary'>End Date&nbsp;</p>
              <p className='w-1/2 break-words text-right font-medium text-primary'>{leave.leave_endDate}</p>
            </div>
            <div className='mt-2 flex w-full justify-between'>
              <p className='font-bold text-primary'>No of Days&nbsp;</p>
              <p className='w-1/2 break-words text-right font-medium text-primary'>{leave.no_of_days}</p>
            </div>
            <div className='mt-2 flex w-full justify-between'>
              <p className='font-bold text-primary'>Reason&nbsp;</p>
              <p className=' w-1/2 break-words text-right font-medium text-primary'>{leave.leave_reason}</p>
            </div>
            <div className='mt-2 flex w-full justify-between'>
              <p className='font-bold text-primary'>Category&nbsp;</p>
              <p className='w-1/2 break-words text-right font-medium text-primary'>{leave.category_name}</p>
            </div>

            <div className='mt-6 flex w-full items-center justify-between bg-white  md:w-[280px]'>
              <button
                onClick={() => changeApprovalStatus('approved')}
                disabled={isLoading || leave.leave_approval_status === 'approved'}
                className='flex h-12  w-full cursor-pointer items-center justify-center border-2 border-secondary p-3 font-bold text-primary disabled:cursor-not-allowed  disabled:text-secondary md:w-auto '
              >
                {isLoading && <Spinner />}
                {'APPROVE'}
                {leave.leave_approval_status !== 'approved' && <span>👍</span>}
              </button>
              <button
                disabled={isLoading || leave.leave_approval_status === 'declined'}
                type='button'
                onClick={() => changeApprovalStatus('declined')}
                className='text-primay ml-3 flex h-12  w-full cursor-pointer items-center justify-center border-2  border-secondary bg-white p-3 font-bold text-[#E14646] disabled:cursor-not-allowed disabled:text-secondary  md:w-auto'
              >
                DECLINE
                {leave.leave_approval_status !== 'declined' && <span>👎</span>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovalModal;
