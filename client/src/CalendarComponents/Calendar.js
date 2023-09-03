// import { Menu, Transition } from '@headlessui/react'
// import { DotsVerticalIcon } from '@heroicons/react/outline'
// import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid'

import React, { Fragment, useState, useEffect, useRef } from 'react';


import {
  add,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isEqual,
  isSameDay,
  isSameMonth,
  isToday,
  parse,
  parseISO,
  startOfToday,
} from 'date-fns'


const meetings = [
  {
    id: 1,
    name: 'Leslie Alexander',
    imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    startDatetime: '2023-09-05T14:00',
    endDatetime: '2023-09-05T15:00',
  },
  {
    id: 2,
    name: 'Michael Foster',
    imageUrl:
      'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    startDatetime: '2023-09-02T14:00',
    endDatetime: '2023-09-02T16:00',
  },
  {
    id: 3,
    name: 'Dries Vincent',
    imageUrl:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    startDatetime: '2023-09-02T14:00',
    endDatetime: '2023-09-01T14:00',
  }
]



let arrowRight = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
<path fillRule="evenodd" d="M5 10a.75.75 0 01.75-.75h6.638L10.23 7.29a.75.75 0 111.04-1.08l3.5 3.25a.75.75 0 010 1.08l-3.5 3.25a.75.75 0 11-1.04-1.08l2.158-1.96H5.75A.75.75 0 015 10z" clipRule="evenodd" />
</svg>


let arrowLeft = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
<path fillRule="evenodd" d="M15 10a.75.75 0 01-.75.75H7.612l2.158 1.96a.75.75 0 11-1.04 1.08l-3.5-3.25a.75.75 0 010-1.08l3.5-3.25a.75.75 0 111.04 1.08L7.612 9.25h6.638A.75.75 0 0115 10z" clipRule="evenodd" />
</svg>




function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Calendar() {


  let today = startOfToday()

  //State Variables
  const [selectedDay, setSelectedDay] = useState(today)
  const [currentMonth, setCurrentMonth] = useState(format(today, 'MMM-yyyy'))

//----------------------------------------------------Selecting multiple dates--------------------------------------------------------------------------------------------
  // State to track the selected range
  const [selecting, setSelecting] = useState(false);
  const [selectedRange, setSelectedRange] = useState({ start: null, end: null });

  
  // Ref for the container to measure dimensions
  const containerRef = useRef(null);


   // Event handlers for drag selection
  //  const handleMouseDown = (day) => {
  //   setSelecting(true);
  //   setSelectedRange({ start: day, end: day });
  // };

  // const handleMouseMove = (day) => {
  //   if (selecting) {
  //     setSelectedRange((prevRange) => ({
  //       start: prevRange.start,
  //       end: day,
  //     }));
  //   }
  // };

  // const handleMouseUp = () => {
  //   setSelecting(false);
  // };
  
  let firstDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date())



  let days = eachDayOfInterval({
    start: firstDayCurrentMonth,
    end: endOfMonth(firstDayCurrentMonth),
  })
