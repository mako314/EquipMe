import React, { useState, useEffect } from 'react';

function Calendar() {
  
  const [startRental, setStartRental] = useState('')
  const [endRental, setEndRental] = useState('')
  const [formattedStartDate, setFormattedStartDate] = useState('')
  const [formattedEndDate, setFormattedEndDate] = useState('')

  // This will handle the date
  // This gives too much info to be able to pass it to default type, 
  // let date = new Date()
  // Get timezone offset in minutes and convert it to milliseconds
  // let timezoneOffset = date.getTimezoneOffset() * 60000 // EST

  // Adjust the date to local timezone
  // let localStartDate = new Date(date - timezoneOffset)
  // End date the value at the end is 1 extra hjour (minimum 1 hour rental)
  // let localEndDate = new Date((date - timezoneOffset) + 3600000)

  // Format the date to "YYYY-MM-DDTHH:mm" format as required by the input :cry:
  // let formattedStartDate = localStartDate.toISOString().slice(0, 16)
  // End date
  // let formattedEndDate = localEndDate.toISOString().slice(0, 16)

  // So initially I was just setting variables openly, but instead I opted to for an useEffect as it starts.
  useEffect(() => {
    // Initial setup for start date
    let date = new Date();
    setFormattedStartDate(formatDate(date))

    // Initial setup for end date (one hour later)
    let endDate = new Date(date.getTime() + 3600000) // One hour later
    setFormattedEndDate(formatDate(endDate))
  }, [])

  console.log("format start:", formattedStartDate)
  console.log("format end:", formattedEndDate)

  // Was just setting formatted variables with let, instead I made a function that formats them.
  const formatDate = (date) => {
    // Was having a lot of issues and couldn't tell where from, so I wrote some validations to test what could be going wrong
    if (!(date instanceof Date) || isNaN(date)) {
      console.error('Invalid date provided to formatDate:', date)
      return null
    }
    // Adjust the date to local timezone
    let timezoneOffset = date.getTimezoneOffset() * 60000
    // To get the local date, you just take the date (which we test to see if it was an instance of Date, since the useEffect makes it so it continues). When subtracting timezoneOffset, you just get the appropriate time, 24hr format.
    let localDate = new Date(date - timezoneOffset)
    // Slice so I don't get the very long info, 
    return localDate.toISOString().slice(0, 16)
  }

  const addDays = (dateStr, days) => {
    // Was having a lot of issues and couldn't tell where from, so I wrote some validations to test what could be going wrong
    if (!(dateStr instanceof Date) || isNaN(dateStr)) {
      console.error('Invalid date provided to addDays:', dateStr)
      return null
    }
    
    // This adds on x amount of days from the date. .getDate gets the date, today being 11/15/2023, it gets 15. Then adds days to it. Only using this to add a year (365)
    let date = new Date(dateStr)
    date.setDate(date.getDate() + days)

    // Format the new day we have! 
    return formatDate(date)
  }

  //Handles changing the START date
  const handleStartDateChange = (event) => {
    //Set Start date, 
    setStartRental(event.target.value)

    //Set the new end date off the same value, then calculate one hour ahead (so minimum booking is 1hr)
    let newEndDate = new Date(new Date(event.target.value).getTime() + 3600000) // One hour later

    //Formatted data (min value of the input) becomes newEndDate
    setFormattedEndDate(formatDate(newEndDate))

    // If the new Date (end) is less than the end date ( which gets set after you set or re-set the start rental date) essentially reset the end date to a new starting position
    if (new Date(endRental) < newEndDate) {
      setEndRental(formatDate(newEndDate))
    }
  }

  //
  const handleEndDateChange = (event) => {
    let newEnd = new Date(event.target.value)
    let currentStart = new Date(startRental)
    
    //Tests whether or not the end that was set when you picked the start (remember must be 1hr more preset). If graeter than, then allow setting

    if (newEnd > currentStart) {
      setEndRental(event.target.value)
    } else {
      //  alert the user going to use toastify here
      console.warn("End date must be at least one hour after the start date.")
    }
  }

  //So this was what was giving me errors earlier, the max value was just addDays(formattedStartDate, 365) or the letEndMaxValue variable set equal to it. However that was a str, and not a date object. In here it just takes that, converts it back to its unformatted day, and adds days to it. 
  const startMaxValue = (date) => {
    let unFormatDay = new Date(date)
    return addDays(unFormatDay, 365)
  }

  //The about but instead of start max value, end max value.
  const endMaxValue = (date) => {
    let unFormatDay = new Date(date)
    return addDays(unFormatDay, 365)
  }

  // let endMaxValue = addDays(formattedEndDate, 365)

  console.log("START MAX",startMaxValue(formattedStartDate, 365))
  console.log("END MAX",endMaxValue(formattedEndDate, 365))

  // console.log("Start Rental:", startRental)
  // console.log("End Rental:", endRental)
  // console.log("Formatted End Date:", formattedEndDate)
  // console.log("Starting day:", formattedStartDate)
  // console.log("One year from now:",addDays(formattedStartDate, 365))

  // console.log("End date should be +1 hr:", formattedEndDate)
  // console.log("One year from now:",addDays(formattedEndDate, 365))

  // console.log("Starting day:", startRental)
  // console.log("Ending day:", endRental)

  return (
    <div className='Calendar bg-white p-4 rounded-lg shadow'>
  <div className='mb-4'>
    <label htmlFor="start-date" className='block text-sm font-medium text-gray-700'>Choose a starting day and time for your rental:</label>
    <input
      type="datetime-local"
      id="start-date"
      name="start-date"
      className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
      value={startRental}
      onChange={handleStartDateChange}
      min={formattedStartDate}
      max={startMaxValue}
    />
  </div>

  <div className='mb-4'>
    <label htmlFor="end-date" className='block text-sm font-medium text-gray-700'>Choose an ending day and time for your rental:</label>
    <input
      type="datetime-local"
      id="end-date"
      name="end-date"
      className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
      value={endRental}
      onChange={handleEndDateChange}
      min={formattedEndDate}
      max={endMaxValue}
    />
  </div>
</div>
  )
}

export default Calendar;