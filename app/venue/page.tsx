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

export default function VenuePage() {
  return (
    <main className="min-h-screen bg-[#0b0b0a] text-[#f5efe5]">

      {/* HERO */}
      <section className="relative min-h-[85vh] overflow-hidden">

        <img
          src={venueImages.hero}
          alt="Mysore Socials event space"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0a] via-black/10 to-black/30" />

        <div className="relative z-10 mx-auto flex min-h-[85vh] max-w-7xl flex-col justify-end px-6 pb-20">

          <a
            href="/"
            className="mb-auto pt-32 text-sm text-white/60 transition hover:text-[#c9a878]"
          >
            ← Back to Home
          </a>

          <div className="max-w-4xl">

            <p className="text-xs uppercase tracking-[0.4em] text-[#c9a878]">
              Events • Celebrations • Gatherings
            </p>

            <h1 className="mt-5 text-5xl font-semibold leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl">
              Your moments.
              <br />
              <span className="text-[#c9a878]">Our space.</span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-8 text-white/65 sm:text-lg">
              Bring your celebrations, gatherings and special occasions to
              life at Mysore Socials.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">

              <button
                onClick={() => sendVenueEnquiry("event venue")}
                className="rounded-full bg-[#c9a878] px-7 py-4 text-sm font-medium text-[#11100e] transition duration-300 hover:scale-[1.03] hover:bg-[#d8bb91]"
              >
                Enquire Now
              </button>

              <a
                href="#spaces"
                className="rounded-full border border-white/20 bg-black/20 px-7 py-4 text-sm backdrop-blur-md transition hover:border-[#c9a878] hover:text-[#c9a878]"
              >
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
              <p className="text-xs uppercase tracking-[0.35em] text-[#c9a878]">
                The Venue
              </p>

              <h2 className="mt-5 text-4xl font-semibold tracking-tight sm:text-6xl">
                A space made
                <br />
                for moments.
              </h2>
            </div>

            <p className="max-w-2xl text-base leading-8 text-white/50 sm:text-lg">
              Whether it is a personal celebration, a private gathering or
              an evening with your people, Mysore Socials gives you a space
              where the atmosphere becomes part of the occasion.
            </p>

          </div>

        </div>
      </section>


      {/* VENUE SPACES */}
      <section id="spaces" className="px-6 pb-28">

        <div className="mx-auto max-w-7xl">

          <div className="mb-10">
            <p className="text-xs uppercase tracking-[0.35em] text-[#c9a878]">
              Choose your setting
            </p>

            <h2 className="mt-4 text-4xl font-semibold sm:text-5xl">
              Spaces for every kind of gathering.
            </h2>
          </div>


          <div className="grid gap-6 lg:grid-cols-2">

            {/* LAWN */}
            <article className="group overflow-hidden rounded-[2rem] border border-white/10 bg-[#141311]">

              <div className="relative h-[420px] overflow-hidden">

                <img
                  src={venueImages.lawn}
                  alt="Outdoor lawn event space"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                <div className="absolute bottom-8 left-8">

                  <p className="text-xs uppercase tracking-[0.3em] text-[#c9a878]">
                    Outdoor
                  </p>

                  <h3 className="mt-3 text-4xl font-semibold">
                    The Lawn
                  </h3>

                </div>
              </div>

              <div className="p-8">

                <p className="leading-7 text-white/50">
                  An open-air setting for celebrations, gatherings and relaxed
                  evenings surrounded by an inviting outdoor atmosphere.
                </p>

                <div className="mt-6 flex flex-wrap gap-2">

                  {[
                    "Celebrations",
                    "Private Events",
                    "Social Gatherings",
                  ].map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-white/10 px-4 py-2 text-xs text-white/55"
                    >
                      {item}
                    </span>
                  ))}

                </div>

                <button
                  onClick={() => sendVenueEnquiry("The Lawn")}
                  className="mt-8 rounded-full border border-[#c9a878]/40 px-6 py-3 text-sm text-[#c9a878] transition hover:bg-[#c9a878] hover:text-[#11100e]"
                >
                  Enquire for the Lawn →
                </button>

              </div>

            </article>


            {/* HALL */}
            <article className="group overflow-hidden rounded-[2rem] border border-white/10 bg-[#141311]">

              <div className="relative h-[420px] overflow-hidden">

                <img
                  src={venueImages.hall}
                  alt="Indoor event hall"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                <div className="absolute bottom-8 left-8">

                  <p className="text-xs uppercase tracking-[0.3em] text-[#c9a878]">
                    Indoor
                  </p>

                  <h3 className="mt-3 text-4xl font-semibold">
                    Party Hall
                  </h3>

                </div>

              </div>

              <div className="p-8">

                <p className="leading-7 text-white/50">
                  A comfortable indoor setting for private celebrations,
                  family occasions, social gatherings and special events.
                </p>

                <div className="mt-6 flex flex-wrap gap-2">

                  {[
                    "Private Events",
                    "Family Functions",
                    "Special Occasions",
                  ].map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-white/10 px-4 py-2 text-xs text-white/55"
                    >
                      {item}
                    </span>
                  ))}

                </div>

                <button
                  onClick={() => sendVenueEnquiry("Party Hall")}
                  className="mt-8 rounded-full border border-[#c9a878]/40 px-6 py-3 text-sm text-[#c9a878] transition hover:bg-[#c9a878] hover:text-[#11100e]"
                >
                  Enquire for the Hall →
                </button>

              </div>

            </article>

          </div>

        </div>
      </section>


      {/* VISUAL GALLERY */}
      <section className="border-y border-white/10 px-6 py-28">

        <div className="mx-auto max-w-7xl">

          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">

            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-[#c9a878]">
                The atmosphere
              </p>

              <h2 className="mt-4 text-4xl font-semibold sm:text-6xl">
                Come for the moment.
                <br />
                Stay for the memories.
              </h2>
            </div>

          </div>


          <div className="mt-12 grid gap-5 md:grid-cols-3">

            <div className="group relative h-[420px] overflow-hidden rounded-[1.8rem]">
              <img
                src={venueImages.celebration}
                alt="Celebration setup"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

              <p className="absolute bottom-6 left-6 text-lg font-medium">
                Celebrations
              </p>
            </div>


            <div className="group relative h-[420px] overflow-hidden rounded-[1.8rem]">
              <img
                src={venueImages.dinner}
                alt="Dining and gathering"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

              <p className="absolute bottom-6 left-6 text-lg font-medium">
                Gatherings
              </p>
            </div>


            <div className="group relative h-[420px] overflow-hidden rounded-[1.8rem]">
              <img
                src={venueImages.event}
                alt="Event atmosphere"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

              <p className="absolute bottom-6 left-6 text-lg font-medium">
                Special Moments
              </p>
            </div>

          </div>

        </div>
      </section>


      {/* EVENTS */}
      <section className="px-6 py-28">

        <div className="mx-auto max-w-7xl">

          <p className="text-xs uppercase tracking-[0.35em] text-[#c9a878]">
            Made for every occasion
          </p>

          <h2 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">
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
                className="group rounded-2xl border border-white/10 bg-white/[0.025] p-7 text-left transition duration-300 hover:-translate-y-1 hover:border-[#c9a878]/40 hover:bg-[#c9a878]/[0.05]"
              >
                <div className="flex items-center justify-between">

                  <p className="text-lg font-medium">
                    {event}
                  </p>

                  <span className="text-[#c9a878] transition group-hover:translate-x-1">
                    →
                  </span>

                </div>

                <p className="mt-3 text-sm text-white/35">
                  Enquire about your event
                </p>

              </button>
            ))}

          </div>

        </div>
      </section>


      {/* CTA */}
      <section className="px-6 pb-28">

        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-[#c9a878]/20 bg-[#171512]">

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,168,120,0.15),transparent_45%)]" />

          <div className="relative px-8 py-16 text-center sm:px-16 sm:py-20">

            <p className="text-xs uppercase tracking-[0.35em] text-[#c9a878]">
              Plan your event
            </p>

            <h2 className="mt-5 text-4xl font-semibold sm:text-6xl">
              Let's make it memorable.
            </h2>

            <p className="mx-auto mt-6 max-w-xl leading-7 text-white/45">
              Tell us your occasion, preferred date and guest count.
              We'll help you explore the right space for your gathering.
            </p>

            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">

              <button
                onClick={() => sendVenueEnquiry("event venue")}
                className="rounded-full bg-[#c9a878] px-8 py-4 font-medium text-[#11100e] transition hover:scale-[1.02] hover:bg-[#d8bb91]"
              >
                WhatsApp Us
              </button>

              <a
                href="tel:+918884448148"
                className="rounded-full border border-white/15 px-8 py-4 text-sm transition hover:border-[#c9a878] hover:text-[#c9a878]"
              >
                Call Us
              </a>

            </div>

          </div>

        </div>

      </section>


      {/* FOOTER */}
      <footer className="border-t border-white/10 px-6 py-10">

        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-sm text-white/35 sm:flex-row">

          <p className="tracking-[0.2em]">
            MYSORE SOCIALS
          </p>

          <p>
            © 2026 Mysore Socials
          </p>

        </div>

      </footer>

    </main>
  );
}