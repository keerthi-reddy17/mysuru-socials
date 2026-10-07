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
    <main className="min-h-screen bg-[#11100e] text-[#f5efe5]">

      {/* Header */}
      <section className="px-6 pb-12 pt-36">
        <div className="mx-auto max-w-4xl">

          <a
            href="/"
            className="text-sm text-white/50 transition hover:text-[#c9a878]"
          >
            ← Back to Home
          </a>

          <div className="mt-10">
            <p className="text-sm uppercase tracking-[0.35em] text-[#c9a878]">
              Reservations
            </p>

            <h1 className="mt-4 text-5xl font-semibold tracking-tight sm:text-7xl">
              Book a Table.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-white/50 sm:text-lg">
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
            className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 sm:p-10"
          >

            <div className="grid gap-6 md:grid-cols-2">

              {/* Full Name */}
              <div>
                <label className="mb-2 block text-sm text-white/60">
                  Full Name
                </label>

                <input
                  type="text"
                  placeholder="Your name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-[52px] w-full rounded-xl border border-white/10 bg-[#171512] px-4 text-white outline-none transition placeholder:text-white/25 focus:border-[#c9a878]"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="mb-2 block text-sm text-white/60">
                  Phone Number
                </label>

                <input
                  type="tel"
                  placeholder="Your phone number"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-[52px] w-full rounded-xl border border-white/10 bg-[#171512] px-4 text-white outline-none transition placeholder:text-white/25 focus:border-[#c9a878]"
                />
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm text-white/60">
                  Email
                </label>

                <input
                  type="email"
                  placeholder="Your email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-[52px] w-full rounded-xl border border-white/10 bg-[#171512] px-4 text-white outline-none transition placeholder:text-white/25 focus:border-[#c9a878]"
                />
              </div>

              {/* Date */}
              <div>
                <label className="mb-2 block text-sm text-white/60">
                  Booking Date
                </label>

                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="h-[52px] w-full rounded-xl border border-white/10 bg-[#171512] px-4 text-white outline-none transition focus:border-[#c9a878]"
                />
              </div>

              {/* Time */}
              <div>
                <label className="mb-2 block text-sm text-white/60">
                  Preferred Time
                </label>

                <select
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="h-[52px] w-full rounded-xl border border-white/10 bg-[#171512] px-4 text-white outline-none transition focus:border-[#c9a878]"
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
                <label className="mb-2 block text-sm text-white/60">
                  Number of Guests
                </label>

                <select
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  required
                  className="h-[52px] w-full rounded-xl border border-white/10 bg-[#171512] px-4 text-white outline-none transition focus:border-[#c9a878]"
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
              <label className="mb-3 block text-sm text-white/60">
                Seating Preference
              </label>

              <div className="grid gap-3 sm:grid-cols-3">

                <label className="cursor-pointer rounded-xl border border-white/10 bg-[#171512] p-4 transition hover:border-[#c9a878]/50">
                  <input
                    type="radio"
                    name="seating"
                    value="Indoor"
                    checked={seating === "Indoor"}
                    onChange={(e) => setSeating(e.target.value)}
                    className="mr-3"
                  />
                  Indoor
                </label>

                <label className="cursor-pointer rounded-xl border border-white/10 bg-[#171512] p-4 transition hover:border-[#c9a878]/50">
                  <input
                    type="radio"
                    name="seating"
                    value="Outdoor"
                    checked={seating === "Outdoor"}
                    onChange={(e) => setSeating(e.target.value)}
                    className="mr-3"
                  />
                  Outdoor
                </label>

                <label className="cursor-pointer rounded-xl border border-white/10 bg-[#171512] p-4 transition hover:border-[#c9a878]/50">
                  <input
                    type="radio"
                    name="seating"
                    value="No Preference"
                    checked={seating === "No Preference"}
                    onChange={(e) => setSeating(e.target.value)}
                    className="mr-3"
                  />
                  No Preference
                </label>

              </div>
            </div>

            {/* Special Request */}
            <div className="mt-8">
              <label className="mb-2 block text-sm text-white/60">
                Special Request
              </label>

              <textarea
                rows={5}
                value={specialRequest}
                onChange={(e) => setSpecialRequest(e.target.value)}
                placeholder="Birthday, anniversary, special seating request..."
                className="w-full resize-none rounded-xl border border-white/10 bg-[#171512] px-4 py-3.5 text-white outline-none transition placeholder:text-white/25 focus:border-[#c9a878]"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="mt-8 w-full rounded-full bg-[#c9a878] px-8 py-4 font-medium text-[#11100e] transition duration-300 hover:scale-[1.01] hover:bg-[#d8bb91]"
            >
              Request Reservation
            </button>

            {submitted && (
              <p className="mt-4 text-center text-sm text-[#c9a878]">
                Reservation request received. We’ll get back to you shortly.
              </p>
            )}

          </form>

        </div>
      </section>

    </main>
  );
}