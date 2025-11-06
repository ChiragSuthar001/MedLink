import React, { useEffect, useState } from 'react';
import './DoctorAvailibility.css';
import AvailibilityCard from './AvailibilityCard';
import { apiClient } from '../../../utils/apiClient';

const DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export default function DoctorAvailibility() {
  const [error, setError] = useState('');

  const [submitting, setSubmitting] = useState(false);

  // Ref to store all availability data from child components
  const [availability, setAvailability] = useState({
    Monday: new Set(),
    Tuesday: new Set(),
    Wednesday: new Set(),
    Thursday: new Set(),
    Friday: new Set(),
    Saturday: new Set(),
    Sunday: new Set(),
  });

  useEffect(() => {
    async function loadAvailability() {
      try {
        const data = await apiClient('/api/doctor/my-availability');
        let initial = {};
        DAYS.forEach((day) => {
          initial[day] = new Set(
            (data?.availability && data.availability[day]) || []
          );
        });
        setAvailability(initial);
      } catch (err) {
        const initial = {};
        DAYS.forEach((day) => {
          initial[day] = new Set();
        });
        setAvailability(initial);
      }
    }
    loadAvailability();
  }, []);

  const handleSave = async () => {
    setSubmitting(true);
    setError('');

    // Convert Sets to arrays for easier serialization
    const payload = {};
    DAYS.forEach((day) => {
      payload[day] = Array.from(availability[day]);
    });

    try {
      await apiClient('/api/doctor/update-availability', {
        method: 'POST',
        body: JSON.stringify({ availability: payload }),
      });
    } catch (err) {
      setError(err.message || 'Failed to save availability');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {submitting && (
        <div className="loading-spinner-container">
          <div className="loading-spinner" />
        </div>
      )}
      <div className="doctor-availability">
        {error && <div className="error-message">{error}</div>}
        <div className="info-container">
          <h1>Set Your Availability</h1>
          <div className="availability-description">
            Select 30-minute slots between 9:00 AM and 5:00 PM.
          </div>
        </div>

        <div className="availability-cards-container">
          {DAYS.map((day) => (
            <AvailibilityCard
              key={day}
              day={day}
              availability={availability[day]}
              setNewAvailability={(newSet) => {
                setAvailability((prev) => ({
                  ...prev,
                  [day]: newSet,
                }));
              }}
            />
          ))}
        </div>
        <div className="save-availability">
          <button
            onClick={handleSave}
            disabled={submitting}
            className="save-button"
          >
            Save Availability
          </button>
        </div>
      </div>
    </>
  );
}
