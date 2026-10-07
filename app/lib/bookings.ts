export type Booking = {
  id: string;
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  guests: string;
  seating: string;
  specialRequest: string;
  status: "Pending" | "Confirmed" | "Cancelled";
};

const STORAGE_KEY = "mysore-socials-bookings";

export function getBookings(): Booking[] {
  if (typeof window === "undefined") {
    return [];
  }

  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    return [];
  }

  return JSON.parse(saved);
}

export function saveBooking(booking: Booking) {
  const existingBookings = getBookings();

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify([...existingBookings, booking])
  );
}

export function updateBookingStatus(
  id: string,
  status: Booking["status"]
) {
  const bookings = getBookings();

  const updatedBookings = bookings.map((booking) =>
    booking.id === id
      ? { ...booking, status }
      : booking
  );

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updatedBookings)
  );
}