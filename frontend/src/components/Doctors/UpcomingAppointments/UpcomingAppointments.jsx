import { useEffect, useState } from 'react';
import { apiClient } from '../../../utils/apiClient';
import './UpcomingAppointments.css';
import UpcomingAppointmentCard from './UpcomingAppointmentCard';

export default function UpcomingAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('useEffect');

    loadAppointments();
  }, []);

  async function loadAppointments() {
    console.log('Loading appointments...');

    try {
      const data = await apiClient('/api/doctor/upcoming-appointments');
      setAppointments(data.appointments);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="upcoming-appointments">
      {error && <div className="error-message">{error}</div>}
      <div className="info-container">
        <h1>Upcoming Appointments</h1>
      </div>
      {loading ? (
        <div className="loading">Loading appointments...</div>
      ) : appointments.length === 0 ? (
        <div className="empty-state">
          <p>You don&apos;t have any upcoming appointments.</p>
        </div>
      ) : (
        <div className="appointments-grid">
          {appointments.map((appointment) => (
            <UpcomingAppointmentCard
              key={appointment._id}
              appointment={appointment}
              onCancel={() => {}}
            />
          ))}
        </div>
      )}
    </div>
  );
}
