import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function App() {
  const [date, setDate] = useState([new Date()]);
  console.log(date)
  return (
    <div className='app'>
      <h1 className='text-center'>React Calendar</h1>
      <div className='calendar-container'>
        <Calendar 
        onChange={setDate} 
        value={date} 
        selectRange={true}
        hover={new Date(2017, 0, 1)}
        minDate={new Date()}
        />
      </div>
      <p className='text-center'>
       
        {date?.map((item) => {
          return (<span className='bold'>Selected Date: {item.toDateString()} </span>)
        })}
        {console.log(date)}
        {/* {date.toDateString()} */}
      </p>
    </div>
  );
}

export default App;