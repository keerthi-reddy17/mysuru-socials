
"use client";

const WHATSAPP_NUMBER = "918884448148";

function sendVenueEnquiry(venue: string) {
  const message = encodeURIComponent(
    `Hi Mysore Socials, I am interested in booking the ${venue}. Please share the available dates and details.`
  );

  window.open(
    `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`,
    "_blank"
  );
}

const venueImages = {
  hero:
    "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1800&q=85",
  lawn:
    "https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=1200&q=85",
  hall:
    "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=85",
  celebration:
    "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1000&q=85",
  dinner:
    "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1000&q=85",
  event:
    "https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=1000&q=85",
};

const glassButton =
  "inline-flex items-center justify-center rounded-full border border-[#d99aaa]/35 bg-white/[0.08] px-7 py-4 text-sm font-medium text-[#f5e9ec] shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_8px_24px_rgba(0,0,0,0.18)] backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-[#d99aaa]/70 hover:bg-[#8b2942]/45";

const primaryButton =
  "inline-flex items-center justify-center rounded-full border border-[#d99aaa]/40 bg-gradient-to-br from-[#a6425d]/90 to-[#6e2037]/90 px-7 py-4 text-sm font-medium text-[#fff5f7] shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_8px_28px_rgba(82,18,39,0.3)] backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:from-[#b6506b] hover:to-[#812943]";

const sectionLabel =
  "text-xs uppercase tracking-[0.35em] text-[#d99aaa]";

const sectionHeading =
  "mt-5 font-[Georgia,serif] text-4xl font-semibold leading-tight tracking-tight text-[#f5e9ec] sm:text-6xl";

const description =
  "text-base leading-8 text-[#c6aeb5] sm:text-lg";

const tagStyle =
  "rounded-full border border-[#d99aaa]/20 bg-white/[0.035] px-4 py-2 text-xs text-[#d8c3ca] backdrop-blur-md";

