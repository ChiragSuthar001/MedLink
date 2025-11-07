import PropTypes from 'prop-types';
import { useMemo } from 'react';
function generateTimeSlots(startHour, endHour) {
  const slots = [];
  for (let hour = startHour; hour < endHour; hour += 1) {
    const hourStr = String(hour).padStart(2, '0');
    slots.push(`${hourStr}:00`);
    slots.push(`${hourStr}:30`);
  }
  return slots;
}

export default function AvailibilityCard({
  day,
  availability,
  setNewAvailability,
}) {
  const slots = useMemo(() => generateTimeSlots(9, 17), []); // 9:00 AM to 5:00 PM (17:00)

  const toggleSlot = (time) => {
    const newSet = new Set(availability);
    if (newSet.has(time)) {
      newSet.delete(time);
    } else {
      newSet.add(time);
    }
    setNewAvailability(newSet);
  };

  return (
    <div className="day-card">
      <div className="day-header">{day}</div>
      <div className="slots-grid">
        {slots.map((time) => {
          const isSelected = availability.has(time);
          return (
            <button
              key={time}
              type="button"
              className={`slot-button ${isSelected ? 'selected' : ''}`}
              onClick={() => toggleSlot(time)}
            >
              {time}
            </button>
          );
        })}
      </div>
    </div>
  );
}

AvailibilityCard.propTypes = {
  day: PropTypes.string.isRequired,
  availability: PropTypes.object.isRequired,
  setNewAvailability: PropTypes.func.isRequired,
};
