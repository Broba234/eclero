import { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { supabase } from '@/lib/supabaseClient';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

export default function TimeTableSelector({ onSave }) {
  const [events, setEvents] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    loadExistingAvailability();
  }, []);

  const loadExistingAvailability = async () => {
    try {
      const { data: userData, error } = await supabase
        .from('users')
        .select('availability')
        .eq('role', 'tutor')
        .single();

      if (error) {
        console.error('Error loading availability:', error);
        return;
      }

      if (userData?.availability) {
        const loadedEvents = userData.availability.map((slot) => ({
          title: 'Available',
          start: moment().day(slot.day).set({
            hour: parseInt(slot.start_time.split(':')[0]),
            minute: parseInt(slot.start_time.split(':')[1]),
          }).toDate(),
          end: moment().day(slot.day).set({
            hour: parseInt(slot.end_time.split(':')[0]),
            minute: parseInt(slot.end_time.split(':')[1]),
          }).toDate(),
          allDay: false,
        }));
        setEvents(loadedEvents);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSlot = (slotInfo) => {
    setSelectedSlot(slotInfo);
  };

  const confirmSlot = () => {
    if (selectedSlot) {
      const newEvent = {
        title: 'Available',
        start: roundToNearestTen(selectedSlot.start),
        end: roundToNearestTen(selectedSlot.end),
        allDay: false,
      };

      if (!isOverlapping(newEvent)) {
        setEvents((prev) => [...prev, newEvent]);
        setSelectedSlot(null);
      } else {
        alert('This time range overlaps with an existing range.');
      }
    }
  };

  const isOverlapping = (newEvent) => {
    return events.some((event) =>
      (newEvent.start < event.end && newEvent.end > event.start)
    );
  };

  const roundToNearestTen = (date) => {
    const minutes = Math.round(moment(date).minutes() / 10) * 10;
    return moment(date).minutes(minutes).seconds(0).toDate();
  };

  const editEvent = (eventToEdit, newStart, newEnd) => {
    const updatedEvent = {
      ...eventToEdit,
      start: roundToNearestTen(newStart),
      end: roundToNearestTen(newEnd),
    };

    if (!isOverlapping(updatedEvent)) {
      setEvents((prev) =>
        prev.map((event) => (event === eventToEdit ? updatedEvent : event))
      );
    } else {
      alert('This time range overlaps with an existing range.');
    }
  };

  const saveAvailability = async () => {
    setSaving(true);
    setSaveSuccess(false);
    
    const availability = events.map((event) => ({
      start_time: moment(event.start).format('HH:mm'),
      end_time: moment(event.end).format('HH:mm'),
      day: moment(event.start).format('dddd'),
    }));

    try {
      const { error } = await supabase
        .from('users')
        .update({ availability })
        .eq('role', 'tutor');

      if (error) {
        console.error('Error saving availability:', error);
        alert('Failed to save availability. Please try again.');
      } else {
        setSaveSuccess(true);
        onSave(availability);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      alert('An unexpected error occurred. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center h-[500px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Define Your Availability</h2>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={handleSelectSlot}
        style={{ height: 500 }}
        eventPropGetter={() => ({ style: { backgroundColor: '#4caf50', color: '#000' } })}
      />

      {selectedSlot && (
        <div className="mt-4">
          <p>
            Selected Range: {moment(selectedSlot.start).format('HH:mm')} - {moment(selectedSlot.end).format('HH:mm')}
          </p>
          <button
            onClick={confirmSlot}
            className="mt-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Confirm
          </button>
          <button
            onClick={() => setSelectedSlot(null)}
            className="mt-2 ml-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      )}

      <div className="mt-6 flex items-center">
        <button
          onClick={saveAvailability}
          disabled={saving}
          className={`bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center ${saving ? 'cursor-not-allowed' : ''}`}
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </>
          ) : (
            'Save Availability'
          )}
        </button>
        {saveSuccess && (
          <span className="ml-4 text-green-600 flex items-center">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Saved successfully!
          </span>
        )}
      </div>
    </div>
  );
}