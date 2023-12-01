import React, { useState, useEffect } from 'react';
import {toast} from 'react-toastify'

function Calendar({startRental, setStartRental, endRental, setEndRental, durationType, duration}) {
  
  // const [startRental, setStartRental] = useState('')
  // const [endRental, setEndRental] = useState('')
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
    let date = new Date()
    setFormattedStartDate(formatDate(date))

    // Initial setup for end date (one hour later)
    let endDate = new Date(date.getTime() + 3600000) // One hour later
    setFormattedEndDate(formatDate(endDate))
  }, [])

//----------------------------------------------------------------------------------------

  // I don't think this matters, the min parameter inside of date-local NEVER worked.

  useEffect(() => {
    // Whenever the startRental changes, update the minimum end time
    if (startRental) {
      const startDateTime = new Date(startRental).getTime()
      const minEndDateTime = new Date(startDateTime + 3600000) // Add one hour
      setFormattedEndDate(formatDate(minEndDateTime))
    }
  }, [startRental])

//----------------------------------------------------------------------------------------
  
  // console.log("format start:", formattedStartDate)
  // console.log("format end:", formattedEndDate)
  // Was just setting formatted variables with let, instead I made a function that formats them.
  const formatDate = (date) => {
    // Was having a lot of issues and couldn't tell where from, so I wrote some validations to test what could be going wrong
    if (!(date instanceof Date)) {
      console.error('Invalid date provided to formatDate:', date)
      return null
    }
    // Adjust the date to local timezone, .getTimeZoneOffset returns the difference in minutes. Most of this needs second / milliseconds so that's where the *60000 comes from
    let timezoneOffset = date.getTimezoneOffset() * 60000
    // To get the local date, you just take the date z(which we test to see if it was an instance of Date, since the useEffect makes it so it continues). When subtracting timezoneOffset, you just get the appropriate time, 24hr format.
    let localDate = new Date(date - timezoneOffset)
    // Slice so I don't get the very long info, can do -8 or 16. 
    // https://stackoverflow.com/questions/67423091/react-jsx-add-min-date-time-to-datetime-local-input
    // For some reason though my MIN did NOT work
    return localDate.toISOString().slice(0, -8)
  }

  // Time here is x amounts of hours ahead, for example I'm using 1 hour in microseconds
  // Days ahead is days ahead, I chose 365
  const addDays = (baseDate, days, time = 0) => {
    // Parse the base date
    let date = new Date(baseDate)
  
    // Add the specified number of days
    date.setDate(date.getDate() + days)
  
    // Optionally, add additional time in milliseconds
    if (time > 0) {
      date = new Date(date.getTime() + time)
    }
  
    // Return the formatted date
    return formatDate(date)
  }


  //Handles changing the START date
  const handleStartDateChange = (event) => {

    let startDate = new Date()
    let selectedStart = new Date(event.target.value)

    // Get a min start time, ATM +3600000 is for an hour ahead. This way the start time can only be local time +1hr. It'd be too hard to establish a rental in the next 4 minutes.
    let minStartTime = new Date(startDate.getTime() + 3600000)

    if (selectedStart >= minStartTime){
      //Set Start date,
      setStartRental(event.target.value)
    } else {
      // Alert the user that the end date must be at least one hour after the start date
      console.warn("Start date and time must be one hour ahead of local time to allow for a smoother process.")
      return toast.warn(`📆 Start date and time must be one hour ahead of local time to allow for a smoother process.`,
      {
      "autoClose" : 2000
      })
      
      // toast.warn("Start date and time must be one hour ahead of local time to allow for a smoother process.")
    }
    
  //--------------------------------------FormattedEndDate kind of useless (TIME WISE) since min is not working properly for it---------------

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

    //Date object that user Selects
    let newEnd = new Date(event.target.value)

    // Remember startRental was sent into the formatDate function so it was sliced,
    let currentStart = new Date(startRental)

    // Calculate the minimum end time, which is one hour after the start time
    let minEndDateTime = new Date(currentStart.getTime() + 3600000)
  
    console.log("THE NEW END:", newEnd.toISOString())
    console.log("THE minEndDateTime:", minEndDateTime.toISOString())
  
    // Check if the new end time is greater than or equal to the minimum end time
    if (newEnd >= minEndDateTime) {
      setEndRental(event.target.value)
    } else {
      // Alert the user that the end date must be at least one hour after the start date
      console.warn("End date must be at least one hour after the start date.")
      // toast.warn("End date must be at least one hour after the start date.")
    }
  }

  // const calculateEndDate = (startRental, duration, durationType) => {
  //   const endDate = new Date(startRental)
  
  //   switch (durationType) {
  //     case 'hours':
  //       endDate.setHours(endDate.getHours() + duration)
  //       break
  //     case 'days':
  //       endDate.setDate(endDate.getDate() + duration)
  //       break
  //     case 'weeks':
  //       endDate.setDate(endDate.getDate() + duration * 7)
  //       break
  //     default:
  //       throw new Error('Invalid duration type')
  //   }
  
  //   return endDate
  // }

  // let endDate = calculateEndDate(startRental, duration, durationType)
  // setEndRental(setEndRental(endDate)) //need to handle the formatting wity=h existing logic

  // console.log("START MAX",startMaxValue(formattedStartDate, 365))
  // console.log("END MAX",endMaxValue(formattedEndDate, 365))
  // console.log("Start Rental:", startRental)
  // console.log("End Rental:", endRental)
  // console.log("Formatted End Date:", formattedEndDate)
  // console.log("Starting day:", formattedStartDate)
  // console.log("STARTING ONE YEAR FROM NOW:",addDays(365))
  // console.log("End date should be +1 hr:", formattedEndDate)
  // console.log("One year from now:",(addDays(365,3600000)) )
  // console.log("Starting day:", startRental)
  // console.log("Ending day:", endRental)

  return (
    <div className='Calendar bg-white rounded-lg shadow'>
  <div className='mb-4'>
    <label htmlFor="start-date" className='block text-sm font-bold text-gray-900'>Start Date (click to select) </label>
    <input
      type="datetime-local"
      id="start-date"
      name="start-date"
      className='calendar-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 hover:cursor-pointer'
      value={startRental}
      onChange={handleStartDateChange}
      min={formattedStartDate} // This one worked though, 
      max={startRental ? addDays(startRental, 365) : undefined}
    />
  </div>

  {startRental ? <div className='mb-4'>
    <label htmlFor="end-date" className='block text-sm font-bold text-gray-900'>End Date (click to select)</label>
    <input
      type="datetime-local"
      id="end-date"
      name="end-date"
      className='calendar-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 hover:cursor-pointer'
      value={endRental}
      onChange={handleEndDateChange}
      min={formattedEndDate} //This does not matter, what an annoying concept. (Day works)
      max={startRental ? addDays(startRental, 365, 3600000) : undefined}
      disabled={!formattedEndDate}
    />
  </div>
  : <span> Please Select A Start Date</span>}

  
</div>
  )
}

export default Calendar;