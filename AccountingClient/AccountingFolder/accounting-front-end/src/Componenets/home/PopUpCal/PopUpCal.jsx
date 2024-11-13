import React, { useState } from 'react';
import Calendar from 'react-calendar';
import { FaCalendar } from "react-icons/fa";

function PopUpCal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>
        <FaCalendar />
      </button>

      {isOpen && (
        <div className="calendar-popup">
          <Calendar
            inline
            onClickOutside={() => setIsOpen(false)} // Close calendar if clicked outside
          />
        </div>
      )}
    </div>
  );
}

export default PopUpCal;
