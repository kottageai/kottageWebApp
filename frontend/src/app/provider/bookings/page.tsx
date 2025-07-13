"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";

interface Booking {
  id: number;
  created_at: string;
  // Add other booking properties here
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const response = await fetch(`${baseUrl}/bookings`);
        if (!response.ok) {
          throw new Error('Failed to fetch bookings');
        }
        const data = await response.json();
        setBookings(data.bookings);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'white' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', margin: '0 0 2rem 0' }}>Bookings</h1>

        {loading && <p>Loading bookings...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        {!loading && !error && (
          <div>
            {bookings.length === 0 ? (
              <p>No bookings found.</p>
            ) : (
              <pre>{JSON.stringify(bookings, null, 2)}</pre>
            )}
          </div>
        )}
      </main>
    </div>
  );
} 