import { useState } from 'react';

function Calendar() {

  // This will handle the first input / Start Date

  // This gives too much info to be able to pass it to default type, 
  let startDate = new Date()
  console.log(typeof(startDate))
  console.log(startDate)
  let endDate = new Date()

  // Get timezone offset in minutes and convert it to milliseconds
  let timezoneOffset = startDate.getTimezoneOffset() * 60000 // EST

  // Adjust the date to local timezone
  let localStartDate = new Date(startDate - timezoneOffset)
  let localEndDate = new Date((endDate - timezoneOffset) + 3600000)

  // Format the date to "YYYY-MM-DDTHH:mm" format as required by the input :cry:
  let formattedStartDate = localStartDate.toISOString().slice(0, 16)
  //End
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
    <div className='Calendar'>
      <label for="meeting-time">Choose a starting day and time for your rental:  </label>

      <input
        type="datetime-local"
        id="meeting-time"
        name="meeting-time"
        // value={formattedDate}
        min = {formattedStartDate}
        max={addDays(formattedStartDate, 365)}
        />

    </div>
  );
}

export default Calendar;