
"use client";

import { useState } from "react";
import { saveBooking } from "../lib/bookings";

export default function BookingPage() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState("");
  const [seating, setSeating] = useState("No Preference");
  const [specialRequest, setSpecialRequest] = useState("");

  return (
    <main className="min-h-screen bg-[#10090c] text-[#f5e9ec]">
      <style jsx global>{`
        .booking-page-font {
          font-family: Arial, Helvetica, sans-serif;
        }

        .booking-heading {
          font-family: Georgia, "Times New Roman", serif;
        }

        .booking-glass {
          background: rgba(255, 255, 255, 0.035);
          border: 1px solid rgba(217, 154, 170, 0.18);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.035),
            0 20px 60px rgba(0, 0, 0, 0.15);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }

        .booking-field {
          background: rgba(28, 14, 20, 0.8);
          color: #f5e9ec;
          border: 1px solid rgba(217, 154, 170, 0.17);
          transition:
            border-color 0.25s ease,
            box-shadow 0.25s ease,
            background 0.25s ease;
        }

        .booking-field::placeholder {
          color: rgba(245, 233, 236, 0.3);
        }

        .booking-field:focus {
          outline: none;
          border-color: #b65c73;
          background: rgba(40, 17, 27, 0.95);
          box-shadow: 0 0 0 3px rgba(139, 41, 66, 0.18);
        }

        .booking-field option {
          background: #160d11;
          color: #f5e9ec;
        }

        .booking-seating {
          background: rgba(28, 14, 20, 0.65);
          border: 1px solid rgba(217, 154, 170, 0.17);
          transition:
            border-color 0.25s ease,
            background 0.25s ease,
            box-shadow 0.25s ease;
        }

        .booking-seating:hover {
          border-color: rgba(182, 92, 115, 0.65);
          background: rgba(139, 41, 66, 0.13);
        }

        .booking-seating:has(input:checked) {
          border-color: rgba(217, 154, 170, 0.7);
          background: rgba(139, 41, 66, 0.2);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.045);
        }

        .booking-radio {
          accent-color: #b65c73;
        }

        .booking-submit {
          border: 1px solid rgba(245, 233, 236, 0.28);
          background: rgba(139, 41, 66, 0.42);
          color: #fff4f6;
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.15),
            0 8px 30px rgba(0, 0, 0, 0.18);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          transition:
            background 0.3s ease,
            border-color 0.3s ease,
            box-shadow 0.3s ease,
            transform 0.3s ease;
        }

        .booking-submit:hover {
          background: rgba(182, 92, 115, 0.5);
          border-color: rgba(245, 233, 236, 0.42);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.2),
            0 12px 34px rgba(139, 41, 66, 0.22);
          transform: translateY(-2px);
        }

        .booking-submit:active {
          transform: scale(0.99);
        }

        .booking-back {
          transition: color 0.25s ease;
        }

        .booking-back:hover {
          color: #d99aaa;
        }
      `}</style>

      <div className="booking-page-font">
        {/* Header */}
        <section className="px-6 pb-12 pt-36">
          <div className="mx-auto max-w-4xl">
            <a
              href="/"
              className="booking-back text-sm text-white/55"
            >
              ← Back to Home
            </a>

            <div className="mt-10">
              <p className="text-sm uppercase tracking-[0.35em] text-[#d99aaa]">
                Reservations
              </p>

              <h1 className="booking-heading mt-4 text-5xl font-normal tracking-tight sm:text-7xl">
                Book a Table.
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-7 text-[#c4afb4] sm:text-lg">
                Choose your date, time and seating preference.
                We’ll take care of the rest.
              </p>
            </div>
          </div>
        </section>

        {/* Booking Form */}
        <section className="px-6 pb-28">
          <div className="mx-auto max-w-4xl">
            <form
              onSubmit={(e) => {
                e.preventDefault();

                saveBooking({
                  id: `BK${Date.now()}`,
                  name,
                  phone,
                  email,
                  date,
                  time,
                  guests,
                  seating,
                  specialRequest,
                  status: "Pending",
                });

                setSubmitted(true);
              }}
              className="booking-glass rounded-[2rem] p-6 sm:p-10"
            >
              <div className="grid gap-6 md:grid-cols-2">
                {/* Full Name */}
                <div>
                  <label className="mb-2 block text-sm text-[#c4afb4]">
                    Full Name
                  </label>

                  <input
                    type="text"
                    placeholder="Your name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="booking-field h-[52px] w-full rounded-xl px-4"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="mb-2 block text-sm text-[#c4afb4]">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    placeholder="Your phone number"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="booking-field h-[52px] w-full rounded-xl px-4"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="mb-2 block text-sm text-[#c4afb4]">
                    Email
                  </label>

                  <input
                    type="email"
                    placeholder="Your email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="booking-field h-[52px] w-full rounded-xl px-4"
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="mb-2 block text-sm text-[#c4afb4]">
                    Booking Date
                  </label>

                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="booking-field h-[52px] w-full rounded-xl px-4"
                  />
                </div>

                {/* Time */}
                <div>
                  <label className="mb-2 block text-sm text-[#c4afb4]">
                    Preferred Time
                  </label>

                  <select
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="booking-field h-[52px] w-full rounded-xl px-4"
                  >
                    <option value="" disabled>
                      Select time
                    </option>

                    <option value="8:00 AM">8:00 AM</option>
                    <option value="8:30 AM">8:30 AM</option>
                    <option value="9:00 AM">9:00 AM</option>
                    <option value="9:30 AM">9:30 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="10:30 AM">10:30 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="12:30 PM">12:30 PM</option>
                    <option value="1:00 PM">1:00 PM</option>
                    <option value="1:30 PM">1:30 PM</option>
                    <option value="2:00 PM">2:00 PM</option>
                    <option value="2:30 PM">2:30 PM</option>
                    <option value="3:00 PM">3:00 PM</option>
                    <option value="3:30 PM">3:30 PM</option>
                    <option value="4:00 PM">4:00 PM</option>
                    <option value="4:30 PM">4:30 PM</option>
                    <option value="5:00 PM">5:00 PM</option>
                    <option value="5:30 PM">5:30 PM</option>
                    <option value="6:00 PM">6:00 PM</option>
                    <option value="6:30 PM">6:30 PM</option>
                    <option value="7:00 PM">7:00 PM</option>
                    <option value="7:30 PM">7:30 PM</option>
                    <option value="8:00 PM">8:00 PM</option>
                    <option value="8:30 PM">8:30 PM</option>
                    <option value="9:00 PM">9:00 PM</option>
                    <option value="9:30 PM">9:30 PM</option>
                    <option value="10:00 PM">10:00 PM</option>
                    <option value="10:30 PM">10:30 PM</option>
                    <option value="11:00 PM">11:00 PM</option>
                  </select>
                </div>

                {/* Guests */}
                <div>
                  <label className="mb-2 block text-sm text-[#c4afb4]">
                    Number of Guests
                  </label>

                  <select
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    required
                    className="booking-field h-[52px] w-full rounded-xl px-4"
                  >
                    <option value="" disabled>
                      Select guests
                    </option>
                    <option>1 Guest</option>
                    <option>2 Guests</option>
                    <option>3 Guests</option>
                    <option>4 Guests</option>
                    <option>5 Guests</option>
                    <option>6 Guests</option>
                    <option>7 Guests</option>
                    <option>8+ Guests</option>
                  </select>
                </div>
              </div>

              {/* Seating */}
              <div className="mt-8">
                <label className="mb-3 block text-sm text-[#c4afb4]">
                  Seating Preference
                </label>

                <div className="grid gap-3 sm:grid-cols-3">
                  <label className="booking-seating cursor-pointer rounded-xl p-4">
                    <input
                      type="radio"
                      name="seating"
                      value="Indoor"
                      checked={seating === "Indoor"}
                      onChange={(e) => setSeating(e.target.value)}
                      className="booking-radio mr-3"
                    />
                    Indoor
                  </label>

                  <label className="booking-seating cursor-pointer rounded-xl p-4">
                    <input
                      type="radio"
                      name="seating"
                      value="Outdoor"
                      checked={seating === "Outdoor"}
                      onChange={(e) => setSeating(e.target.value)}
                      className="booking-radio mr-3"
                    />
                    Outdoor
                  </label>

                  <label className="booking-seating cursor-pointer rounded-xl p-4">
                    <input
                      type="radio"
                      name="seating"
                      value="No Preference"
                      checked={seating === "No Preference"}
                      onChange={(e) => setSeating(e.target.value)}
                      className="booking-radio mr-3"
                    />
                    No Preference
                  </label>
                </div>
              </div>

              {/* Special Request */}
              <div className="mt-8">
                <label className="mb-2 block text-sm text-[#c4afb4]">
                  Special Request
                </label>

                <textarea
                  rows={5}
                  value={specialRequest}
                  onChange={(e) => setSpecialRequest(e.target.value)}
                  placeholder="Birthday, anniversary, special seating request..."
                  className="booking-field w-full resize-none rounded-xl px-4 py-3.5"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="booking-submit mt-8 w-full rounded-full px-8 py-4 font-medium"
              >
                Request Reservation
              </button>

              {submitted && (
                <p className="mt-4 text-center text-sm text-[#d99aaa]">
                  Reservation request received. We’ll get back to you shortly.
                </p>
              )}
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}

