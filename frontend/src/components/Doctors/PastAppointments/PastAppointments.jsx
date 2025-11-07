import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../../../utils/apiClient';
import PropTypes from 'prop-types';
import './PastAppointments.css';

export default function PastAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadAppointments = useCallback(async () => {
    try {
      const data = await apiClient('/api/doctor/past-appointments');
      setAppointments(data.appointments);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  return (
    <div className="past-appointments">
      <div className="info-container">
        <h1>Past Appointments</h1>
      </div>
      {error && <div className="error-message">{error}</div>}
      {loading ? (
        <div className="loading">Loading appointments...</div>
      ) : appointments.length === 0 ? (
        <div className="empty-state">
          <p>You don&apos;t have any upcoming appointments.</p>
        </div>
      ) : (
        <div className="appointments-grid">
          {appointments.map((appointment) => (
            <PastAppointmentCard
              key={appointment._id}
              appointment={appointment}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function PastAppointmentCard({ appointment }) {
  return (
    <div className="appointment-card">
      <div className="appointment-header">
        <h3>{appointment.patientName}</h3>
        <span className={`status-badge status-${appointment.status}`}>
          {appointment.status}
        </span>
      </div>
      <div className="appointment-details">
        <p className="appointment-date">
          {formatDate(appointment.startDateTime)}
        </p>
        {appointment.reason && (
          <p className="appointment-reason">{appointment.reason}</p>
        )}
      </div>
    </div>
  );
}

PastAppointmentCard.propTypes = {
  appointment: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    patientName: PropTypes.string.isRequired,
    startDateTime: PropTypes.string.isRequired,
    reason: PropTypes.string,
    status: PropTypes.string.isRequired,
  }).isRequired,
};
