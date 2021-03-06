import { useState } from 'react';

const ToggleButton = ({ status, onToggle }) => {
  const [isChecked, setIsChecked] = useState(status);

  const handleClick = () => {
    setIsChecked(!isChecked);
    onToggle().catch((error) => {
      alert('something went wrong');
      setIsChecked(!isChecked ? false : true);
    });
  };
  return (
    <div className='relative mr-2 inline-block w-10 select-none align-middle' onClick={() => handleClick()}>
      <input
        type='checkbox'
        name='toggle'
        id='toggle'
        className='absolute block h-6 w-6 cursor-pointer appearance-none rounded-full border-4 bg-white '
        checked={isChecked}
        readOnly
      />
      <label className='toggle-label block h-6 cursor-pointer overflow-hidden rounded-full bg-gray-300 '></label>
    </div>
  );
};

export default ToggleButton;
