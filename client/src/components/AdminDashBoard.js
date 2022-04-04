import { ExclamationIcon } from '@heroicons/react/outline';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip } from 'chart.js';
import { Line } from 'react-chartjs-2';
import useFetch from '../hooks/useFetch';
import useDeviceDetect from '../hooks/useDeviceDetect';

ChartJS.register(LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip);

const AdminDashBoard = () => {
  const [data, error, isLoading] = useFetch(`${process.env.REACT_APP_API}/dashboard`);
  const isMobile = useDeviceDetect();

  const renderDepartmentWiseGraph = () => {
    if (isLoading) {
      return <div className='h-[355px] w-full animate-pulse rounded-md bg-slate-300'></div>;
    } else if (data) {
      return (
        <Line
          datasetIdKey='no_of_leaves'
          options={{
            responsive: true,
            ticks: {
              precision: 0,
            },
            parsing: {
              xAxisKey: 'dept_name',
              yAxisKey: 'no_of_leaves',
            },
            ...(isMobile && {
              scales: {
                x: {
                  ticks: {
                    maxRotation: 80,
                    minRotation: 80,
                  },
                },
              },
            }),
          }}
          data={{
            datasets: [
              {
                label: 'No of days',
                data,
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
    <div className='mt-3 ml-3 flex h-full w-[90%] items-center justify-center '>
      {error ? (
        <div className='m-auto flex flex-col items-center text-center font-bold text-orange-600 md:flex-row'>
          <ExclamationIcon className='mr-2 h-8 w-8  text-orange-600' />
          Something went wrong on our side, Please try again later.
        </div>
      ) : (
        renderDepartmentWiseGraph()
      )}
    </div>
  );
};

export default AdminDashBoard;
