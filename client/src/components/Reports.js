import { useEffect, useState } from 'react';
import { EyeIcon, PrinterIcon, TableIcon, ExclamationIcon } from '@heroicons/react/outline';
import ReportModal from './modals/ReportModal';
import useFetch from '../hooks/useFetch';
import useModal from '../hooks/useModal';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import PulseAnimation from './PulseAnimation';
import base64Img from '../images/logoBase64'; // dynamically import this

const Reports = () => {
  const [reportData, setReportData] = useState(null);
  const [applicantFilter, setApplicantFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [designationFilter, setDesignationFilter] = useState('all');
  const [startDateFilter, setStartDateFilter] = useState(new Date(new Date().getFullYear(), 0, 1).toLocaleDateString('en-CA'));
  const [endDateFilter, setEndDateFilter] = useState(new Date(new Date().getFullYear(), 11, 31).toLocaleDateString('en-CA'));
  const [userTypeFilter, setUserTypeFilter] = useState('all');
  const [modalValues, setModalValues] = useState(null);
  const [data, error, isLoading] = useFetch(`${process.env.REACT_APP_API}/reports/?startdate=${startDateFilter}&enddate=${endDateFilter}`, {});
  const [departments, departmentFetchError, isDepartmentsLoading] = useFetch(`${process.env.REACT_APP_API}/departments`, {});

  const [isModalVisible, setIsModalVisible, toggleModal] = useModal(false);
  var noResults = false;
  var dataForExport = reportData;

  const Row = ({ index, username, user_type, applicant_name, dept_name, total_days, applicant_designation }) => (
    <div className='table-row h-24 w-full '>
      <div
        data-title='Sl.No'
        className={`flex w-full items-center justify-between  ${
          index !== 0 ? 'border-t-2' : 'md:border-t-2'
        } border-secondary p-3 text-center align-middle font-medium before:text-lg before:font-bold before:text-primary before:content-[attr(data-title)] md:table-cell md:w-auto md:border-l-2 md:before:content-none`}
      >
        {index + 1}
      </div>
      <div
        data-title='User Type'
        className={`flex w-full items-center justify-between border-secondary p-3 text-center align-middle font-medium before:text-lg before:font-bold before:text-primary before:content-[attr(data-title)] md:table-cell md:w-auto md:border-l-2 md:border-t-2 md:before:content-none`}
      >
        {user_type}
      </div>
      <div
        data-title='Name'
        className={`flex w-full items-center justify-between border-secondary p-3 text-center align-middle font-medium before:text-lg before:font-bold before:text-primary before:content-[attr(data-title)] md:table-cell md:w-auto md:border-l-2 md:border-t-2 md:before:content-none`}
      >
        {applicant_name}
      </div>
      <div
        data-title='Dept'
        className={`flex w-full items-center justify-between border-secondary p-3 text-center align-middle font-medium before:text-lg before:font-bold before:text-primary before:content-[attr(data-title)] md:table-cell md:w-auto md:border-l-2 md:border-t-2 md:before:content-none`}
      >
        {dept_name ? dept_name : 'Not applicable'}
      </div>
      <div
        data-title='Total Days'
        className={`flex w-full items-center justify-between border-secondary p-3 text-center align-middle font-medium before:text-lg before:font-bold before:text-primary before:content-[attr(data-title)] md:table-cell md:w-auto md:border-l-2 md:border-t-2 md:before:content-none`}
      >
        {total_days}
      </div>
      <div
        data-title='Designation'
        className={`flex w-full items-center justify-between border-secondary p-3 text-center align-middle font-medium before:text-lg before:font-bold before:text-primary before:content-[attr(data-title)] md:table-cell md:w-auto md:border-l-2 md:border-t-2 md:before:content-none`}
      >
        {applicant_designation}
      </div>
      <div
        data-title='Actions'
        className={`flex w-full items-center justify-between border-secondary p-3 text-center align-middle before:text-lg before:font-bold before:text-primary before:content-[attr(data-title)] md:table-cell md:w-auto md:border-l-2 md:border-t-2 md:before:content-none`}
      >
        <EyeIcon
          className='h-7 w-7 cursor-pointer text-accent hover:scale-110 md:m-auto'
          onClick={() => {
            toggleModal();
            setModalValues({ username, user_type, applicant_name, dept_name, total_days, applicant_designation, startDateFilter, endDateFilter });
          }}
        />
      </div>
    </div>
  );

  const renderReports = () => {
    if (isLoading) {
      return <PulseAnimation noOfCells={7} />;
    } else if (reportData) {
      if (applicantFilter || departmentFilter !== 'all' || designationFilter !== 'all' || userTypeFilter !== 'all') {
        let filteredData = reportData;
        let flag;
        if (applicantFilter) {
          flag = 0;
          filteredData = filteredData.filter((report) => new RegExp(`\\b${applicantFilter}`, 'i').test(report.applicant_name));
          if (filteredData.length) {
            flag = 1;
          }
        }
        if (userTypeFilter !== 'all') {
          flag = 0;
          filteredData = filteredData.filter((report) => report.user_type === userTypeFilter);
          if (filteredData.length) {
            flag = 1;
          }
        }
        if (departmentFilter !== 'all') {
          flag = 0;
          //eslint-disable-next-line
          filteredData = filteredData.filter((report) => report.dept_id == departmentFilter);
          if (filteredData.length) {
            flag = 1;
          }
        }
        if (designationFilter !== 'all') {
          flag = 0;
          filteredData = filteredData.filter((report) => report.applicant_designation === designationFilter);
          if (filteredData.length) {
            flag = 1;
          }
        }
        if (!flag) {
          noResults = true;
          dataForExport = [];
        } else {
          noResults = false;
          dataForExport = filteredData;
        }
        return filteredData.map((report, index) => <Row {...report} key={index} index={index} />);
      } else {
        return reportData.map((report, index) => <Row {...report} key={index} index={index} />);
      }
    }
  };

  const renderDepartmentOptions = () => {
    if (isDepartmentsLoading) {
      return <option>Loading...</option>;
    }
    if (departmentFetchError) {
      return (
        <option className='text-red-900' disabled>
          Something went wrong, please try again later
        </option>
      );
    }
    if (departments) {
      return departments
        .filter((department) => department.dept_status)
        .map((department, index) => (
          <option key={index} value={department.dept_id} className='w-full break-words'>
            {department.dept_name}
          </option>
        ));
    }
  };

  const exportPdf = () => {
    if (!dataForExport || !dataForExport.length) {
      return alert('No data to export!');
    }
    const doc = new jsPDF();
    let body = [];
    dataForExport.forEach((data, index) =>
      body.push([index + 1, data.user_type, data.applicant_name, data.dept_name ? data.dept_name : 'Not applicable', data.total_days, data.applicant_designation])
    );

    doc.autoTable({
      margin: { top: 82 }, // Seting top margin for First Page.
      didDrawPage: (data) => {
        var currentPageNo = doc.internal.getCurrentPageInfo().pageNumber;
        var str = 'Page ' + currentPageNo;
        data.settings.margin.top = 10; // Reseting top margin. The change will be reflected only after print the first page.
        if (currentPageNo === 1) {
          doc.addImage(base64Img, 'PNG', 85, 15, 40, 10);
          doc.setFontSize(12);
          doc.text(`Generated At : ${new Date()}`, 20, 70);
          doc.text(`User Type : ${userTypeFilter}`, 20, 40);
          doc.text(`Start Date : ${startDateFilter}`, 20, 46);
          doc.text(`End Date : ${endDateFilter}`, 20, 52);
          doc.text(`Designation : ${designationFilter}`, 20, 58);
          //eslint-disable-next-line
          doc.text(`Department : ${departmentFilter !== 'all' ? departments.find((department) => department.dept_id == departmentFilter).dept_name : 'all'}`, 20, 64);
          applicantFilter && doc.text(`Applicant Name : ${applicantFilter}`, 20, 76);
        }
        doc.setFontSize(10);
        var pageSize = doc.internal.pageSize;
        var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
        doc.text(str, data.settings.margin.left, pageHeight - 10);
      },
      head: [['Sl.No', 'User Type', 'Name', 'Department', 'Total Days', 'Designation']],
      body,
    });
    doc.save('report.pdf');
  };

  const exportCsv = () => {
    if (!dataForExport || !dataForExport.length) {
      return alert('No data to export!');
    }
    var csv = 'Sl.No,User Type,Name,Department,Total Days,Designation\n';
    dataForExport.forEach((data, index) => {
      //eslint-disable-next-line
      csv += `${index + 1},${data.user_type},${data.applicant_name},${data.dept_name ? data.dept_name : 'Not applicable'},${data.total_days},${data.applicant_designation}\n`;
    });
    var file = new Blob([csv], { type: 'text/csv' });
    var a = document.createElement('a');
    var url = URL.createObjectURL(file);
    a.style.display = 'none';
    a.href = url;
    a.download = 'report.csv';
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  };

  useEffect(() => {
    setReportData(data);
  }, [data]);

  return (
    <div className='flex flex-col justify-center p-5 md:py-6 md:px-9'>
      {isModalVisible && (
        <ReportModal
          handleClose={() => {
            setModalValues(null);
            setIsModalVisible(false);
          }}
          modalValues={modalValues}
        />
      )}
      <div className='flex w-full flex-col  items-center md:items-start'>
        <div className='flex w-full flex-col items-center justify-between md:flex-row'>
          <div className='flex items-center'>
            <h1 className='text-2xl font-bold text-primary md:text-3xl'>Reports</h1>
            <div className='ml-3 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-yellow-400 hover:scale-110 '>
              <PrinterIcon className='h-8 w-8 text-white ' onClick={exportPdf} />
            </div>
            <div className='ml-3 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-[#44B35C] hover:scale-110 '>
              <TableIcon className='h-8 w-8 text-white ' onClick={exportCsv} />
            </div>
          </div>
          <div className='mt-5 flex flex-col items-center justify-between md:mt-0 md:flex-row'>
            <div className='relative w-auto'>
              <input
                onChange={(e) => setStartDateFilter(e.target.value)}
                value={startDateFilter}
                type='date'
                max={new Date(new Date().getFullYear(), 11, 31).toLocaleDateString('en-CA')}
                className='h-10 rounded-[3px] border-2 p-3 text-sm font-bold focus:border-accent'
              />
              <span className='pointer-events-none absolute  -top-[10px] left-4 bg-white p-1 text-xs text-[#909090]'>Start Date</span>
            </div>
            <div className='relative mt-3 w-auto md:mt-0 md:ml-3'>
              <input
                onChange={(e) => setEndDateFilter(e.target.value)}
                value={endDateFilter}
                type='date'
                max={new Date(new Date().getFullYear(), 11, 31).toLocaleDateString('en-CA')}
                className='h-10 rounded-[3px] border-2 p-3 text-sm font-bold focus:border-accent'
              />
              <span className='pointer-events-none absolute  -top-[10px] left-4 bg-white p-1 text-xs text-[#909090]'>End Date</span>
            </div>
          </div>
        </div>

        <div className='mt-8 flex h-[220px] w-full flex-col items-center justify-between md:h-auto md:flex-row'>
          <div className='relative w-auto'>
            <input
              onChange={(e) => setApplicantFilter(e.target.value)}
              value={applicantFilter}
              type='text'
              className='ml-3 h-10 w-[280px] rounded-[3px] border-2  p-3 text-sm font-bold focus:border-accent'
              placeholder='filter by applicant name'
            />
            <span className='pointer-events-none absolute  -top-[12px] left-6 bg-white p-1 text-xs text-[#909090]'>Applicant Name</span>
          </div>
          <div className='relative w-auto'>
            <select
              onChange={(e) => setUserTypeFilter(e.target.value)}
              value={userTypeFilter}
              className='ml-3 h-10 w-[280px] rounded-[3px] border-2 border-secondary indent-3 text-sm font-bold outline-none focus:border-accent  md:w-[200px]'
            >
              <option value='all'>All</option>
              <option value='staff'>Staff</option>
              <option value='teacher'>Teacher</option>
            </select>
            <span className='pointer-events-none absolute  -top-[12px] left-6 bg-white p-1 text-xs text-[#909090]'>User Type</span>
          </div>
          <div className='relative w-auto'>
            <select
              onChange={(e) => setDepartmentFilter(e.target.value)}
              value={departmentFilter}
              className='ml-3 h-10 w-[280px] rounded-[3px] border-2 border-secondary indent-3 text-sm font-bold outline-none  focus:border-accent'
            >
              <option value='all'>All</option>
              {renderDepartmentOptions()}
            </select>
            <span className='pointer-events-none absolute  -top-[12px] left-6 bg-white p-1 text-xs text-[#909090]'>Department</span>
          </div>
          <div className='relative w-auto'>
            <select
              onChange={(e) => setDesignationFilter(e.target.value)}
              value={designationFilter}
              className='ml-3 h-10 w-[280px] rounded-[3px] border-2 border-secondary indent-3 text-sm font-bold outline-none focus:border-accent  md:w-[200px]'
            >
              <option value='all'>All</option>
              <option value='Prof'>Prof</option>
              <option value='Asst.Prof'>Asst.Prof</option>
              <option value='HOD'>HOD</option>
              <option value='Accountant'>Accountant</option>
              <option value='Administrator'>Administrator</option>
              <option value='Clerk'>Clerk</option>
              <option value='Librarian'>Librarian</option>
            </select>
            <span className='pointer-events-none absolute  -top-[12px] left-6 bg-white p-1 text-xs text-[#909090]'>Designation</span>
          </div>
        </div>
      </div>
      <div id='table' className='mt-8 mb-28 table w-full border-2 border-secondary md:mb-5 md:rounded-tr-xl md:border-t-0 md:border-l-0'>
        <div className='hidden h-24 w-full md:table-row'>
          <div className='table-cell  rounded-tl-xl border-l-2 border-t-2 border-secondary p-3 text-center align-middle text-lg font-bold text-primary'>Sl.No</div>
          <div className='table-cell border-l-2 border-t-2 border-secondary p-3 text-center align-middle text-lg font-bold text-primary '>User Type</div>
          <div className='table-cell border-l-2 border-t-2 border-secondary p-3 text-center align-middle text-lg font-bold text-primary '>Name</div>
          <div className='table-cell border-l-2 border-t-2 border-secondary p-3 text-center align-middle text-lg font-bold text-primary '>Department</div>
          <div className='table-cell border-l-2 border-t-2 border-secondary p-3 text-center align-middle text-lg font-bold text-primary '>Total Days</div>
          <div className='table-cell border-l-2 border-t-2 border-secondary p-3 text-center align-middle text-lg font-bold text-primary'>Designation</div>
          <div className='table-cell  rounded-tr-xl border-l-2 border-t-2 border-secondary p-3 text-center align-middle text-lg font-bold text-primary'>Actions</div>
        </div>
        {renderReports()}
      </div>
      {error && (
        <div className='m-auto flex flex-col items-center text-center font-bold text-orange-600 md:flex-row'>
          <ExclamationIcon className='mr-2 h-8 w-8  text-orange-600' />
          Something went wrong on our side, Please try again later.
        </div>
      )}
      {noResults && <div className='m-auto text-center font-bold text-red-500'>No results found !</div>}
    </div>
  );
};

export default Reports;
