"use client";

import Link from "next/link";

const GOLD = "#bfa46f";
const GOLD_LIGHT = "#d6c08a";

const dishes = [
  {
    name: "Paneer Shashlik Sizzler",
    price: "₹319",
    image:
      "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=90",
  },
  {
    name: "Chicken Steak Sizzler",
    price: "₹329",
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=90",
  },
  {
    name: "Veg Fried Rice",
    price: "₹159",
    image:
      "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=1000&q=90",
  },
];

const experiences = [
  {
    number: "01",
    title: "Good Food",
    text: "Sizzling favourites, Asian classics and comforting dishes made for long conversations around the table.",
  },
  {
    number: "02",
    title: "Good Company",
    text: "A place for catching up, celebrations, dates, family dinners and spontaneous evenings.",
  },
  {
    number: "03",
    title: "Good Moments",
    text: "Come for dinner. Stay a little longer. Make an ordinary evening feel worth remembering.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#050505] text-white">

      {/* NAVBAR */}
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-[#bfa46f]/20 bg-[#050505]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">

          <Link
            href="/"
            className="text-sm font-bold tracking-[0.28em] text-white"
          >
            MYSORE
            <span style={{ color: GOLD }}> SOCIALS</span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm md:flex">

            <Link
              href="/"
              className="font-medium transition hover:text-[#d6c08a]"
              style={{ color: GOLD }}
            >
              Home
            </Link>

            <a
              href="#experience"
              className="text-white/75 transition hover:text-[#d6c08a]"
            >
              Experience
            </a>

            <Link
              href="/menu"
              className="text-white/75 transition hover:text-[#d6c08a]"
            >
              Menu
            </Link>

            <Link
              href="/venue"
              className="text-white/75 transition hover:text-[#d6c08a]"
            >
              Venue
            </Link>

            <Link
              href="/contact"
              className="text-white/75 transition hover:text-[#d6c08a]"
            >
              Contact
            </Link>

            <Link
              href="/booking"
              className="rounded-full border px-5 py-2.5 font-medium transition hover:bg-[#bfa46f] hover:text-black"
              style={{
                borderColor: GOLD,
                color: GOLD,
              }}
            >
              Book a Table
            </Link>

          </nav>

          <Link
            href="/booking"
            className="rounded-full px-5 py-2.5 text-xs font-bold text-black transition hover:brightness-110"
            style={{ backgroundColor: GOLD }}
          >
            Book
          </Link>

        </div>
      </header>


      {/* HERO */}
      <section className="relative min-h-screen overflow-hidden">

        <div className="absolute inset-0">

          <img
            src="https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=2200&q=90"
            alt="Dining experience"
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-black/78" />

          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/45" />

          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/55" />

        </div>


        <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-end px-6 pb-20 pt-32 lg:px-10 lg:pb-28">

          <div className="max-w-5xl">

            <div className="flex items-center gap-4">

              <span
                className="h-px w-12"
                style={{ backgroundColor: GOLD }}
              />

              <p
                className="text-xs font-semibold uppercase tracking-[0.4em]"
                style={{ color: GOLD }}
              >
                Dining • Social • Celebrations
              </p>

            </div>


            <h1 className="mt-7 text-6xl font-light leading-[0.88] tracking-[-0.04em] text-white sm:text-7xl md:text-8xl lg:text-[9rem]">

              Good food.

              <br />

              <span
                className="font-normal"
                style={{ color: GOLD_LIGHT }}
              >
                Better moments.
              </span>

            </h1>


            <p className="mt-8 max-w-xl text-base leading-8 text-white/85 sm:text-lg">
              A place to eat, unwind and spend time with your people.
              Discover food, drinks and celebrations at Mysore Socials.
            </p>


            <div className="mt-9 flex flex-wrap gap-3">

              <Link
                href="/menu"
                className="rounded-full px-8 py-4 text-sm font-bold text-black shadow-[0_8px_35px_rgba(191,164,111,0.18)] transition duration-300 hover:scale-105 hover:brightness-110"
                style={{ backgroundColor: GOLD }}
              >
                Explore Menu
              </Link>

              <Link
                href="/booking"
                className="rounded-full border border-white/45 bg-black/65 px-8 py-4 text-sm font-medium text-white backdrop-blur-md transition duration-300 hover:border-[#bfa46f] hover:text-[#d6c08a]"
              >
                Book a Table
              </Link>

            </div>


            {/* HERO INFO */}
            <div className="mt-14 flex flex-wrap gap-x-12 gap-y-5 border-t border-white/25 pt-6">

              <div>
                <p
                  className="text-[10px] font-bold uppercase tracking-[0.3em]"
                  style={{ color: GOLD }}
                >
                  Experience
                </p>

                <p className="mt-2 text-sm text-white/85">
                  Dining & Social
                </p>
              </div>

              <div>
                <p
                  className="text-[10px] font-bold uppercase tracking-[0.3em]"
                  style={{ color: GOLD }}
                >
                  Location
                </p>

                <p className="mt-2 text-sm text-white/85">
                  Mysuru, Karnataka
                </p>
              </div>

              <div>
                <p
                  className="text-[10px] font-bold uppercase tracking-[0.3em]"
                  style={{ color: GOLD }}
                >
                  Events
                </p>

                <p className="mt-2 text-sm text-white/85">
                  Private Celebrations
                </p>
              </div>

            </div>

          </div>

        </div>


        {/* SCROLL INDICATOR */}
        <a
          href="#experience"
          className="absolute bottom-8 right-6 z-10 hidden items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/65 md:flex"
        >
          Scroll

          <span
            className="h-px w-10"
            style={{ backgroundColor: GOLD }}
          />
        </a>

      </section>


      {/* INTRO */}
      <section className="border-b border-[#bfa46f]/20 bg-[#050505] px-6 py-28 sm:py-36">

        <div className="mx-auto max-w-7xl">

          <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-end">

            <div>

              <p
                className="text-xs font-bold uppercase tracking-[0.4em]"
                style={{ color: GOLD }}
              >
                The Socials Experience
              </p>

              <h2 className="mt-5 text-5xl font-light leading-[0.95] tracking-tight text-white sm:text-7xl">
                Come hungry.
                <br />
                Leave with
                <br />
                <span
                  className="font-normal"
                  style={{ color: GOLD_LIGHT }}
                >
                  memories.
                </span>
              </h2>

            </div>


            <div>

              <p className="max-w-2xl text-lg leading-8 text-white/72">
                Mysore Socials is designed around the simple things that make
                going out special — good food, comfortable spaces and people
                you actually want to spend time with.
              </p>

              <Link
                href="/menu"
                className="mt-8 inline-flex items-center gap-3 text-sm font-semibold transition hover:gap-5 hover:text-[#d6c08a]"
                style={{ color: GOLD }}
              >
                Discover the menu
                <span>→</span>
              </Link>

            </div>

          </div>

        </div>

      </section>


      {/* EXPERIENCE */}
      <section
        id="experience"
        className="border-y border-[#bfa46f]/20 bg-[#090909]"
      >

        <div className="mx-auto max-w-7xl px-6 py-28 lg:px-10">

          <div className="mb-14">

            <p
              className="text-xs font-bold uppercase tracking-[0.4em]"
              style={{ color: GOLD }}
            >
              Why Mysore Socials
            </p>

            <h2 className="mt-5 max-w-3xl text-4xl font-light tracking-tight text-white sm:text-6xl">
              It&apos;s not just
              <br />
              about what&apos;s on the plate.
            </h2>

          </div>


          <div className="grid gap-px overflow-hidden rounded-[2rem] border border-[#bfa46f]/25 bg-[#bfa46f]/15 md:grid-cols-3">

            {experiences.map((experience) => (

              <div
                key={experience.number}
                className="group bg-[#0c0c0c] p-8 transition duration-500 hover:bg-[#12110e] sm:p-10"
              >

                <div className="flex items-center justify-between">

                  <span
                    className="text-xs font-bold"
                    style={{ color: GOLD }}
                  >
                    {experience.number}
                  </span>

                  <span
                    className="transition group-hover:text-[#d6c08a]"
                    style={{ color: "rgba(191,164,111,0.4)" }}
                  >
                    ✦
                  </span>

                </div>

                <h3 className="mt-20 text-2xl font-semibold text-white">
                  {experience.title}
                </h3>

                <p className="mt-4 leading-7 text-white/62">
                  {experience.text}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>


      {/* SIGNATURE FOOD */}
      <section className="bg-[#050505] px-6 py-28 sm:py-36">

        <div className="mx-auto max-w-7xl">

          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">

            <div>

              <p
                className="text-xs font-bold uppercase tracking-[0.4em]"
                style={{ color: GOLD }}
              >
                From the menu
              </p>

              <h2 className="mt-5 text-5xl font-light tracking-tight text-white sm:text-6xl">
                Worth ordering.
              </h2>

            </div>

            <Link
              href="/menu"
              className="text-sm font-semibold transition hover:text-[#d6c08a]"
              style={{ color: GOLD }}
            >
              View full menu →
            </Link>

          </div>


          <div className="mt-14 grid gap-5 md:grid-cols-3">

            {dishes.map((dish, index) => (

              <article
                key={dish.name}
                className={`group overflow-hidden rounded-[2rem] border border-[#bfa46f]/22 bg-[#0a0a0a] shadow-[0_25px_70px_rgba(0,0,0,0.55)] ${
                  index === 1 ? "md:-translate-y-8" : ""
                }`}
              >

                <div className="relative h-[390px] overflow-hidden">

                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/30" />

                  <div className="absolute left-5 top-5">

                    <span
                      className="rounded-full border bg-black/85 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.25em] backdrop-blur-md"
                      style={{
                        borderColor: GOLD,
                        color: GOLD,
                      }}
                    >
                      Signature Pick
                    </span>

                  </div>

                </div>


                <div className="p-6">

                  <div className="flex items-start justify-between gap-4">

                    <h3 className="text-lg font-semibold leading-snug text-white">
                      {dish.name}
                    </h3>

                    <span
                      className="shrink-0 font-bold"
                      style={{ color: GOLD_LIGHT }}
                    >
                      {dish.price}
                    </span>

                  </div>

                  <Link
                    href={`/order?item=${encodeURIComponent(
                      dish.name
                    )}&price=${dish.price.replace("₹", "")}`}
                    className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-white/55 transition group-hover:text-[#bfa46f]"
                  >
                    Order this
                    <span>→</span>
                  </Link>

                </div>

              </article>

            ))}

          </div>

        </div>

      </section>


      {/* VENUE FEATURE */}
      <section className="relative overflow-hidden">

        <div className="relative h-[650px]">

          <img
            src="https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=2000&q=90"
            alt="Outdoor celebration space"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-black/78" />

          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-black/25" />

          <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-6 lg:px-10">

            <div className="max-w-2xl">

              <p
                className="text-xs font-bold uppercase tracking-[0.4em]"
                style={{ color: GOLD }}
              >
                More than dining
              </p>

              <h2 className="mt-5 text-5xl font-light leading-[0.95] text-white sm:text-7xl">
                Your celebration.
                <br />
                <span
                  className="font-normal"
                  style={{ color: GOLD_LIGHT }}
                >
                  Our space.
                </span>
              </h2>

              <p className="mt-7 max-w-xl leading-8 text-white/72">
                Planning something special? Explore our outdoor lawn and
                indoor event space for gatherings and celebrations.
              </p>

              <Link
                href="/venue"
                className="mt-9 inline-flex rounded-full px-7 py-4 text-sm font-bold text-black shadow-[0_8px_35px_rgba(191,164,111,0.2)] transition hover:scale-105 hover:brightness-110"
                style={{ backgroundColor: GOLD }}
              >
                Explore the Venue
              </Link>

            </div>

          </div>

        </div>

      </section>


      {/* FINAL CTA */}
      <section className="border-b border-[#bfa46f]/20 bg-[#050505] px-6 py-28 sm:py-36">

        <div className="mx-auto max-w-4xl text-center">

          <p
            className="text-xs font-bold uppercase tracking-[0.4em]"
            style={{ color: GOLD }}
          >
            Your table awaits
          </p>

          <h2 className="mt-6 text-5xl font-light leading-[0.95] tracking-tight text-white sm:text-7xl">
            Make tonight
            <br />
            a little better.
          </h2>

          <p className="mx-auto mt-7 max-w-xl leading-7 text-white/62">
            Dinner with friends. A date. A celebration. Or simply a night
            where you don&apos;t feel like cooking.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">

            <Link
              href="/booking"
              className="rounded-full px-8 py-4 text-sm font-bold text-black transition hover:scale-105 hover:brightness-110"
              style={{ backgroundColor: GOLD }}
            >
              Book a Table
            </Link>

            <Link
              href="/menu"
              className="rounded-full border border-white/40 px-8 py-4 text-sm font-medium text-white transition hover:border-[#bfa46f] hover:text-[#d6c08a]"
            >
              Browse the Menu
            </Link>

          </div>

        </div>

      </section>


      {/* FOOTER */}
      <footer className="border-t border-[#bfa46f]/20 bg-black px-6 py-12">

        <div className="mx-auto max-w-7xl">

          <div className="flex flex-col justify-between gap-10 md:flex-row">

            <div>

              <Link
                href="/"
                className="text-xl font-bold tracking-[0.2em] text-white"
              >
                MYSORE
                <span style={{ color: GOLD }}> SOCIALS</span>
              </Link>

              <p className="mt-4 max-w-sm text-sm leading-7 text-white/50">
                Dining, drinks, celebrations and good times in Mysuru.
              </p>

            </div>


            <div className="grid grid-cols-2 gap-x-16 gap-y-4 text-sm">

              <Link
                href="/menu"
                className="text-white/65 transition hover:text-[#bfa46f]"
              >
                Menu
              </Link>

              <Link
                href="/venue"
                className="text-white/65 transition hover:text-[#bfa46f]"
              >
                Venue
              </Link>

              <Link
                href="/booking"
                className="text-white/65 transition hover:text-[#bfa46f]"
              >
                Book a Table
              </Link>

              <Link
                href="/contact"
                className="text-white/65 transition hover:text-[#bfa46f]"
              >
                Contact
              </Link>

            </div>

          </div>


          <div className="mt-12 flex flex-col justify-between gap-3 border-t border-white/12 pt-6 text-xs text-white/35 sm:flex-row">

            <p>
              © {new Date().getFullYear()} Mysore Socials
            </p>

            <p>
              Mysuru, Karnataka
            </p>

          </div>

        </div>

      </footer>

    </main>
  );
}