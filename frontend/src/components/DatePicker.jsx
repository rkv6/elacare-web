import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

export default function DatePicker({ selectedDate, onSelectDate, className = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Get days in month
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDate = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startDate; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const handleDateSelect = (date) => {
    onSelectDate(date);
    setIsOpen(false);
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const formatDate = (date) => {
    if (!date) return 'Select Date';
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const isToday = (date) => {
    const today = new Date();
    return date && 
           date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const isSelected = (date) => {
    return selectedDate && 
           date &&
           date.getDate() === selectedDate.getDate() &&
           date.getMonth() === selectedDate.getMonth() &&
           date.getFullYear() === selectedDate.getFullYear();
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className={`relative ${className}`}>
      {/* Date Input Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors"
      >
        <Calendar size={18} className="text-gray-500" />
        <span className="text-gray-900">{formatDate(selectedDate)}</span>
      </button>

      {/* Calendar Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-50 p-4">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={prevMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <h3 className="font-semibold text-gray-900">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h3>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Days of Week */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
              <div key={day} className="text-center text-xs font-medium text-gray-500 p-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {getDaysInMonth(currentMonth).map((date, index) => (
              <button
                key={index}
                onClick={() => date && handleDateSelect(date)}
                disabled={!date}
                className={`
                  p-2 text-sm rounded-lg transition-colors
                  ${!date ? 'invisible' : 'hover:bg-gray-100'}
                  ${isToday(date) ? 'bg-orange-100 text-orange-600 font-semibold' : ''}
                  ${isSelected(date) ? 'bg-orange-500 text-white font-semibold' : ''}
                  ${date && !isSelected(date) && !isToday(date) ? 'text-gray-900' : ''}
                `}
              >
                {date ? date.getDate() : ''}
              </button>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={() => handleDateSelect(new Date())}
              className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 transition-colors"
            >
              Today
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="text-xs px-3 py-1 bg-orange-500 hover:bg-orange-600 rounded text-white transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}