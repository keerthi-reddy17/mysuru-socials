
"use client";

import Link from "next/link";
import { FormEvent } from "react";

const glassButton =
  "inline-flex items-center justify-center rounded-full border border-[#d99aaa]/30 bg-white/[0.07] px-5 py-3 text-xs font-medium text-[#f5e9ec] shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-[#d99aaa]/60 hover:bg-[#8b2942]/35";

const primaryButton =
  "inline-flex items-center justify-center rounded-full border border-[#d99aaa]/35 bg-gradient-to-br from-[#a6425d]/95 to-[#6e2037]/95 px-6 py-3 text-xs font-medium text-[#fff5f7] shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_8px_24px_rgba(82,18,39,0.3)] backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:from-[#b6506b] hover:to-[#812943]";

const labelStyle =
  "mb-2 block text-[10px] uppercase tracking-[0.2em] text-[#c6aeb5]";

const inputStyle =
  "w-full rounded-xl border border-[#d99aaa]/20 bg-[#10090c]/75 px-4 py-4 text-sm text-[#f5e9ec] outline-none backdrop-blur-xl transition placeholder:text-[#8f737d] focus:border-[#d99aaa]/65 focus:bg-[#1b0d13]/90 focus:ring-2 focus:ring-[#8b2942]/20";

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
    <main className="min-h-screen overflow-hidden bg-[#10090c] font-[Arial,sans-serif] text-[#f5e9ec]">

      {/* NAVBAR */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[#d99aaa]/15 bg-[#10090c]/80 shadow-[0_8px_30px_rgba(0,0,0,0.12)] backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-5 lg:px-10">
          <Link href="/" className="group shrink-0">
            <p className="font-[Georgia,serif] text-sm uppercase tracking-[0.25em] text-[#e5a8b8] transition group-hover:text-[#f5e9ec]">
              Mysore Socials
            </p>

            <p className="mt-1 text-[9px] uppercase tracking-[0.2em] text-[#b99da7]">
              Restaurant · Events · Experiences
            </p>
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            <Link
              href="/"
              className="text-xs text-[#c6aeb5] transition hover:text-[#e5a8b8]"
            >
              Home
            </Link>

            <Link
              href="/menu"
              className="text-xs text-[#c6aeb5] transition hover:text-[#e5a8b8]"
            >
              Menu
            </Link>

            <Link
              href="/venue"
              className="text-xs text-[#c6aeb5] transition hover:text-[#e5a8b8]"
            >
              Venue
            </Link>

            <Link
              href="/contact"
              aria-current="page"
              className="text-xs text-[#e5a8b8]"
            >
              Contact
            </Link>
          </nav>

          <Link href="/booking" className={`${primaryButton} shrink-0`}>
            Book a Table
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-[#d99aaa]/15 px-6 pb-20 pt-36 lg:px-10 lg:pb-28">
        <div className="pointer-events-none absolute -right-40 top-10 h-96 w-96 rounded-full bg-[#8b2942]/15 blur-[100px]" />
        <div className="pointer-events-none absolute -left-40 bottom-0 h-72 w-72 rounded-full bg-[#541629]/20 blur-[100px]" />

        <div className="relative mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3">
              <span className="h-px w-9 bg-[#d99aaa]" />

              <p className="text-[10px] uppercase tracking-[0.4em] text-[#d99aaa]">
                Contact & Enquiries
              </p>
            </div>

            <h1 className="mt-7 font-[Georgia,serif] text-6xl font-semibold leading-[0.95] tracking-tight text-[#f5e9ec] sm:text-8xl">
              Let&apos;s
              <br />
              <span className="text-[#b65c73]">talk.</span>
            </h1>

            <p className="mt-8 max-w-xl text-sm leading-7 text-[#c6aeb5] sm:text-base">
              Whether you&apos;re joining us for dinner, planning a
              celebration or looking for the perfect event space,
              we&apos;re just a message away.
            </p>
          </div>

          {/* SMALL CONTACT LINE */}
          <div className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-4 text-xs text-[#c6aeb5]">
            <a
              href="tel:+918884448148"
              className="transition hover:text-[#e5a8b8]"
            >
              +91 88844 48148
            </a>

            <span className="hidden h-1 w-1 rounded-full bg-[#d99aaa]/60 sm:block" />

            <span>Mysuru, Karnataka</span>

            <span className="hidden h-1 w-1 rounded-full bg-[#d99aaa]/60 sm:block" />

            <span>12 PM — 11 PM</span>
          </div>
        </div>
      </section>

      {/* QUICK ACTIONS */}
      <section className="border-b border-[#d99aaa]/15 bg-[#160b10]/70 px-6 backdrop-blur-xl lg:px-10">
        <div className="mx-auto grid max-w-7xl md:grid-cols-3">

          {/* CALL */}
          <a
            href="tel:+918884448148"
            className="group border-b border-[#d99aaa]/15 p-7 transition duration-300 hover:bg-[#8b2942]/10 md:border-b-0 md:border-r md:border-r-[#d99aaa]/15"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[9px] uppercase tracking-[0.3em] text-[#b99da7]">
                  Call
                </p>

                <p className="mt-3 text-base text-[#e5d7dc] transition group-hover:text-[#e5a8b8]">
                  +91 88844 48148
                </p>
              </div>

              <span className="text-lg text-[#b99da7] transition group-hover:translate-x-1 group-hover:text-[#d99aaa]">
                ↗
              </span>
            </div>
          </a>

          {/* WHATSAPP */}
          <a
            href="https://wa.me/918884448148"
            target="_blank"
            rel="noopener noreferrer"
            className="group border-b border-[#d99aaa]/15 p-7 transition duration-300 hover:bg-[#8b2942]/10 md:border-b-0 md:border-r md:border-r-[#d99aaa]/15"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[9px] uppercase tracking-[0.3em] text-[#b99da7]">
                  WhatsApp
                </p>

                <p className="mt-3 text-base text-[#e5d7dc] transition group-hover:text-[#e5a8b8]">
                  Start a conversation
                </p>
              </div>

              <span className="text-lg text-[#b99da7] transition group-hover:translate-x-1 group-hover:text-[#d99aaa]">
                ↗
              </span>
            </div>
          </a>

          {/* MAPS */}
          <a
            href="https://www.google.com/maps/search/?api=1&query=Mysore+Socials+Hebbal+Mysuru"
            target="_blank"
            rel="noopener noreferrer"
            className="group p-7 transition duration-300 hover:bg-[#8b2942]/10"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[9px] uppercase tracking-[0.3em] text-[#b99da7]">
                  Location
                </p>

                <p className="mt-3 text-base text-[#e5d7dc] transition group-hover:text-[#e5a8b8]">
                  Open in Google Maps
                </p>
              </div>

              <span className="text-lg text-[#b99da7] transition group-hover:translate-x-1 group-hover:text-[#d99aaa]">
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
          <div className="relative overflow-hidden rounded-[2rem] border border-[#d99aaa]/20 bg-gradient-to-br from-[#29131c]/90 via-[#1c0d13]/95 to-[#160b10]/95 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.2)] backdrop-blur-2xl sm:p-10">
            <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#8b2942]/20 blur-[80px]" />

            <p className="relative text-[10px] uppercase tracking-[0.35em] text-[#d99aaa]">
              Find us
            </p>

            <h2 className="relative mt-5 font-[Georgia,serif] text-4xl font-semibold leading-tight text-[#f5e9ec]">
              Mysore
              <br />
              Socials.
            </h2>

            <div className="relative mt-10 space-y-8">

              {/* ADDRESS */}
              <div>
                <p className="text-[9px] uppercase tracking-[0.3em] text-[#b99da7]">
                  Address
                </p>

                <p className="mt-3 max-w-sm text-sm leading-7 text-[#c6aeb5]">
                  225-P, Post, Hebbal Industrial Estate,
                  Hebbal Industrial Area, Belawadi,
                  Hebbalu, Karnataka 571130
                </p>
              </div>

              {/* PHONE */}
              <div>
                <p className="text-[9px] uppercase tracking-[0.3em] text-[#b99da7]">
                  Phone
                </p>

                <a
                  href="tel:+918884448148"
                  className="mt-3 block text-lg text-[#e5d7dc] transition hover:text-[#e5a8b8]"
                >
                  +91 88844 48148
                </a>
              </div>

              {/* HOURS */}
              <div>
                <p className="text-[9px] uppercase tracking-[0.3em] text-[#b99da7]">
                  Opening Hours
                </p>

                <p className="mt-3 text-sm text-[#c6aeb5]">
                  12:00 PM — 11:00 PM
                </p>
              </div>
            </div>

            {/* EVENT BOX */}
            <div className="relative mt-12 rounded-2xl border border-[#d99aaa]/20 bg-white/[0.045] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl">
              <p className="text-sm text-[#e5a8b8]">
                Planning an event?
              </p>

              <p className="mt-2 text-xs leading-6 text-[#c6aeb5]">
                Ask us about our lawn and indoor event spaces,
                celebrations and private gatherings.
              </p>

              <Link
                href="/venue"
                className="mt-4 inline-block text-xs text-[#e5d7dc] transition hover:text-[#e5a8b8]"
              >
                Explore Venue →
              </Link>
            </div>
          </div>

          {/* FORM */}
          <div className="rounded-[2rem] border border-[#d99aaa]/20 bg-white/[0.035] p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_20px_60px_rgba(0,0,0,0.16)] backdrop-blur-2xl sm:p-10 lg:p-12">
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-[#d99aaa]">
                Send an enquiry
              </p>

              <h2 className="mt-5 font-[Georgia,serif] text-4xl font-semibold leading-tight text-[#f5e9ec] sm:text-5xl">
                Tell us what
                <br />
                <span className="text-[#b65c73]">you need.</span>
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="mt-10 space-y-6">

              {/* NAME + PHONE */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-name" className={labelStyle}>
                    Name
                  </label>

                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    placeholder="Your name"
                    required
                    autoComplete="name"
                    className={inputStyle}
                  />
                </div>

                <div>
                  <label htmlFor="contact-phone" className={labelStyle}>
                    Phone
                  </label>

                  <input
                    id="contact-phone"
                    name="phone"
                    type="tel"
                    placeholder="Your phone number"
                    required
                    autoComplete="tel"
                    className={inputStyle}
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div>
                <label htmlFor="contact-email" className={labelStyle}>
                  Email
                </label>

                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  className={inputStyle}
                />
              </div>

              {/* ENQUIRY */}
              <div>
                <label htmlFor="contact-enquiry" className={labelStyle}>
                  Enquiry Type
                </label>

                <select
                  id="contact-enquiry"
                  name="enquiry"
                  defaultValue=""
                  required
                  className={`${inputStyle} appearance-auto`}
                >
                  <option value="" disabled>
                    Select an option
                  </option>

                  <option className="bg-[#1b0d13] text-[#f5e9ec]">
                    Table Reservation
                  </option>

                  <option className="bg-[#1b0d13] text-[#f5e9ec]">
                    Venue Enquiry
                  </option>

                  <option className="bg-[#1b0d13] text-[#f5e9ec]">
                    Birthday / Celebration
                  </option>

                  <option className="bg-[#1b0d13] text-[#f5e9ec]">
                    Corporate Event
                  </option>

                  <option className="bg-[#1b0d13] text-[#f5e9ec]">
                    Wedding / Engagement
                  </option>

                  <option className="bg-[#1b0d13] text-[#f5e9ec]">
                    General Enquiry
                  </option>
                </select>
              </div>

              {/* MESSAGE */}
              <div>
                <label htmlFor="contact-message" className={labelStyle}>
                  Message
                </label>

                <textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  placeholder="Tell us about your enquiry..."
                  required
                  className={`${inputStyle} resize-none`}
                />
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                className={`${primaryButton} group w-full gap-3 py-4 text-sm`}
              >
                Send Enquiry on WhatsApp

                <span className="transition group-hover:translate-x-1">
                  →
                </span>
              </button>

              <p className="text-center text-[10px] leading-5 text-[#b99da7]">
                Your details will be prepared in WhatsApp before
                you send the enquiry.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* VENUE CTA */}
      <section className="relative overflow-hidden border-t border-[#d99aaa]/15 px-6 py-24 lg:px-10 lg:py-32">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#8b2942]/15 blur-[100px]" />

        <div className="relative mx-auto max-w-3xl text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#d99aaa]">
            Make it memorable
          </p>

          <h2 className="mt-6 font-[Georgia,serif] text-4xl font-semibold leading-tight text-[#f5e9ec] sm:text-6xl">
            Your celebration.
            <br />
            <span className="text-[#b65c73]">Our space.</span>
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-[#c6aeb5]">
            From intimate gatherings to larger celebrations,
            explore the spaces available at Mysore Socials.
          </p>

          <Link href="/venue" className={`${glassButton} mt-9 gap-3`}>
            Explore Event Spaces
            <span>→</span>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#d99aaa]/15 bg-[#0c0609] px-6 py-9 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-[10px] uppercase tracking-[0.2em] text-[#b99da7] sm:flex-row">
          <p className="font-[Georgia,serif] text-[#d99aaa]">
            Mysore Socials
          </p>

          <div className="flex flex-wrap gap-6">
            <Link href="/" className="transition hover:text-[#e5a8b8]">
              Home
            </Link>

            <Link href="/menu" className="transition hover:text-[#e5a8b8]">
              Menu
            </Link>

            <Link href="/venue" className="transition hover:text-[#e5a8b8]">
              Venue
            </Link>

            <Link href="/booking" className="transition hover:text-[#e5a8b8]">
              Booking
            </Link>
          </div>

          <p>© 2026</p>
        </div>
      </footer>
    </main>
  );
}

