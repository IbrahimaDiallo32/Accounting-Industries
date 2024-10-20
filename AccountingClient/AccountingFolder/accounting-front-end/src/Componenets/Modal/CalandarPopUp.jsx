import React from 'react';
import './CalandarPopUp.css';
import { useState, useEffect } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import axios from 'axios';



const CalanderPopUp = () => {

  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Get first day of the current month
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  // Get number of days in the current month
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

  // Helper function to change the month
  const changeMonth = (direction) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
  };

  // Create an array for the days of the month
  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div className="empty-day" key={`empty-${i}`}></div>); // Empty spaces before first day
  }
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(
      <div className="day" key={day}>
        {day}
      </div>
    );
  }

  return (
    <div className='CalandarOuterContainer'>
      <header className='logoForRegistration'>
        <a href="/HomePage"><button className='backButtonRegistration'><IoArrowBack />BACK</button></a>
        <div className='shiftForRegis'>
          <img src="/AIT.PNG" width={100} height={100} alt="Logo" className='shiftForRegistation' />
          <h2 className=''>Account Help</h2>
          <img src="/AIT.PNG" width={100} height={100} className='regLogo2' alt="Logo" />
        </div>
      </header>
      <div className="calendar">
        <div className="calendar-header">
          <button className="calandarChangeMonth" onClick={() => changeMonth(-1)}>&lt;</button>
          <h2>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
          <button className="calandarChangeMonth" onClick={() => changeMonth(1)}>&gt;</button>
        </div>

        <div className="calendar-grid">
          <div className="day-header">Sun</div>
          <div className="day-header">Mon</div>
          <div className="day-header">Tue</div>
          <div className="day-header">Wed</div>
          <div className="day-header">Thu</div>
          <div className="day-header">Fri</div>
          <div className="day-header">Sat</div>
          {days}
        </div>
      </div>
    </div>
  );
};

export default CalanderPopUp;