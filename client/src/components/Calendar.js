// code taken from https://css-tricks.com/how-to-make-a-monthly-calendar-with-real-data/ and customized for react and tailwind

import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import { useState } from 'react';

dayjs.extend(weekday);
dayjs.extend(weekOfYear);

const INITIAL_YEAR = dayjs().format('YYYY');
const INITIAL_MONTH = dayjs().format('M');
const TODAY = dayjs().format('YYYY-MM-DD');
var selectedMonth = dayjs(new Date(INITIAL_YEAR, INITIAL_MONTH - 1, 1));
var currentMonthDays = createDaysForCurrentMonth(INITIAL_YEAR, INITIAL_MONTH);
var previousMonthDays = createDaysForPreviousMonth(INITIAL_YEAR, INITIAL_MONTH, currentMonthDays[0]);
var nextMonthDays = createDaysForNextMonth(INITIAL_YEAR, INITIAL_MONTH);

function getNumberOfDaysInMonth(year, month) {
  return dayjs(`${year}-${month}-01`).daysInMonth();
}
function getWeekday(date) {
  return dayjs(date).weekday();
}

function createDaysForCurrentMonth(year, month) {
  return [...Array(getNumberOfDaysInMonth(year, month))].map((day, index) => {
    return {
      date: dayjs(`${year}-${month}-${index + 1}`).format('YYYY-MM-DD'),
      dayOfMonth: index + 1,
      isCurrentMonth: true,
      // isLeave: check inside leaveDates prop array
    };
  });
}

function createDaysForPreviousMonth(year, month) {
  const firstDayOfTheMonthWeekday = getWeekday(currentMonthDays[0].date);
  const previousMonth = dayjs(`${year}-${month}-01`).subtract(1, 'month');
  const visibleNumberOfDaysFromPreviousMonth = firstDayOfTheMonthWeekday ? firstDayOfTheMonthWeekday - 1 : 6;
  const previousMonthLastMondayDayOfMonth = dayjs(currentMonthDays[0].date).subtract(visibleNumberOfDaysFromPreviousMonth, 'day').date();
  return [...Array(visibleNumberOfDaysFromPreviousMonth)].map((day, index) => {
    return {
      date: dayjs(`${previousMonth.year()}-${previousMonth.month() + 1}-${previousMonthLastMondayDayOfMonth + index}`).format('YYYY-MM-DD'),
      dayOfMonth: previousMonthLastMondayDayOfMonth + index,
      isCurrentMonth: false,
    };
  });
}

function createDaysForNextMonth(year, month) {
  const lastDayOfTheMonthWeekday = getWeekday(`${year}-${month}-${currentMonthDays.length}`);
  const nextMonth = dayjs(`${year}-${month}-01`).add(1, 'month');
  const visibleNumberOfDaysFromNextMonth = lastDayOfTheMonthWeekday ? 7 - lastDayOfTheMonthWeekday : lastDayOfTheMonthWeekday;
  return [...Array(visibleNumberOfDaysFromNextMonth)].map((day, index) => {
    return {
      date: dayjs(`${nextMonth.year()}-${nextMonth.month() + 1}-${index + 1}`).format('YYYY-MM-DD'),
      dayOfMonth: index + 1,
      isCurrentMonth: false,
    };
  });
}

const Calendar = ({ yearlyLeaves }) => {
  const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const [currentYear, setCurrentYear] = useState(INITIAL_YEAR);
  const [currentMonth, setCurrentMonth] = useState(INITIAL_MONTH);

  const [days, setDays] = useState([...previousMonthDays, ...currentMonthDays, ...nextMonthDays]);

  const updateDays = () => {
    currentMonthDays = createDaysForCurrentMonth(selectedMonth.format('YYYY'), selectedMonth.format('M'));
    previousMonthDays = createDaysForPreviousMonth(selectedMonth.format('YYYY'), selectedMonth.format('M'), currentMonthDays[0]);
    nextMonthDays = createDaysForNextMonth(selectedMonth.format('YYYY'), selectedMonth.format('M'));
    setDays([...previousMonthDays, ...currentMonthDays, ...nextMonthDays]);
  };

  const updateMonth = (action) => {
    if (action === 'increment') {
      if (dayjs(selectedMonth).add(1, 'month').format('YYYY') > dayjs().year()) {
        return;
      }
      selectedMonth = dayjs(selectedMonth).add(1, 'month');
    } else if (action === 'decrement') {
      if (dayjs(selectedMonth).subtract(1, 'month').format('YYYY') < dayjs().year()) {
        return;
      }
      selectedMonth = dayjs(selectedMonth).subtract(1, 'month');
    } else {
      selectedMonth = dayjs(new Date(INITIAL_YEAR, INITIAL_MONTH - 1, 1));
    }
    setCurrentYear(selectedMonth.format('YYYY'));
    setCurrentMonth(selectedMonth.format('M'));
    updateDays();
  };
  const renderDays = () => {
    return days.map((day, index) => {
      var bgColor;
      if (!day.isCurrentMonth) {
        bgColor = 'bg-grey-100';
      } else if (yearlyLeaves.includes(day.date) /* replace with a faster searching technique like binary tree or something */) {
        bgColor = 'bg-red-100';
      } else {
        bgColor = 'bg-white';
      }
      return (
        <li key={index} className={`relative min-h-[40px] ${bgColor} p-1 text-base text-gray-800`}>
          <span className={`absolute right-[2px] flex h-5 w-5 items-center justify-center ${day.date === TODAY ? 'rounded-full bg-primary text-white' : ''}`}>
            {day.dayOfMonth}
          </span>
        </li>
      );
    });
  };

  return (
    //  parent div
    <div className='relative border-2 border-gray-200 bg-gray-200'>
      {/* header section */}
      <section className='flex justify-between bg-white p-3'>
        {/* Month Name */}
        <div className='text-xl font-semibold text-primary'>{dayjs(new Date(currentYear, currentMonth - 1)).format('MMMM YYYY')}</div>
        {/* Pagination Menu */}
        <div className='mr-6 flex w-20 items-center justify-between'>
          <span className='scale-150 cursor-pointer' onClick={() => updateMonth('decrement')}>
            &#8592;
          </span>
          <span className='mx-3 cursor-pointer' onClick={() => updateMonth('currentMonth')}>
            Today
          </span>
          <span className='scale-150 cursor-pointer' onClick={() => updateMonth('increment')}>
            &rarr;
          </span>
        </div>
      </section>
      {/* Days of the week header */}
      <ol className='grid grid-cols-7 bg-white pb-1  text-lg text-gray-800'>
        {WEEKDAYS.map((weekday, index) => (
          <li key={index} className='pr-1 text-right'>
            {weekday}
          </li>
        ))}
      </ol>
      {/* Calendar grid */}
      <ol className='relative grid h-full grid-cols-7 gap-[1px] border-t-2 border-gray-200'>{renderDays()}</ol>
    </div>
  );
};

export default Calendar;
