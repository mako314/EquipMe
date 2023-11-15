import { useState } from 'react';

function Calendar() {

  // This will handle the date
  // This gives too much info to be able to pass it to default type, 
  let date = new Date()

  // Get timezone offset in minutes and convert it to milliseconds
  let timezoneOffset = date.getTimezoneOffset() * 60000 // EST

  // Adjust the date to local timezone
  let localStartDate = new Date(date - timezoneOffset)
  // End date the value at the end is 1 extra hjour (minimum 1 hour rental)
  let localEndDate = new Date((date - timezoneOffset) + 3600000)

  // Format the date to "YYYY-MM-DDTHH:mm" format as required by the input :cry:
  let formattedStartDate = localStartDate.toISOString().slice(0, 16)
  //End date
  let formattedEndDate = localEndDate.toISOString().slice(0, 16)

  const addDays = (date, days) => {
    let result = new Date(date);
    result.setDate(result.getDate() + days);
    
    let resultTimezone = result.getTimezoneOffset() * 60000

    let localResult = new Date(result - resultTimezone)

    let formattedResult = localResult.toISOString().slice(0, 16)

    return formattedResult
  }

  console.log("Starting day:", formattedStartDate)
  console.log("One year from now:",addDays(formattedStartDate, 365))

  console.log("End date should be +1 hr:", formattedEndDate)
  console.log("One year from now:",addDays(formattedEndDate, 365))


  return (
    <div className='Calendar bg-white p-4 rounded-lg shadow'>
  <div className='mb-4'>
    <label htmlFor="start-date" className='block text-sm font-medium text-gray-700'>Choose a starting day and time for your rental:</label>
    <input
      type="datetime-local"
      id="start-date"
      name="start-date"
      className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
      min={formattedStartDate}
      max={addDays(formattedStartDate, 365)}
    />
  </div>

  <div className='mb-4'>
    <label htmlFor="end-date" className='block text-sm font-medium text-gray-700'>Choose an ending day and time for your rental:</label>
    <input
      type="datetime-local"
      id="end-date"
      name="end-date"
      className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
      min={formattedStartDate}
      max={addDays(formattedStartDate, 365)}
    />
  </div>
</div>
  )
}

export default Calendar;