import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import Modal from 'react-modal';

Modal.setAppElement('#root');

function formatLocalDate(date) {
  const pad = n => (n < 10 ? '0' + n : n);
  return (
    date.getFullYear() +
    '-' +
    pad(date.getMonth() + 1) +
    '-' +
    pad(date.getDate()) +
    'T' +
    pad(date.getHours()) +
    ':' +
    pad(date.getMinutes()) +
    ':00'
  );
}

const API = process.env.REACT_APP_API_URL;

const BookingCalendar = () => {
  const [events, setEvents] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    note: ''
  });

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = () => {
    axios
      .get(`${API}/api/reservations`)
      .then(res => {
        setEvents(
          res.data.map(r => ({
            id: r.id,
            title: r.full_name,
            start: r.date_time,
            end: r.end_time,
            extendedProps: { email: r.email, note: r.note }
          }))
        );
      })
      .catch(err => console.error('Błąd podczas ładowania rezerwacji', err));
  };

  const handleDateSelect = selectInfo => {
    const selectedHour = new Date(selectInfo.start).getHours();

    if (selectedHour < 8 || selectedHour >= 18) {
      alert("Można rezerwować tylko między 08:00 a 18:00");
      return;
    }

    setSelectedDate(selectInfo.startStr);
    const start = new Date(selectInfo.start);
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    setEndDate(end.toISOString());

    setModalIsOpen(true);
  };

  const handleEventClick = clickInfo => {
    setSelectedEvent(clickInfo.event);
    setFormData({
      full_name: clickInfo.event.title,
      email: clickInfo.event.extendedProps.email,
      note: clickInfo.event.extendedProps.note || ''
    });
    setEditModalIsOpen(true);
  };

  const handleInputChange = e =>
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post(`${API}/api/reservations`, {
        ...formData,
        date_time: formatLocalDate(new Date(selectedDate)),
        end_time: formatLocalDate(new Date(endDate))
      });
      setModalIsOpen(false);
      setFormData({ full_name: '', email: '', note: '' });
      fetchReservations();
    } catch (err) {
      alert('Błąd przy tworzeniu rezerwacji');
      console.error(err);
    }
  };

  const handleEditSubmit = async e => {
    e.preventDefault();

    if (!selectedEvent?.id) {
      alert('Nie można zaktualizować rezerwacji – brak ID.');
      return;
    }

    try {
      await axios.put(`${API}/api/reservations/${selectedEvent.id}`, {
        ...formData,
        date_time: formatLocalDate(new Date(selectedEvent.start)),
        end_time: formatLocalDate(new Date(selectedEvent.end))
      });
      setEditModalIsOpen(false);
      fetchReservations();
    } catch (err) {
      alert('Błąd podczas edycji');
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!selectedEvent?.id) {
      alert('Nie można usunąć rezerwacji – brak ID.');
      return;
    }

    try {
      await axios.delete(`${API}/api/reservations/${selectedEvent.id}`);
      setEditModalIsOpen(false);
      fetchReservations();
    } catch (err) {
      alert('Błąd podczas usuwania');
      console.error(err);
    }
  };

  const modalStyle = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)',
      zIndex: 2000
    },
    content: {
      position: 'absolute',
      top: '20%',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 2100,
      maxWidth: '400px',
      width: '90%',
      borderRadius: '12px',
      padding: '20px'
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
        📅 Kalendarz Rezerwacji
      </h2>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        selectable
        events={events}
        height="600px"
        expandRows={true}
        slotMinTime="08:00:00"
        slotMaxTime="18:00:00"
        select={handleDateSelect}
        eventClick={handleEventClick}
      />

      {/* Modal dodawania */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={modalStyle}
        contentLabel="Dodaj Rezerwację"
      >
        <h3>Nowa rezerwacja</h3>
        <form onSubmit={handleSubmit}>
          <input name="full_name" placeholder="Imię i nazwisko" value={formData.full_name} onChange={handleInputChange} required style={{ width: '100%', marginBottom: '10px' }} />
          <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleInputChange} required style={{ width: '100%', marginBottom: '10px' }} />
          <label>Godzina zakończenia:</label>
          <input type="datetime-local" value={endDate ? endDate.slice(0, 16) : ''} onChange={e => setEndDate(new Date(e.target.value).toISOString())} required style={{ width: '100%', marginBottom: '10px' }} />
          <textarea name="note" placeholder="Notatka (opcjonalna)" value={formData.note} onChange={handleInputChange} style={{ width: '100%', marginBottom: '10px' }} />
          <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Zarezerwuj</button>
        </form>
      </Modal>

      {/* Modal edycji */}
      <Modal
        isOpen={editModalIsOpen}
        onRequestClose={() => setEditModalIsOpen(false)}
        style={modalStyle}
        contentLabel="Edytuj Rezerwację"
      >
        <h3>Edytuj rezerwację</h3>
        <form onSubmit={handleEditSubmit}>
          <label>Godzina rozpoczęcia:</label>
          <input type="datetime-local" value={selectedEvent ? formatLocalDate(new Date(selectedEvent.start)).slice(0, 16) : ''} onChange={e => setSelectedEvent(prev => prev ? { ...prev, start: new Date(e.target.value) } : prev)} required style={{ width: '100%', marginBottom: '10px' }} />
          <label>Godzina zakończenia:</label>
          <input type="datetime-local" value={selectedEvent ? formatLocalDate(new Date(selectedEvent.end)).slice(0, 16) : ''} onChange={e => setSelectedEvent(prev => prev ? { ...prev, end: new Date(e.target.value) } : prev)} required style={{ width: '100%', marginBottom: '10px' }} />
          <input name="full_name" placeholder="Imię i nazwisko" value={formData.full_name} onChange={handleInputChange} required style={{ width: '100%', marginBottom: '10px' }} />
          <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleInputChange} required style={{ width: '100%', marginBottom: '10px' }} />
          <textarea name="note" placeholder="Notatka" value={formData.note} onChange={handleInputChange} style={{ width: '100%', marginBottom: '10px' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Zapisz zmiany</button>
            <button type="button" onClick={handleDelete} style={{ padding: '10px 20px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Usuń</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default BookingCalendar;
