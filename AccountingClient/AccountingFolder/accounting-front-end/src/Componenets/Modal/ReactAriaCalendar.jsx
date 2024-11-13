import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css"; // Import the CSS for styling

const ReactDatePicker = () => {
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <div>
      <h2>Select a Date</h2>

      {/* DatePicker component */}
      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        dateFormat="MMMM d, yyyy" // Format the displayed date
        aria-label="Select a date"
        style={{ padding: '8px', fontSize: '16px' }}
      />

      {/* Display the selected date */}
      {selectedDate && (
        <div style={{ marginTop: '10px' }}>
          <strong>Selected Date:</strong> {selectedDate.toLocaleDateString()}
        </div>
      )}
    </div>
  );
};

export default ReactDatePicker;

