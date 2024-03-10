// Calendar.js
import React, { useState } from 'react';
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
const Calendar = ({ onDateSelect }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (date) => {
    setSelectedDate(date);
    // Call the callback function to handle selected date
    onDateSelect(date);
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Select Date</h2>
      <DatePicker
        onChange={ handleDateChange }
        value={ selectedDate }
        className="border p-2 rounded focus:outline-none focus:ring focus:border-blue-300"
      />
    </div>
  );
};

export default Calendar;
