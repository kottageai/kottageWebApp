"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { supabase } from '@/lib/supabase/client';

type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

type TimeSlot = {
  id: string;
  start: string;
  end: string;
};

type DaySchedule = {
  isEnabled: boolean;
  timeSlots: TimeSlot[];
};

const DAYS: { key: DayOfWeek; label: string }[] = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' },
];

const DayButton = ({ day, isSelected, onClick }: { day: { key: DayOfWeek; label: string }, isSelected: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    style={{
      padding: '20px 24px',
      borderRadius: 8,
      border: '1px solid #e5e7eb',
      backgroundColor: isSelected ? '#1f2937' : '#f9fafb',
      color: isSelected ? 'white' : '#6b7280',
      fontWeight: 500,
      cursor: 'pointer',
      transition: 'all 0.2s ease-in-out',
      position: 'relative',
      minWidth: '100px',
      textAlign: 'center'
    }}
  >
    {isSelected && (
      <div style={{
        position: 'absolute',
        top: '8px',
        right: '8px',
        color: 'white',
        fontSize: '14px'
      }}>
        ✓
      </div>
    )}
    {day.label}
  </button>
);

const TimeInput = ({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder: string }) => (
  <input
    type="time"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className="time-input"
    style={{
      padding: '8px 12px',
      borderRadius: 6,
      border: '1px solid #d1d5db',
      fontSize: '14px',
      width: '100px'
    }}
  />
);

const NumberInput = ({ value, onChange, placeholder, width = '60px' }: { value: string; onChange: (value: string) => void; placeholder: string; width?: string }) => (
  <input
    type="number"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    style={{
      padding: '8px 12px',
      borderRadius: 6,
      border: '1px solid #d1d5db',
      fontSize: '14px',
      width
    }}
  />
);

const Select = ({ value, onChange, options, width = '120px' }: { value: string; onChange: (value: string) => void; options: { value: string; label: string }[]; width?: string }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    style={{
      padding: '8px 12px',
      borderRadius: 6,
      border: '1px solid #d1d5db',
      fontSize: '14px',
      backgroundColor: 'white',
      width
    }}
  >
    {options.map(option => (
      <option key={option.value} value={option.value}>{option.label}</option>
    ))}
  </select>
);

export default function SchedulingPage() {
  const router = useRouter();
  
  const [schedule, setSchedule] = useState<Record<DayOfWeek, DaySchedule>>({
    monday: { isEnabled: true, timeSlots: [{ id: '1', start: '07:00', end: '12:00' }, { id: '2', start: '15:00', end: '18:00' }] },
    tuesday: { isEnabled: true, timeSlots: [{ id: '1', start: '07:00', end: '12:00' }, { id: '2', start: '15:00', end: '18:00' }] },
    wednesday: { isEnabled: false, timeSlots: [{ id: '1', start: '07:00', end: '12:00' }, { id: '2', start: '15:00', end: '18:00' }] },
    thursday: { isEnabled: true, timeSlots: [{ id: '1', start: '07:00', end: '12:00' }, { id: '2', start: '15:00', end: '18:00' }] },
    friday: { isEnabled: false, timeSlots: [{ id: '1', start: '07:00', end: '12:00' }, { id: '2', start: '15:00', end: '18:00' }] },
    saturday: { isEnabled: false, timeSlots: [{ id: '1', start: '07:00', end: '12:00' }, { id: '2', start: '15:00', end: '18:00' }] },
    sunday: { isEnabled: true, timeSlots: [{ id: '1', start: '07:00', end: '12:00' }, { id: '2', start: '15:00', end: '18:00' }] },
  });

  const [advanceNotice, setAdvanceNotice] = useState('1');
  const [advanceNoticeUnit, setAdvanceNoticeUnit] = useState('day');
  const [availabilityWindow, setAvailabilityWindow] = useState('3');
  const [availabilityWindowUnit, setAvailabilityWindowUnit] = useState('months');
  const [bufferBefore, setBufferBefore] = useState('');
  const [bufferAfter, setBufferAfter] = useState('');
  const [travelTime, setTravelTime] = useState('');

  const handleGoogleSync = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          scopes: 'https://www.googleapis.com/auth/calendar',
          redirectTo: window.location.href,
        },
      });

      if (error) {
        console.error('Error syncing Google Calendar:', error);
        // Handle error for the user, e.g., show a notification
      }
    } catch (error) {
      console.error('Unexpected error during Google Calendar sync:', error);
    }
  };

  const toggleDay = (day: DayOfWeek) => {
    setSchedule(prev => ({
      ...prev,
      [day]: { ...prev[day], isEnabled: !prev[day].isEnabled }
    }));
  };

  const updateTimeSlot = (day: DayOfWeek, slotId: string, field: 'start' | 'end', value: string) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        timeSlots: prev[day].timeSlots.map(slot =>
          slot.id === slotId ? { ...slot, [field]: value } : slot
        )
      }
    }));
  };

  const addTimeSlot = (day: DayOfWeek) => {
    const newSlot: TimeSlot = {
      id: Date.now().toString(),
      start: '09:00',
      end: '17:00'
    };
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        timeSlots: [...prev[day].timeSlots, newSlot]
      }
    }));
  };

  const removeTimeSlot = (day: DayOfWeek, slotId: string) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        timeSlots: prev[day].timeSlots.filter(slot => slot.id !== slotId)
      }
    }));
  };

  const enabledDays = DAYS.filter(day => schedule[day.key].isEnabled);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'white' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '2rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: 8 }}>Set your general availability</h1>
          <p style={{ color: '#6b7280', marginBottom: '2rem', fontSize: '1rem' }}>
            Choose your default settings. Scheduling for specific days can be done in your calendar and availability 
            for individual listings can be customised.
          </p>

          {/* Operating Days */}
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: 16 }}>Operating Days</h2>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {DAYS.map(day => (
                <DayButton
                  key={day.key}
                  day={day}
                  isSelected={schedule[day.key].isEnabled}
                  onClick={() => toggleDay(day.key)}
                />
              ))}
            </div>
          </div>

          {/* Opening Hours */}
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: 8 }}>Opening Hours</h2>
            <p style={{ color: '#6b7280', marginBottom: 16, fontSize: '0.875rem' }}>
              Please select available days first to set your opening hours.
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
              {enabledDays.map(day => (
                <div key={day.key} style={{ 
                  backgroundColor: '#F4F2F0', 
                  padding: '16px', 
                  borderRadius: 8,
                  border: '1px solid #e5e7eb'
                }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12, textTransform: 'capitalize' }}>
                    {day.label}
                  </h3>
                  {schedule[day.key].timeSlots.map((slot, index) => (
                    <div key={slot.id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <TimeInput
                        value={slot.start}
                        onChange={(value) => updateTimeSlot(day.key, slot.id, 'start', value)}
                        placeholder="07:00"
                      />
                      <span style={{ color: '#6b7280', fontSize: '14px' }}>to</span>
                      <TimeInput
                        value={slot.end}
                        onChange={(value) => updateTimeSlot(day.key, slot.id, 'end', value)}
                        placeholder="12:00"
                      />
                      {index === schedule[day.key].timeSlots.length - 1 && (
                        <button
                          onClick={() => addTimeSlot(day.key)}
                          style={{
                            width: 24,
                            height: 24,
                            borderRadius: '50%',
                            border: '1px solid #d1d5db',
                            backgroundColor: 'white',
                            cursor: 'pointer',
                            fontSize: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          +
                        </button>
                      )}
                      {index > 0 && (
                        <button
                          onClick={() => removeTimeSlot(day.key, slot.id)}
                          style={{
                            width: 24,
                            height: 24,
                            borderRadius: '50%',
                            border: '1px solid #d1d5db',
                            backgroundColor: 'white',
                            cursor: 'pointer',
                            fontSize: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          -
                        </button>
                                            )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Scheduling Rules */}
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: 16 }}>Scheduling Rules</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
              {/* Advance Notice */}
              <div style={{ backgroundColor: '#F4F2F0', padding: '20px', borderRadius: 12, border: '1px solid #e5e7eb' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 8 }}>Advance Notice</h3>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: 16 }}>
                  Set the minimum notice period you need between a customer's booking and the session.
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <NumberInput
                    value={advanceNotice}
                    onChange={setAdvanceNotice}
                    placeholder="1"
                  />
                  <Select
                    value={advanceNoticeUnit}
                    onChange={setAdvanceNoticeUnit}
                    options={[
                      { value: 'hour', label: 'hour' },
                      { value: 'day', label: 'day' },
                      { value: 'week', label: 'week' }
                    ]}
                  />
                </div>

              </div>

              {/* Availability Window */}
              <div style={{ backgroundColor: '#F4F2F0', padding: '20px', borderRadius: 12, border: '1px solid #e5e7eb' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 8 }}>Availability Window</h3>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: 16 }}>
                  Adjust how far in advance you want to let customers book a session with you.
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <NumberInput
                    value={availabilityWindow}
                    onChange={setAvailabilityWindow}
                    placeholder="3"
                  />
                  <Select
                    value={availabilityWindowUnit}
                    onChange={setAvailabilityWindowUnit}
                    options={[
                      { value: 'weeks', label: 'weeks' },
                      { value: 'months', label: 'months' },
                      { value: 'years', label: 'years' }
                    ]}
                  />
                </div>
                <div style={{ marginTop: 12, fontSize: '0.875rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input type="checkbox" />
                    All dates unavailable by default. Set your availability directly in your calendar.
                  </label>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginTop: 24 }}>
              {/* Buffer Time */}
              <div style={{ backgroundColor: '#F4F2F0', padding: '20px', borderRadius: 12, border: '1px solid #e5e7eb' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 8 }}>Buffer Time</h3>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: 16 }}>
                  Set how much time you need to block off before and after a session for breaks or preparation.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: '0.875rem', minWidth: '90px' }}>Before session</span>
                    <NumberInput
                      value={bufferBefore}
                      onChange={setBufferBefore}
                      placeholder="15"
                      width="80px"
                    />
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>minutes</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: '0.875rem', minWidth: '90px' }}>After session</span>
                    <NumberInput
                      value={bufferAfter}
                      onChange={setBufferAfter}
                      placeholder="15"
                      width="80px"
                    />
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>minutes</span>
                  </div>
                </div>
              </div>

              {/* Travel Time */}
              <div style={{ backgroundColor: '#F4F2F0', padding: '20px', borderRadius: 12, border: '1px solid #e5e7eb' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 8 }}>Travel Time</h3>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: 16 }}>
                  Set how much time you need to block off before a session for sessions where you travel to the customer.
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: '0.875rem', minWidth: '90px' }}>Before session</span>
                  <NumberInput
                    value={travelTime}
                    onChange={setTravelTime}
                    placeholder="30"
                    width="80px"
                  />
                  <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>minutes</span>
                </div>
              </div>
            </div>
          </div>

          {/* Calendar Sync */}
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: 8 }}>Calendar Sync (Import and Export)</h2>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: 16 }}>
              Automatically block off timings that are unavailable in your personal calendar and update it with your latest bookings.
            </p>
            
            <div style={{ display: 'flex', gap: 16 }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 12, 
                padding: '12px 16px', 
                backgroundColor: '#F4F2F0', 
                borderRadius: 8, 
                border: '1px solid #e5e7eb',
                cursor: 'pointer'
              }}
              onClick={handleGoogleSync}
              >
                <div style={{ 
                  width: 24, 
                  height: 24, 
                  backgroundColor: '#4285f4', 
                  borderRadius: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  G
                </div>
                <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Sync Google Calendar</span>
              </div>
              
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 12, 
                padding: '12px 16px', 
                backgroundColor: '#F4F2F0', 
                borderRadius: 8, 
                border: '1px solid #e5e7eb',
                cursor: 'pointer'
              }}>
                <div style={{ 
                  width: 24, 
                  height: 24, 
                  backgroundColor: '#ff3b30', 
                  borderRadius: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '10px',
                  fontWeight: 'bold'
                }}>
                  📅
                </div>
                <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Sync iCal</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 40 }}>
            <button 
              onClick={() => router.push('/provider/my-kottage')} 
              style={{ 
                padding: '12px 24px', 
                backgroundColor: '#3b82f6', 
                color: 'white', 
                borderRadius: 8, 
                border: 'none',
                fontSize: 16,
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              Save & Continue
            </button>
          </div>
        </div>
      </main>
    </div>
  );
} 