//----------------------------------------------------Clicking through months--------------------------------------------------------------------------------------------

  function previousMonth() {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 })
    setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'))
  }

  function nextMonth() {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 })
    setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'))
  }
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  let selectedDayMeetings = meetings.filter((meeting) =>
    isSameDay(parseISO(meeting.startDatetime), selectedDay)
  )

  const handleDateClick = (day) => {
    if (!selectedRange.start) {
      // If start date is not set, set it
      setSelectedRange({ start: day, end: null });
    } else if (!selectedRange.end) {
      // If end date is not set, extend the range or reset if clicking the same date
      if (isSameDay(selectedRange.start, day)) {
        setSelectedRange({ start: day, end: null }); // Reset selection if clicking the same date
      } else {
        setSelectedRange((prevRange) => ({
          start: prevRange.start,
          end: day,
        }));
      }
    } else {
      // If both start and end dates are set, reset the selection
      setSelectedRange({ start: day, end: null });
    }
  };

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  return (
    <div className="pt-16 ">
      <div className="max-w-md px-4 mx-auto sm:px-7 md:max-w-4xl md:px-6 border-solid border-2 border-black my-12">
        <div className="md:grid md:grid-cols-2 md:divide-x md:divide-gray-200">
          <div className="md:pr-14">
            <div className="flex items-center">
              <h2 className="flex-auto font-semibold text-gray-900">
                {format(firstDayCurrentMonth, 'MMMM yyyy')}
              </h2>
              <button
                type="button"
                onClick={previousMonth}
                className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Previous month</span>
                {/* <ChevronLeftIcon className="w-5 h-5" aria-hidden="true" /> */}
                {arrowLeft}
              </button>
              <button
                onClick={nextMonth}
                type="button"
                className="-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Next month</span>
                {/* <ChevronRightIcon className="w-5 h-5" aria-hidden="true" /> */}
                {arrowRight}
              </button>
            </div>
            <div className="grid grid-cols-7 mt-10 text-xs leading-6 text-center text-gray-500">
              <div>S</div>
              <div>M</div>
              <div>T</div>
              <div>W</div>
              <div>T</div>
              <div>F</div>
              <div>S</div>
            </div>
            <div className="grid grid-cols-7 mt-2 text-sm" ref={containerRef}>
                {days.map((day, dayIdx) => (
                <div
                key={day.toString()}
                className={classNames(
                  dayIdx === 0 && colStartClasses[getDay(day)],
                  'py-1.5',
                  // Apply selected styles for the selected range
                  selectedRange.start &&
                    selectedRange.end &&
                    day >= selectedRange.start &&
                    day <= selectedRange.end &&
                    'bg-amber-300 rounded-full', // You can customize the selected range style
                  )}
                  onClick={() => handleDateClick(day)} // Handle date click to set the range
              >
                  <button
              type="button"
              className={classNames(
                isEqual(day, selectedRange.start) ||
                  isEqual(day, selectedRange.end)
                  ? ''
                  : !isEqual(day, selectedRange.start) &&
                    isToday(day) &&
                    'text-red-500',
                !isEqual(day, selectedRange.start) &&
                  !isEqual(day, selectedRange.end) &&
                  isSameMonth(day, firstDayCurrentMonth) &&
                  'text-gray-900',
                !isEqual(day, selectedRange.start) &&
                  !isEqual(day, selectedRange.end) &&
                  !isSameMonth(day, firstDayCurrentMonth) &&
                  'text-gray-400',
                // Remove the 'bg-gray-900' class for selected dates
                (isEqual(day, selectedRange.start) ||
                  isEqual(day, selectedRange.end)) &&
                  'bg-opacity-0',
                !isEqual(day, selectedRange.start) &&
                  !isEqual(day, selectedRange.end) &&
                  'hover:bg-gray-200',
                (isEqual(day, selectedRange.start) ||
                  isEqual(day, selectedRange.end) ||
                  isToday(day)) &&
                  'font-semibold',
                'mx-auto flex h-8 w-8 items-center justify-center rounded-full'
              )}
            >
                    <time dateTime={format(day, 'yyyy-MM-dd')}>
                      {format(day, 'd')}
                    </time>
                  </button>

                  <div className="w-1 h-1 mx-auto mt-1">
                    {meetings.some((meeting) =>
                      isSameDay(parseISO(meeting.startDatetime), day)
                    ) && (
                      <div className="w-1 h-1 rounded-full bg-sky-500"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <section className="mt-12 md:mt-0 md:pl-14">
            <h2 className="font-semibold text-gray-900">
              Schedule for{' '}
              <time dateTime={format(selectedDay, 'yyyy-MM-dd')}>
                {format(selectedDay, 'MMM dd, yyy')}
              </time>
            </h2>
            <ol className="mt-4 space-y-1 text-sm leading-6 text-gray-500">
              {selectedDayMeetings.length > 0 ? (
                selectedDayMeetings.map((meeting) => (
                  <Meeting meeting={meeting} key={meeting.id} />
                ))
              ) : (
                <p>No meetings for today.</p>
              )}
            </ol>
          </section>
        </div>
      </div>
    </div>
  )
}

function Meeting({ meeting }) {
  let startDateTime = parseISO(meeting.startDatetime)
  let endDateTime = parseISO(meeting.endDatetime)

  return (
    <li className="flex items-center px-4 py-2 space-x-4 group rounded-xl focus-within:bg-gray-100 hover:bg-gray-100">
      <img
        src={meeting.imageUrl}
        alt=""
        className="flex-none w-10 h-10 rounded-full"
      />
      <div className="flex-auto">
        <p className="text-gray-900">{meeting.name}</p>
        <p className="mt-0.5">
          <time dateTime={meeting.startDatetime}>
            {format(startDateTime, 'h:mm a')}
          </time>{' '}
          -{' '}
          <time dateTime={meeting.endDatetime}>
            {format(endDateTime, 'h:mm a')}
          </time>
        </p>
      </div>
      {/* <Menu */}
        as="div"
        className="relative opacity-0 focus-within:opacity-100 group-hover:opacity-100"
      {/* > */}
        <div>
          {/* <Menu.Button className="-m-2 flex items-center rounded-full p-1.5 text-gray-500 hover:text-gray-600"> */}
            <span className="sr-only">Open options</span>
            {/* <DotsVerticalIcon className="w-6 h-6" aria-hidden="true" /> */}
          {/* </Menu.Button> */}
        </div>

        {/* <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        > */}
          {/* <Menu.Items className="absolute right-0 z-10 mt-2 origin-top-right bg-white rounded-md shadow-lg w-36 ring-1 ring-black ring-opacity-5 focus:outline-none"> */}
            <div className="py-1">
              {/* <Menu.Item> */}
                {({ active }) => (
                  <a
                    href="#"
                    className={classNames(
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                      'block px-4 py-2 text-sm'
                    )}
                  >
                    Edit
                  </a>
                )}
              {/* </Menu.Item> */}
              {/* <Menu.Item> */}
                {({ active }) => (
                  <a
                    href="#"
                    className={classNames(
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                      'block px-4 py-2 text-sm'
                    )}
                  >
                    Cancel
                  </a>
                )}
              {/* </Menu.Item> */}
            </div>
          {/* </Menu.Items> */}
        {/* </Transition> */}
      {/* </Menu> */}
    </li>
  )
}

let colStartClasses = [
  '',
  'col-start-2',
  'col-start-3',
  'col-start-4',
  'col-start-5',
  'col-start-6',
  'col-start-7',
]