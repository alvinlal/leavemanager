const PulseAnimation = ({ noOfCells }) => {
  const renderCells = () => {
    let cells = [];

    for (let i = 1; i <= noOfCells; i++) {
      cells.push(
        <div
          key={i}
          className={`flex w-full items-center justify-between border-secondary p-3 text-center align-middle md:table-cell md:w-auto md:border-l-2 ${
            i === 1 ? 'border-t-2 md:border-t-2' : 'md:border-t-2'
          } `}
        >
          <div className='m-auto h-[15px] w-[80%] animate-pulse rounded-sm bg-slate-400'></div>
        </div>
      );
    }

    return cells;
  };

  return (
    <>
      <div className='table-row h-24 w-full'>{renderCells()}</div>
      <div className='table-row h-24 w-full'>{renderCells()}</div>
      <div className='table-row h-24 w-full'>{renderCells()}</div>
      <div className='table-row h-24 w-full'>{renderCells()}</div>
    </>
  );
};

export default PulseAnimation;
