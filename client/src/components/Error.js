import { ExclamationIcon } from '@heroicons/react/outline';
import { useEffect } from 'react';

const Error = () => {
  useEffect(() => {
    const refresh = setTimeout(() => window.location.reload(), 30000);

    return () => clearTimeout(refresh);
  });

  return (
    <div className='flex h-[100vh] w-full flex-col items-center justify-center'>
      <div className='flex flex-col items-center text-center font-bold text-orange-600 md:flex-row'>
        <ExclamationIcon className='mr-2 h-8 w-8  text-orange-600' />
        Something went wrong on our side, Please try again later.
      </div>
      <p className='mt-4 text-center font-bold'>You can keep this tab open to automatically try again every 30 seconds.</p>
    </div>
  );
};

export default Error;
