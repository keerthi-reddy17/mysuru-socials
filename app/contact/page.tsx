"use client";

import Link from "next/link";
import { FormEvent } from "react";

export default function ContactPage() {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;

    const name = (
      form.elements.namedItem("name") as HTMLInputElement
    ).value;

    const phone = (
      form.elements.namedItem("phone") as HTMLInputElement
    ).value;

    const email = (
      form.elements.namedItem("email") as HTMLInputElement
    ).value;

    const enquiry = (
      form.elements.namedItem("enquiry") as HTMLSelectElement
    ).value;

    const message = (
      form.elements.namedItem("message") as HTMLTextAreaElement
    ).value;

    const whatsappMessage = `Hello Mysore Socials! 👋

I would like to make an enquiry.

Name: ${name}
Phone: ${phone}
Email: ${email}
Enquiry Type: ${enquiry}

Message:
${message}`;

    const whatsappURL = `https://wa.me/918884448148?text=${encodeURIComponent(
      whatsappMessage
    )}`;

    window.open(whatsappURL, "_blank");
  };

  return (
    <main className="min-h-screen bg-[#0b0a09] text-[#f5efe6]">

      {/* NAVBAR */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#0b0a09]/85 backdrop-blur-xl">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">

          <Link href="/" className="group">
            <p className="text-xs uppercase tracking-[0.35em] text-[#c9a878] transition group-hover:text-[#e1c99f]">
              Mysore Socials
            </p>

            <p className="mt-1 text-[9px] uppercase tracking-[0.28em] text-white/25">
              Restaurant · Events · Experiences
            </p>
          </Link>

          <nav className="hidden items-center gap-7 md:flex">

            <Link
              href="/"
              className="text-xs text-white/45 transition hover:text-[#c9a878]"
            >
              Home
            </Link>

            <Link
              href="/menu"
              className="text-xs text-white/45 transition hover:text-[#c9a878]"
            >
              Menu
            </Link>

            <Link
              href="/venue"
              className="text-xs text-white/45 transition hover:text-[#c9a878]"
            >
              Venue
            </Link>

            <Link
              href="/contact"
              className="text-xs text-[#c9a878]"
            >
              Contact
            </Link>

          </nav>

          <Link
            href="/booking"
            className="rounded-full bg-[#c9a878] px-5 py-2.5 text-xs font-medium text-[#0b0a09] transition hover:scale-[1.03] hover:bg-[#dfc294]"
          >
            Book a Table
          </Link>

        </div>

      </header>

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-white/10 px-6 pb-20 pt-36 lg:px-10 lg:pb-28">

        {/* background glow */}
        <div className="pointer-events-none absolute -right-40 top-10 h-96 w-96 rounded-full bg-[#c9a878]/[0.06] blur-3xl" />

        <div className="mx-auto max-w-7xl">

          <div className="max-w-4xl">

            <div className="flex items-center gap-3">
              <span className="h-px w-9 bg-[#c9a878]" />

              <p className="text-[10px] uppercase tracking-[0.4em] text-[#c9a878]">
                Contact & Enquiries
              </p>
            </div>

            <h1 className="mt-7 text-6xl font-light leading-[0.9] tracking-[-0.04em] sm:text-8xl">
              Let&apos;s
              <br />
              <span className="text-white/30">
                talk.
              </span>
            </h1>

            <p className="mt-8 max-w-xl text-sm leading-7 text-white/40 sm:text-base">
              Whether you&apos;re joining us for dinner, planning a
              celebration or looking for the perfect event space,
              we&apos;re just a message away.
            </p>

          </div>

          {/* SMALL CONTACT LINE */}
          <div className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-4 text-xs text-white/35">

            <a
              href="tel:+918884448148"
              className="transition hover:text-[#c9a878]"
            >
              +91 88844 48148
            </a>

            <span className="hidden h-1 w-1 rounded-full bg-[#c9a878]/50 sm:block" />

            <span>
              Mysuru, Karnataka
            </span>

            <span className="hidden h-1 w-1 rounded-full bg-[#c9a878]/50 sm:block" />

            <span>
              12 PM — 11 PM
            </span>

          </div>

        </div>

      </section>

      {/* QUICK ACTIONS */}
      <section className="border-b border-white/10 bg-[#10100e] px-6 lg:px-10">

        <div className="mx-auto grid max-w-7xl md:grid-cols-3">

          {/* CALL */}
          <a
            href="tel:+918884448148"
            className="group border-b border-white/10 p-7 transition duration-300 hover:bg-white/[0.025] md:border-b-0 md:border-r"
          >
            <div className="flex items-start justify-between">

              <div>
                <p className="text-[9px] uppercase tracking-[0.3em] text-white/25">
                  Call
                </p>

                <p className="mt-3 text-base text-white/70 transition group-hover:text-[#c9a878]">
                  +91 88844 48148
                </p>
              </div>

              <span className="text-lg text-white/20 transition group-hover:translate-x-1 group-hover:text-[#c9a878]">
                ↗
              </span>

            </div>
          </a>

          {/* WHATSAPP */}
          <a
            href="https://wa.me/918884448148"
            target="_blank"
            rel="noopener noreferrer"
            className="group border-b border-white/10 p-7 transition duration-300 hover:bg-white/[0.025] md:border-b-0 md:border-r"
          >
            <div className="flex items-start justify-between">

              <div>
                <p className="text-[9px] uppercase tracking-[0.3em] text-white/25">
                  WhatsApp
                </p>

                <p className="mt-3 text-base text-white/70 transition group-hover:text-[#c9a878]">
                  Start a conversation
                </p>
              </div>

              <span className="text-lg text-white/20 transition group-hover:translate-x-1 group-hover:text-[#c9a878]">
                ↗
              </span>

            </div>
          </a>

          {/* MAPS */}
          <a
            href="https://www.google.com/maps/search/?api=1&query=Mysore+Socials+Hebbal+Mysuru"
            target="_blank"
            rel="noopener noreferrer"
            className="group p-7 transition duration-300 hover:bg-white/[0.025]"
          >
            <div className="flex items-start justify-between">

              <div>
                <p className="text-[9px] uppercase tracking-[0.3em] text-white/25">
                  Location
                </p>

                <p className="mt-3 text-base text-white/70 transition group-hover:text-[#c9a878]">
                  Open in Google Maps
                </p>
              </div>

              <span className="text-lg text-white/20 transition group-hover:translate-x-1 group-hover:text-[#c9a878]">
                ↗
              </span>

            </div>
          </a>

        </div>

      </section>

      {/* MAIN CONTACT AREA */}
      <section className="px-6 py-20 lg:px-10 lg:py-28">

        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">

          {/* LEFT INFORMATION */}
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#11100e] p-8 sm:p-10">

            <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#c9a878]/[0.05] blur-3xl" />

            <p className="relative text-[10px] uppercase tracking-[0.35em] text-[#c9a878]">
              Find us
            </p>

            <h2 className="relative mt-5 text-4xl font-light tracking-tight">
              Mysore
              <br />
              Socials.
            </h2>

            <div className="relative mt-10 space-y-8">

              {/* ADDRESS */}
              <div>

                <p className="text-[9px] uppercase tracking-[0.3em] text-white/25">
                  Address
                </p>

                <p className="mt-3 max-w-sm text-sm leading-7 text-white/50">
                  225-P, Post, Hebbal Industrial Estate,
                  Hebbal Industrial Area, Belawadi,
                  Hebbalu, Karnataka 571130
                </p>

              </div>

              {/* PHONE */}
              <div>

                <p className="text-[9px] uppercase tracking-[0.3em] text-white/25">
                  Phone
                </p>

                <a
                  href="tel:+918884448148"
                  className="mt-3 block text-lg text-white/70 transition hover:text-[#c9a878]"
                >
                  +91 88844 48148
                </a>

              </div>

              {/* HOURS */}
              <div>

                <p className="text-[9px] uppercase tracking-[0.3em] text-white/25">
                  Opening Hours
                </p>

                <p className="mt-3 text-sm text-white/50">
                  12:00 PM — 11:00 PM
                </p>

              </div>

            </div>

            {/* EVENT BOX */}
            <div className="relative mt-12 rounded-2xl border border-[#c9a878]/15 bg-[#c9a878]/[0.04] p-5">

              <p className="text-sm text-[#c9a878]">
                Planning an event?
              </p>

              <p className="mt-2 text-xs leading-6 text-white/35">
                Ask us about our lawn and indoor event spaces,
                celebrations and private gatherings.
              </p>

              <Link
                href="/venue"
                className="mt-4 inline-block text-xs text-white/55 transition hover:text-[#c9a878]"
              >
                Explore Venue →
              </Link>

            </div>

          </div>

          {/* FORM */}
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.025] p-8 sm:p-10 lg:p-12">

            <div>

              <p className="text-[10px] uppercase tracking-[0.35em] text-[#c9a878]">
                Send an enquiry
              </p>

              <h2 className="mt-5 text-4xl font-light tracking-tight sm:text-5xl">
                Tell us what
                <br />
                <span className="text-white/30">
                  you need.
                </span>
              </h2>

            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-10 space-y-6"
            >

              {/* NAME + PHONE */}
              <div className="grid gap-5 sm:grid-cols-2">

                <div>
                  <label className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-white/35">
                    Name
                  </label>

                  <input
                    name="name"
                    type="text"
                    placeholder="Your name"
                    required
                    className="w-full rounded-xl border border-white/10 bg-[#11100e] px-4 py-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-[#c9a878]/70"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-white/35">
                    Phone
                  </label>

                  <input
                    name="phone"
                    type="tel"
                    placeholder="Your phone number"
                    required
                    className="w-full rounded-xl border border-white/10 bg-[#11100e] px-4 py-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-[#c9a878]/70"
                  />
                </div>

              </div>

              {/* EMAIL */}
              <div>

                <label className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-white/35">
                  Email
                </label>

                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-xl border border-white/10 bg-[#11100e] px-4 py-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-[#c9a878]/70"
                />

              </div>

              {/* ENQUIRY */}
              <div>

                <label className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-white/35">
                  Enquiry Type
                </label>

                <select
                  name="enquiry"
                  defaultValue=""
                  required
                  className="w-full rounded-xl border border-white/10 bg-[#11100e] px-4 py-4 text-sm text-white/70 outline-none transition focus:border-[#c9a878]/70"
                >
                  <option value="" disabled>
                    Select an option
                  </option>

                  <option>
                    Table Reservation
                  </option>

                  <option>
                    Venue Enquiry
                  </option>

                  <option>
                    Birthday / Celebration
                  </option>

                  <option>
                    Corporate Event
                  </option>

                  <option>
                    Wedding / Engagement
                  </option>

                  <option>
                    General Enquiry
                  </option>
                </select>

              </div>

              {/* MESSAGE */}
              <div>

                <label className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-white/35">
                  Message
                </label>

                <textarea
                  name="message"
                  rows={5}
                  placeholder="Tell us about your enquiry..."
                  required
                  className="w-full resize-none rounded-xl border border-white/10 bg-[#11100e] px-4 py-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-[#c9a878]/70"
                />

              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                className="group flex w-full items-center justify-center gap-3 rounded-full bg-[#c9a878] px-8 py-4 text-sm font-medium text-[#0b0a09] transition duration-300 hover:scale-[1.01] hover:bg-[#dfc294]"
              >
                Send Enquiry on WhatsApp

                <span className="transition group-hover:translate-x-1">
                  →
                </span>
              </button>

              <p className="text-center text-[10px] leading-5 text-white/25">
                Your details will be prepared in WhatsApp before
                you send the enquiry.
              </p>

            </form>

          </div>

        </div>

      </section>

      {/* VENUE CTA */}
      <section className="relative overflow-hidden border-t border-white/10 px-6 py-24 lg:px-10 lg:py-32">

        <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#c9a878]/[0.05] blur-3xl" />

        <div className="relative mx-auto max-w-3xl text-center">

          <p className="text-[10px] uppercase tracking-[0.4em] text-[#c9a878]">
            Make it memorable
          </p>

          <h2 className="mt-6 text-4xl font-light tracking-tight sm:text-6xl">
            Your celebration.
            <br />
            <span className="text-white/30">
              Our space.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-white/40">
            From intimate gatherings to larger celebrations,
            explore the spaces available at Mysore Socials.
          </p>

          <Link
            href="/venue"
            className="mt-9 inline-flex items-center gap-3 rounded-full border border-white/15 px-7 py-3.5 text-xs transition duration-300 hover:border-[#c9a878] hover:text-[#c9a878]"
          >
            Explore Event Spaces
            <span>→</span>
          </Link>

        </div>

      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-black px-6 py-9 lg:px-10">

        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-[10px] uppercase tracking-[0.2em] text-white/25 sm:flex-row">

          <p>
            Mysore Socials
          </p>

          <div className="flex gap-6">

            <Link
              href="/"
              className="transition hover:text-[#c9a878]"
            >
              Home
            </Link>

            <Link
              href="/menu"
              className="transition hover:text-[#c9a878]"
            >
              Menu
            </Link>

            <Link
              href="/venue"
              className="transition hover:text-[#c9a878]"
            >
              Venue
            </Link>

            <Link
              href="/booking"
              className="transition hover:text-[#c9a878]"
            >
              Booking
            </Link>

          </div>

          <p>
            © 2026
          </p>

        </div>

      </footer>

    </main>
  );
}