import { XIcon, PrinterIcon, TableIcon, EyeIcon, ExclamationIcon } from '@heroicons/react/outline';
import { useState, useEffect } from 'react';
import useFetch from '../../hooks/useFetch';
import PulseAnimation from '../PulseAnimation';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import base64Img from '../../images/logoBase64'; // dynamically import this

const ReportModal = ({ modalValues, handleClose }) => {
  const [userReport, setUserReport] = useState(null);
  const [data, error, isLoading] = useFetch(
    `${process.env.REACT_APP_API}/reports/${modalValues.username}?startdate=${modalValues.startDateFilter}&enddate=${modalValues.endDateFilter}`,
    {}
  );

  const exportPdf = (dataType) => {
    if (dataType === 'leaves' && (!userReport || !userReport.leaves.length)) {
      return alert('No data to export !');
    }
    if (dataType === 'categorystats' && (!userReport || !userReport.category_wise_stats.length)) {
      return alert('No data to export !');
    }
    const doc = new jsPDF();
    let body = [];
    if (dataType === 'leaves') {
      userReport.leaves.forEach((data, index) =>
        body.push([index + 1, data.leave_application_date, data.leave_startDate, data.leave_endDate, data.no_of_days, data.category_name, data.leave_reason])
      );
    } else {
      userReport.category_wise_stats.forEach((data, index) => body.push([index + 1, data.category_name, data.total_days]));
    }

    doc.autoTable({
      margin: { top: 82 }, // Seting top margin for First Page.
      didDrawPage: (data) => {
        var currentPageNo = doc.internal.getCurrentPageInfo().pageNumber;
        var str = 'Page ' + currentPageNo;
        data.settings.margin.top = 10; // Reseting top margin. The change will be reflected only after print the first page.
        if (currentPageNo === 1) {
          doc.addImage(base64Img, 'PNG', 85, 15, 40, 10);
          doc.setFontSize(12);
          doc.text(`Generated At : ${new Date()}`, 20, 40);
          doc.text(`Name : ${modalValues.applicant_name}`, 20, 46);
          doc.text(`User Type : ${modalValues.user_type}`, 20, 52);
          doc.text(`Start Date : ${modalValues.startDateFilter}`, 20, 58);
          doc.text(`End Date : ${modalValues.endDateFilter}`, 20, 64);
          doc.text(`Designation : ${modalValues.applicant_designation}`, 20, 70);
          //eslint-disable-next-line
          modalValues.dept_name && doc.text(`Department : ${modalValues.dept_name}`, 20, 76);
        }
        doc.setFontSize(10);
        var pageSize = doc.internal.pageSize;
        var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
        doc.text(str, data.settings.margin.left, pageHeight - 10);
      },
      head: dataType === 'leaves' ? [['Sl.No', 'Apply Date', 'Start Date', 'End Date', 'No of days', 'Category', 'Reason']] : [['Sl.No', 'Category Name', 'No of days']],
      body,
    });
    doc.save(dataType === 'leaves' ? `leave_report_${modalValues.applicant_name}.pdf`.toLowerCase() : `category_wise_stats_${modalValues.applicant_name}.pdf`.toLowerCase());
  };

  const exportCsv = (dataType) => {
    if (dataType === 'leaves' && (!userReport || !userReport.leaves.length)) {
      return alert('No data to export !');
    }
    if (dataType === 'categorystats' && (!userReport || !userReport.category_wise_stats.length)) {
      return alert('No data to export !');
    }
    var csv = dataType === 'leaves' ? 'Sl.No,Apply Date,Start Date,End Date,No of days,Category,Reason,Slip\n' : 'Sl.No,Category Name,No of days\n';
    if (dataType === 'leaves') {
      userReport.leaves.forEach((data, index) => {
        csv += `${index + 1},${data.leave_application_date},${data.leave_startDate},${data.leave_endDate},${data.no_of_days},${data.category_name},${data.leave_reason},asdf\n`;
      });
    } else {
      userReport.category_wise_stats.forEach((data, index) => {
        csv += `${index + 1},${data.category_name},${data.total_days}\n`;
      });
    }
    var file = new Blob([csv], { type: 'text/csv' });
    var a = document.createElement('a');
    var url = URL.createObjectURL(file);
    a.style.display = 'none';
    a.href = url;
    a.download = dataType === 'leaves' ? `leave_report_${modalValues.applicant_name}.csv`.toLowerCase() : `category_wise_stats_${modalValues.applicant_name}.csv`.toLowerCase();
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  };

  const renderLeaves = () => {
    if (isLoading) {
      return <PulseAnimation noOfCells={8} />;
    } else if (userReport) {
      return userReport.leaves.map((leave, index) => {
        const { category_name, leave_application_date, leave_startDate, leave_endDate, no_of_days, leave_slip_image, leave_reason } = leave;
        return (
          <div key={index} className='table-row h-12 w-full'>
            <div
              data-title='Sl.No'
              className={`flex w-full items-center justify-between  ${
                index !== 0 ? 'border-t-2' : 'md:border-t-2'
              } border-secondary p-2 text-center align-middle font-medium before:text-lg before:font-bold before:text-primary before:content-[attr(data-title)] md:table-cell md:w-auto md:border-l-2 md:text-xs md:before:content-none`}
            >
              {index + 1}
            </div>
            <div
              data-title='Apply Date'
              className={`flex w-full items-center justify-between border-secondary p-2 text-center align-middle font-medium before:text-lg before:font-bold before:text-primary before:content-[attr(data-title)] md:table-cell md:w-auto md:border-l-2 md:border-t-2 md:text-xs md:before:content-none`}
            >
              {leave_application_date}
            </div>
            <div
              data-title='Start Date'
              className={`flex w-full items-center justify-between border-secondary p-2 text-center align-middle font-medium before:text-lg before:font-bold before:text-primary before:content-[attr(data-title)] md:table-cell md:w-auto md:border-l-2 md:border-t-2 md:text-xs md:before:content-none`}
            >
              {leave_startDate}
            </div>
            <div
              data-title='End Date'
              className={`flex w-full items-center justify-between border-secondary p-2 text-center align-middle font-medium before:text-lg before:font-bold before:text-primary before:content-[attr(data-title)] md:table-cell md:w-auto md:border-l-2 md:border-t-2 md:text-xs md:before:content-none`}
            >
              {leave_endDate}
            </div>
            <div
              data-title='No of days'
              className={`flex w-full items-center justify-between border-secondary p-2 text-center align-middle font-medium before:text-lg before:font-bold before:text-primary before:content-[attr(data-title)] md:table-cell md:w-auto md:border-l-2 md:border-t-2 md:text-xs md:before:content-none`}
            >
              {no_of_days}
            </div>
            <div
              data-title='Category'
              className={`flex w-full items-center justify-between border-secondary p-2 text-center align-middle font-medium before:text-lg before:font-bold before:text-primary before:content-[attr(data-title)] md:table-cell md:w-auto md:border-l-2 md:border-t-2 md:text-xs md:before:content-none`}
            >
              {category_name}
            </div>
            <div
              data-title='Reason'
              className={`flex w-full items-center justify-between border-secondary p-2 text-center align-middle font-medium before:text-lg before:font-bold before:text-primary before:content-[attr(data-title)] md:table-cell md:w-auto md:border-l-2 md:border-t-2 md:text-xs md:before:content-none`}
            >
              {leave_reason}
            </div>

            <div
              data-title='Slip'
              className={`flex w-full items-center justify-between border-secondary p-2 text-center align-middle before:text-lg before:font-bold before:text-primary before:content-[attr(data-title)] md:table-cell md:w-auto  md:border-l-2 md:border-t-2 md:text-xs md:before:content-none`}
            >
              <div className='flex items-center justify-center'>
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

  const renderCategoryWiseStats = () => {
    if (isLoading) {
      return <PulseAnimation noOfCells={3} />;
    } else if (userReport) {
      return userReport.category_wise_stats.map((stat, index) => {
        const { category_name, total_days } = stat;
        return (
          <div key={index} className='table-row h-12 w-full'>
            <div
              data-title='Sl.No'
              className={`flex w-full items-center justify-between  ${
                index !== 0 ? 'border-t-2' : 'md:border-t-2'
              } border-secondary p-2 text-center align-middle font-medium before:text-lg before:font-bold before:text-primary before:content-[attr(data-title)] md:table-cell md:w-auto md:border-l-2 md:text-xs md:before:content-none`}
            >
              {index + 1}
            </div>
            <div
              data-title='Apply Date'
              className={`flex w-full items-center justify-between border-secondary p-2 text-center align-middle font-medium before:text-lg before:font-bold before:text-primary before:content-[attr(data-title)] md:table-cell md:w-auto md:border-l-2 md:border-t-2 md:text-xs md:before:content-none`}
            >
              {category_name}
            </div>
            <div
              data-title='Slip'
              className={`flex w-full items-center justify-between border-secondary p-2 text-center align-middle before:text-lg before:font-bold before:text-primary before:content-[attr(data-title)] md:table-cell md:w-auto  md:border-l-2 md:border-t-2 md:text-xs md:before:content-none`}
            >
              {total_days}
            </div>
          </div>
        );
      });
    }
  };

  useEffect(() => {
    setUserReport(data);
  }, [data]);

  return (
    <div className='fixed left-0 right-0 bottom-0 z-40 flex h-screen w-screen items-center justify-center bg-black/25' onClick={handleClose}>
      <div
        className='flex h-auto max-h-[95vh] w-[90%] flex-col items-start justify-start  rounded-[3px] bg-white p-6 drop-shadow-lg  md:w-[700px]'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='mb-3 flex w-full items-center justify-between'>
          <h1 className='text-lg font-bold text-primary'>{modalValues.applicant_name}</h1>
          <h1 className='text-base font-semibold text-primary'>
            {modalValues.startDateFilter} to {modalValues.endDateFilter}
          </h1>
          <button type='button' onClick={handleClose} className='cursor-pointer hover:bg-secondary disabled:cursor-not-allowed'>
            <XIcon className='h-8 w-8' />
          </button>
        </div>
        <div className='mb-3 flex items-center'>
          <h1 className=' text-base font-bold text-primary'>All leaves</h1>
          <div className='ml-3 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-yellow-400 hover:scale-110 '>
            <PrinterIcon className='h-6 w-6 text-white ' onClick={() => exportPdf('leaves')} />
          </div>
          <div className='ml-3 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#44B35C] hover:scale-110 '>
            <TableIcon className='h-6 w-6 text-white ' onClick={() => exportCsv('leaves')} />
          </div>
        </div>
        <div className='mb-4 max-h-[200px] w-full overflow-y-auto  '>
          <div id='table' className=' table w-full border-2 border-secondary md:rounded-tr-xl md:border-t-0 md:border-l-0 '>
            <div className='hidden h-12 w-full md:table-row'>
              <div className='table-cell  rounded-tl-xl border-l-2 border-t-2 border-secondary p-2 text-center align-middle text-sm font-bold text-primary'>Sl.No</div>
              <div className='table-cell border-l-2 border-t-2 border-secondary p-2 text-center align-middle text-sm font-bold text-primary '>Apply date</div>
              <div className='table-cell border-l-2 border-t-2 border-secondary p-2 text-center align-middle text-sm font-bold text-primary '>Start Date</div>
              <div className='table-cell border-l-2 border-t-2 border-secondary p-2 text-center align-middle text-sm font-bold text-primary '>End Date</div>
              <div className='table-cell border-l-2 border-t-2 border-secondary p-2 text-center align-middle text-sm font-bold text-primary '>No of days</div>
              <div className='table-cell border-l-2 border-t-2 border-secondary p-2 text-center align-middle text-sm font-bold text-primary'>Category</div>
              <div className='table-cell border-l-2 border-t-2 border-secondary p-2 text-center align-middle text-sm font-bold text-primary'>Reason</div>
              <div className='table-cell  rounded-tr-xl border-l-2 border-t-2 border-secondary p-2 text-center align-middle text-sm font-bold text-primary'>Slip</div>
            </div>
            {renderLeaves()}
          </div>
          {userReport && !userReport.leaves.length && <h1 className='mt-2 text-center font-bold text-red-600'>No leaves to show !</h1>}
          {error && (
            <div className='m-auto flex flex-col items-center justify-center text-center font-bold text-orange-600 md:flex-row'>
              <ExclamationIcon className=' my-3 h-5 w-5  text-orange-600' />
              Something went wrong on our side, Please try again later.
            </div>
          )}
        </div>
        <div className='mb-3 flex  items-center'>
          <h1 className=' text-base font-bold text-primary'>Category wise leave stats</h1>
          <div className='ml-3 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-yellow-400 hover:scale-110 '>
            <PrinterIcon className='h-6 w-6 text-white ' onClick={() => exportPdf('categorystats')} />
          </div>
          <div className='ml-3 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#44B35C] hover:scale-110 '>
            <TableIcon className='h-6 w-6 text-white ' onClick={() => exportCsv('categorystats')} />
          </div>
        </div>
        <div className=' h-[200px] w-full overflow-y-auto '>
          <div id='table' className=' table w-full border-2 border-secondary md:rounded-tr-xl md:border-t-0 md:border-l-0'>
            <div className='hidden h-12 w-full md:table-row'>
              <div className='table-cell  rounded-tl-xl border-l-2 border-t-2 border-secondary p-2 text-center align-middle text-sm font-bold text-primary'>Sl.No</div>
              <div className='table-cell border-l-2 border-t-2 border-secondary p-2 text-center align-middle text-sm font-bold text-primary '>Category Name</div>
              <div className='table-cell  rounded-tr-xl border-l-2 border-t-2 border-secondary p-2 text-center align-middle text-sm font-bold text-primary'>No of days</div>
            </div>
            {renderCategoryWiseStats()}
          </div>
          {error && (
            <div className='m-auto flex flex-col items-center justify-center text-center font-bold text-orange-600 md:flex-row'>
              <ExclamationIcon className=' my-3 h-5 w-5  text-orange-600' />
              Something went wrong on our side, Please try again later.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
