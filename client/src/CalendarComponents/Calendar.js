import React, { useState, useEffect } from 'react';
import {toast} from 'react-toastify'

function Calendar({startRental, setStartRental, endRental, setEndRental}) {
  const [formattedStartDate, setFormattedStartDate] = useState('')
  const [formattedEndDate, setFormattedEndDate] = useState('')

  // So initially I was just setting variables openly, but instead I opted to for an useEffect as it mounts.
  useEffect(() => {
    // Initial setup for start date
    let date = new Date()
    setFormattedStartDate(formatDate(date))

    // Initial setup for end date (one hour later)
    let endDate = new Date(date.getTime() + 3600000) // One hour later
    setFormattedEndDate(formatDate(endDate))
  }, [])

  
  // console.log("format start:", formattedStartDate)
  // console.log("format end:", formattedEndDate)
  // Was just setting formatted variables with let, instead I made a function that formats them. I kept getting this: 
  // Format the date to "YYYY-MM-DDTHH:mm" format as required by the input :cry:
  const formatDate = (date) => {
    // Was having a lot of issues and couldn't tell where from, so I wrote some validations to test what could be going wrong
    if (!(date instanceof Date)) {
      console.error('Invalid date provided to formatDate:', date)
      return null
    }
    // Adjust the date to local timezone, .getTimeZoneOffset returns the difference in minutes. Most of this needs second / milliseconds so that's where the *60000 comes from
    let timezoneOffset = date.getTimezoneOffset() * 60000
    // To get the local date, you just take the date (which we test to see if it was an instance of Date, since the useEffect makes it a Date, we're good to continue). When subtracting timezoneOffset, you just get the local time, 24hr format.
    let localDate = new Date(date - timezoneOffset)
    // Slice so I don't get the very long info, can do -8 or 16. 
    // https://stackoverflow.com/questions/67423091/react-jsx-add-min-date-time-to-datetime-local-input
    return localDate.toISOString().slice(0, -8)
  }

  // addDays is used to calculate a date in the future. Prior I was doing the same logic directly in the max for the input, I opted to create a function that handled adding date and time (defaulted to 0 for start date).
  // Time here is x amounts of hours ahead, for example I'm using 1 hour in microseconds
  // Days ahead is days ahead, I chose 365 days ahead as the max value.
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


  // Handles changing the START date. Since this is tied to onChange instead of firing on every keystroke like typical form inputs, it'll fire off whenever there's a change in the start date.
  const handleStartDateChange = (event) => {
    // Initilaize a new date object as a starting point.
    let startDate = new Date()

    // Selected date is logged from the event,
    let selectedStart = new Date(event.target.value)

    // Get a min start time, ATM +3600000 is for an hour ahead. This way the start time can only be time +1hr. This is set due to the premise that establishing a rental in the next 4 minutes would be extremely difficult.
    let minStartTime = new Date(startDate.getTime() + 3600000)

    // We compare whether the selected start time is >= to the minimum start time, if it is we allow the rental start date to be set.
    if (selectedStart >= minStartTime){
      //Set Start date,
      setStartRental(event.target.value)
    } else {
      // Otherwise, we alert the user that the end date must be at least one hour after the start date
      console.warn("Start date and time must be one hour ahead of local time to allow for a smoother process.")
      return toast.warn(`📆 Start date and time must be one hour ahead of local time to allow for a smoother process.`,
      {
      "autoClose" : 2000
    })}
    
    // Set the new end date off the same value, then calculate one hour ahead (minimum booking is 1hr). The return in the if/else handles exiting the function if the condition isn't true.
    let newEndDate = new Date(new Date(event.target.value).getTime() + 3600000) // One hour later

    //Formatted date (min value of the input) becomes newEndDate, allowing nothing in the past to be selected
    setFormattedEndDate(formatDate(newEndDate))

    // If the new Date (end) is less than the end date ( which gets set after you set or re-set the start rental date) reset the end date to a new starting position. End rental is our prop that's coming in, we end up testing the date that was previously selected vs the newEndDate to see if it's alright to keep that data. The way the browser handles re-setting the minimum date for end rental seems to reset the date to that day regardless.
    // I.E. You want to start a rental on 1/2 and end it on 1/12, you move the start date to 1/5 changes the minimum rental date to 1/5, resetting it.
    // if (new Date(endRental) < newEndDate) {
    //   setEndRental(formatDate(newEndDate))
    // }
  }

  // Handles changing the END date. Since this is tied to onChange instead of firing on every keystroke like typical form inputs, it'll fire off whenever there's a change in the end date. 
  const handleEndDateChange = (event) => {

    // Remember startRental was sent into the formatDate function so it was sliced,
    let currentStart = new Date(startRental)

    //Date object that user Selects
    let newEnd = new Date(event.target.value)

    // Calculate the minimum end time, which is one hour after the start time
    let minEndDateTime = new Date(currentStart.getTime() + 3600000)
  
    // console.log("THE NEW END:", newEnd.toISOString())
    // console.log("THE minEndDateTime:", minEndDateTime.toISOString())
  
    // Check if the new end time is greater than or equal to the minimum end time
    if (newEnd >= minEndDateTime) {
      setEndRental(event.target.value)
    } else {
      // Alert the user that the end date must be at least one hour after the start date
      console.warn("End date must be at least one hour after the start date.")
      return toast.warn(`📆 The minimal rental time is one hour. The End date must be at least one hour after the start date.`,
      {
      "autoClose" : 2000
      })}
  }

  // I apologize for this mess of console logs, I'm leaving this as a tribute to all the console logs I've gone through in the entirety of the project. Some times I just needed them out and a quick way to view what was happening.

  // console.log("START MAX",startMaxValue(formattedStartDate, 365))
  // console.log("END MAX",endMaxValue(formattedEndDate, 365))
  // console.log("Start Rental:", startRental)
  // console.log("End Rental:", endRental)
  // console.log("Formatted End Date:", formattedEndDate)
  // console.log("Starting day:", formattedStartDate)
  // console.log("STARTING ONE YEAR FROM NOW:",addDays(365))
  // console.log("End date should be +1 hr:", formattedEndDate)
  // console.log("One year from now:",(addDays(365,3600000)) )

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
          min={formattedStartDate} // 
          max={startRental ? addDays(startRental, 365) : undefined}
        />
    </div>

      {/* Ternary to test for whether a start rental already exists, that way one is prompted to first select a start date before being allowed to select an end date */}
      {startRental ? <div className='mb-4'>
        <label htmlFor="end-date" className='block text-sm font-bold text-gray-900'>End Date (click to select)</label>
        <input
          type="datetime-local"
          id="end-date"
          name="end-date"
          className='calendar-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 hover:cursor-pointer'
          value={endRental}
          onChange={handleEndDateChange}
          min={formattedEndDate} // 
          max={startRental ? addDays(startRental, 365, 3600000) : undefined}
          disabled={!formattedEndDate}
        />
      </div>
      : <span> Please Select A Start Date</span>}
    </div>
  )
}

export default Calendar;