export default function VenuePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#10090c] font-[Arial,sans-serif] text-[#f5e9ec]">

      {/* HERO */}
      <section className="relative min-h-[85vh] overflow-hidden">
        <img
          src={venueImages.hero}
          alt="Mysore Socials event space"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#10090c] via-[#10090c]/25 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#10090c]/40 via-transparent to-transparent" />

        <div className="relative z-10 mx-auto flex min-h-[85vh] max-w-7xl flex-col justify-end px-6 pb-20">
          <a
            href="/"
            className="mb-auto inline-flex w-fit rounded-full border border-white/15 bg-black/20 px-4 py-2 text-sm text-white/75 backdrop-blur-xl transition hover:border-[#d99aaa]/50 hover:text-[#f5e9ec]"
            style={{ marginTop: "8rem" }}
          >
            ← Back to Home
          </a>

          <div className="max-w-4xl">
            <p className={sectionLabel}>
              Events • Celebrations • Gatherings
            </p>

            <h1 className="mt-5 font-[Georgia,serif] text-5xl font-semibold leading-[0.98] tracking-tight text-[#fff5f7] sm:text-7xl lg:text-8xl">
              Your moments.
              <br />
              <span className="text-[#d99aaa]">Our space.</span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-8 text-white/75 sm:text-lg">
              Bring your celebrations, gatherings and special occasions to
              life at Mysore Socials.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <button
                onClick={() => sendVenueEnquiry("event venue")}
                className={primaryButton}
              >
                Enquire Now
              </button>

              <a href="#spaces" className={glassButton}>
                Explore Spaces
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:items-end">
            <div>
              <p className={sectionLabel}>The Venue</p>

              <h2 className={sectionHeading}>
                A space made
                <br />
                for moments.
              </h2>
            </div>

            <p className={`max-w-2xl ${description}`}>
              Whether it is a personal celebration, a private gathering or
              an evening with your people, Mysore Socials gives you a space
              where the atmosphere becomes part of the occasion.
            </p>
          </div>
        </div>
      </section>

      {/* VENUE SPACES */}
      <section id="spaces" className="scroll-mt-10 px-6 pb-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10">
            <p className={sectionLabel}>Choose your setting</p>

            <h2 className="mt-4 max-w-4xl font-[Georgia,serif] text-4xl font-semibold leading-tight text-[#f5e9ec] sm:text-5xl">
              Spaces for every kind of gathering.
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">

            {/* LAWN */}
            <article className="group overflow-hidden rounded-[2rem] border border-[#d99aaa]/15 bg-gradient-to-b from-[#28131b]/90 to-[#170c11]/95 shadow-[0_20px_60px_rgba(0,0,0,0.22)] transition duration-300 hover:border-[#d99aaa]/35">
              <div className="relative h-[420px] overflow-hidden">
                <img
                  src={venueImages.lawn}
                  alt="Outdoor lawn event space"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#10090c] via-black/10 to-transparent" />

                <div className="absolute bottom-8 left-8">
                  <p className={sectionLabel}>Outdoor</p>

                  <h3 className="mt-3 font-[Georgia,serif] text-4xl font-semibold text-white">
                    The Lawn
                  </h3>
                </div>
              </div>

              <div className="p-8">
                <p className="leading-7 text-[#c6aeb5]">
                  An open-air setting for celebrations, gatherings and relaxed
                  evenings surrounded by an inviting outdoor atmosphere.
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {[
                    "Celebrations",
                    "Private Events",
                    "Social Gatherings",
                  ].map((item) => (
                    <span key={item} className={tagStyle}>
                      {item}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => sendVenueEnquiry("The Lawn")}
                  className={`${glassButton} mt-8`}
                >
                  Enquire for the Lawn →
                </button>
              </div>
            </article>

            {/* HALL */}
            <article className="group overflow-hidden rounded-[2rem] border border-[#d99aaa]/15 bg-gradient-to-b from-[#28131b]/90 to-[#170c11]/95 shadow-[0_20px_60px_rgba(0,0,0,0.22)] transition duration-300 hover:border-[#d99aaa]/35">
              <div className="relative h-[420px] overflow-hidden">
                <img
                  src={venueImages.hall}
                  alt="Indoor event hall"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#10090c] via-black/10 to-transparent" />

                <div className="absolute bottom-8 left-8">
                  <p className={sectionLabel}>Indoor</p>

                  <h3 className="mt-3 font-[Georgia,serif] text-4xl font-semibold text-white">
                    Party Hall
                  </h3>
                </div>
              </div>

              <div className="p-8">
                <p className="leading-7 text-[#c6aeb5]">
                  A comfortable indoor setting for private celebrations,
                  family occasions, social gatherings and special events.
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {[
                    "Private Events",
                    "Family Functions",
                    "Special Occasions",
                  ].map((item) => (
                    <span key={item} className={tagStyle}>
                      {item}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => sendVenueEnquiry("Party Hall")}
                  className={`${glassButton} mt-8`}
                >
                  Enquire for the Hall →
                </button>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* VISUAL GALLERY */}
      <section className="border-y border-[#d99aaa]/15 bg-gradient-to-b from-[#1d0e14]/60 to-transparent px-6 py-28">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className={sectionLabel}>The atmosphere</p>

              <h2 className="mt-4 font-[Georgia,serif] text-4xl font-semibold leading-tight text-[#f5e9ec] sm:text-6xl">
                Come for the moment.
                <br />
                Stay for the memories.
              </h2>
            </div>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            <div className="group relative h-[420px] overflow-hidden rounded-[1.8rem] border border-[#d99aaa]/15">
              <img
                src={venueImages.celebration}
                alt="Celebration setup"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#10090c]/90 via-transparent to-transparent" />

              <p className="absolute bottom-6 left-6 font-[Georgia,serif] text-xl text-white">
                Celebrations
              </p>
            </div>

            <div className="group relative h-[420px] overflow-hidden rounded-[1.8rem] border border-[#d99aaa]/15">
              <img
                src={venueImages.dinner}
                alt="Dining and gathering"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#10090c]/90 via-transparent to-transparent" />

              <p className="absolute bottom-6 left-6 font-[Georgia,serif] text-xl text-white">
                Gatherings
              </p>
            </div>

            <div className="group relative h-[420px] overflow-hidden rounded-[1.8rem] border border-[#d99aaa]/15">
              <img
                src={venueImages.event}
                alt="Event atmosphere"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#10090c]/90 via-transparent to-transparent" />

              <p className="absolute bottom-6 left-6 font-[Georgia,serif] text-xl text-white">
                Special Moments
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* EVENTS */}
      <section className="px-6 py-28">
        <div className="mx-auto max-w-7xl">
          <p className={sectionLabel}>Made for every occasion</p>

          <h2 className="mt-5 max-w-3xl font-[Georgia,serif] text-4xl font-semibold leading-tight tracking-tight text-[#f5e9ec] sm:text-6xl">
            Whatever the occasion,
            <br />
            make it yours.
          </h2>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "Weddings",
              "Engagements",
              "Birthdays",
              "Corporate Events",
              "Private Parties",
              "Family Functions",
            ].map((event) => (
              <button
                key={event}
                onClick={() => sendVenueEnquiry(event)}
                className="group rounded-2xl border border-[#d99aaa]/15 bg-white/[0.035] p-7 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-[#d99aaa]/40 hover:bg-[#8b2942]/15"
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="text-lg font-medium text-[#f5e9ec]">
                    {event}
                  </p>

                  <span className="text-[#d99aaa] transition group-hover:translate-x-1">
                    →
                  </span>
                </div>

                <p className="mt-3 text-sm text-[#b99da7]">
                  Enquire about your event
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-28">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-[#d99aaa]/25 bg-gradient-to-br from-[#30151f] via-[#1c0d13] to-[#12090d] shadow-[0_24px_80px_rgba(0,0,0,0.3)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(182,92,115,0.2),transparent_48%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(84,22,41,0.25),transparent_50%)]" />

          <div className="relative px-8 py-16 text-center sm:px-16 sm:py-20">
            <p className={sectionLabel}>Plan your event</p>

            <h2 className="mt-5 font-[Georgia,serif] text-4xl font-semibold leading-tight text-[#fff5f7] sm:text-6xl">
              Let's make it memorable.
            </h2>

            <p className="mx-auto mt-6 max-w-xl leading-7 text-[#c6aeb5]">
              Tell us your occasion, preferred date and guest count.
              We'll help you explore the right space for your gathering.
            </p>

            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                onClick={() => sendVenueEnquiry("event venue")}
                className={primaryButton}
              >
                WhatsApp Us
              </button>

              <a
                href="tel:+918884448148"
                className={glassButton}
              >
                Call Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#d99aaa]/15 px-6 py-10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-sm text-[#b99da7] sm:flex-row">
          <p className="tracking-[0.2em] text-[#d99aaa]">
            MYSORE SOCIALS
          </p>

          <p>© 2026 Mysore Socials</p>
        </div>
      </footer>
    </main>
  );
}

