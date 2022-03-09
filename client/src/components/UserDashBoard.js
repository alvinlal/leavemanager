// DashBoard for staff and teacher
import { BadgeCheckIcon, ClockIcon, XCircleIcon, ExclamationIcon } from '@heroicons/react/outline';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip } from 'chart.js';
import { Line } from 'react-chartjs-2';
import useFetch from '../hooks/useFetch';
import useUser from '../hooks/useUser';
import dayjs from 'dayjs';
import Calendar from './Calendar';
import { useMemo } from 'react';

ChartJS.register(LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip);

const UserDashBoard = () => {
  const [data, error, isLoading] = useFetch(`${process.env.REACT_APP_API}/dashboard`);
  const { user } = useUser();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

  const dates = useMemo(() => {
    if (data) {
      var dates = [];
      data.forEach((leave) => {
        if (leave.leave_approval_status === 'approved') {
          dates.push(leave.leave_startDate);
          var currentDate = leave.leave_startDate;
          for (let i = 1; i < leave.no_of_days; i++) {
            var newDate = dayjs(currentDate).add(1, 'day');
            dates.push(newDate.format('YYYY-MM-DD'));
            currentDate = newDate;
          }
        }
      });
      return dates;
    }
  }, [data]);

  const renderCalendar = () => {
    if (isLoading) {
      return <div className='h-[335px] w-full animate-pulse rounded-md bg-slate-300'></div>;
    } else if (data) {
      return <Calendar yearlyLeaves={dates} />;
    }
  };

  const renderRecentLeaves = () => {
    if (isLoading) {
      // add animated div with correct height
      return (
        <>
          <div className='mb-2 h-[150px] w-full animate-pulse rounded-md bg-slate-300'></div>
          <div className='mb-2 h-[150px] w-full animate-pulse rounded-md bg-slate-300'></div>
          <div className='mb-2 h-[150px] w-full animate-pulse rounded-md bg-slate-300'></div>
          <div className='mb-2 h-[150px] w-full animate-pulse rounded-md bg-slate-300'></div>
        </>
      );
    } else if (data && data.length) {
      return data.slice(0, 5).map((leave, index) => {
        const getBgColor = () => {
          if (leave.leave_approval_status === 'approved') {
            return 'bg-green-400';
          } else if (leave.leave_approval_status === 'pending') {
            return 'bg-orange-400';
          } else {
            return 'bg-red-400';
          }
        };
        const getBadge = () => {
          if (leave.leave_approval_status === 'approved') {
            return <BadgeCheckIcon className='ml-1 h-5 w-5' />;
          } else if (leave.leave_approval_status === 'pending') {
            return <ClockIcon className='ml-1 h-5 w-5' />;
          } else {
            return <XCircleIcon className='ml-1 h-5 w-5' />;
          }
        };
        return (
          <div key={index} className='mb-2 border-2 border-gray-200 p-3'>
            <h1 className='mb-1 text-lg font-semibold text-primary'>{leave.leave_reason}</h1>
            <p className='mb-1 text-base font-medium'>{leave.no_of_days} Days</p>
            <p className='mb-1 text-base font-medium'>
              {leave.leave_startDate} to {leave.leave_endDate}
            </p>
            {user.user_type === 'TEACHER' && (
              <span className={`flex w-[115px] items-center justify-between rounded-md ${getBgColor()} p-2 text-base text-white`}>
                {leave.leave_approval_status}
                {getBadge()}
              </span>
            )}
          </div>
        );
      });
    } else {
      return <h3 className='text-center font-semibold text-primary'>No recent leaves</h3>;
    }
  };

  const renderYearlyGraph = () => {
    if (isLoading) {
      return <div className='h-[355px] w-full animate-pulse rounded-md bg-slate-300'></div>;
    } else if (data) {
      var stats = {};
      dates.forEach((date) => {
        const month = monthNames[new Date(date).getMonth()];
        stats[month] = stats[month] === undefined ? 1 : stats[month] + 1;
      });
      return (
        <Line
          datasetIdKey='no_of_days'
          options={{
            responsive: true,
            ticks: {
              precision: 0,
            },
          }}
          data={{
            labels: Object.keys(stats).reverse(),
            datasets: [
              {
                label: 'No of days',
                data: Object.values(stats).reverse(),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
              },
            ],
          }}
        />
      );
    } else {
      return <h3 className='text-center font-semibold text-primary'>No Data to show</h3>;
    }
  };

  return (
    <div className='align-start flex flex-col justify-start p-5 md:flex-row md:py-6 md:px-9'>
      {error ? (
        <div className='m-auto flex flex-col items-center text-center font-bold text-orange-600 md:flex-row'>
          <ExclamationIcon className='mr-2 h-8 w-8  text-orange-600' />
          Something went wrong on our side, Please try again later.
        </div>
      ) : (
        <>
          <div className='w-full md:w-[70%]'>
            <div className='flex h-auto w-full flex-col justify-between md:flex-row'>
              <div className=' h-auto w-full  '>
                <h1 className='mb-4 text-2xl font-bold text-primary md:text-3xl'>DashBoard</h1>
                {renderCalendar()}
              </div>
            </div>
            <div className='mt-9'>
              <h1 className='mb-4 text-2xl font-semibold text-primary md:mt-4'>This year</h1>
              {renderYearlyGraph()}
            </div>
          </div>
          <div className='mt-8 h-auto w-auto flex-grow md:mt-0 md:ml-11'>
            <h1 className='mb-4 text-2xl font-semibold text-primary'>Recent Leaves</h1>
            {renderRecentLeaves()}
          </div>
        </>
      )}
    </div>
  );
};

export default UserDashBoard;
