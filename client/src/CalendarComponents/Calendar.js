import { useState } from 'react';
import 'react-calendar/dist/Calendar.css';

function Calendar() {

  // This will handle the first input / Start Date

  // This gives too much info to be able to pass it to default type, 
  let startDate = new Date();
  // Get timezone offset in minutes and convert it to milliseconds
  let timezoneOffset = startDate.getTimezoneOffset() * 60000
  // Adjust the date to local timezone
  let localDate = new Date(startDate - timezoneOffset)
  // Format the date to "YYYY-MM-DDTHH:mm" format
  let formattedDate = localDate.toISOString().slice(0, 16)

  const addDays = (date, days) => {
    let result = new Date(date);
    result.setDate(result.getDate() + days);
    
    let resultTimezone = result.getTimezoneOffset() * 60000

    let localResult = new Date(result - resultTimezone)

    let formattedResult = localResult.toISOString().slice(0, 16)

    return formattedResult
  }

  console.log("Starting day:", formattedDate)
  console.log("One year from now:",addDays(formattedDate, 365))


  return (
    <div className='app'>
      <label for="meeting-time">Choose a time for your appointment:</label>

      <input
        type="datetime-local"
        id="meeting-time"
        name="meeting-time"
        // value={formattedDate}
        min = {formattedDate}
        max={addDays(formattedDate, 365)}
        />

    </div>
  );
}

export default Calendar;