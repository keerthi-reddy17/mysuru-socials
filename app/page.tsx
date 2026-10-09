
"use client";

import Link from "next/link";

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
    <main className="min-h-screen overflow-x-hidden bg-[#10090C] text-[#F5E9EC]">

      {/* NAVBAR */}
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-[#8B2942]/40 bg-black/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">

          <Link
            href="/"
            className="text-sm font-bold tracking-[0.28em] text-white"
          >
            MYSORE
            <span className="text-[#8B2942]"> SOCIALS</span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm md:flex">

            <Link
              href="/"
              className="font-medium text-[#8B2942] transition hover:text-[#B65C73]"
            >
              Home
            </Link>

            <a
              href="#experience"
              className="text-white/75 transition hover:text-[#8B2942]"
            >
              Experience
            </a>

            <Link
              href="/menu"
              className="text-white/75 transition hover:text-[#8B2942]"
            >
              Menu
            </Link>

            <Link
              href="/venue"
              className="text-white/75 transition hover:text-[#8B2942]"
            >
              Venue
            </Link>

            <Link
              href="/contact"
              className="text-white/75 transition hover:text-[#8B2942]"
            >
              Contact
            </Link>

            <Link
              href="/kitchen"
              className="text-white/75 transition hover:text-[#8B2942]"
            >
              Kitchen
            </Link>

            <Link
              href="/booking"
              className="rounded-full border border-[#8B2942]/70 bg-white/[0.04] px-5 py-2.5 font-medium text-[#D99AAA] backdrop-blur-xl transition hover:bg-[#8B2942]/20 hover:text-white"
            >
              Book a Table
            </Link>

          </nav>

          <Link
            href="/booking"
            className="rounded-full border border-white/25 bg-[#8B2942]/50 px-5 py-2.5 text-xs font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_6px_24px_rgba(80,20,40,0.2)] backdrop-blur-xl transition hover:bg-[#B65C73]/60"
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

          <div className="absolute inset-0 bg-black/75" />

          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/40" />

          <div className="absolute inset-0 bg-gradient-to-t from-[#10090C] via-black/20 to-black/50" />

        </div>

        <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-end px-6 pb-20 pt-32 lg:px-10 lg:pb-28">

          <div className="max-w-5xl">

            <div className="flex items-center gap-4">

              <span className="h-px w-12 bg-[#8B2942]" />

              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#D99AAA]">
                Dining • Social • Celebrations
              </p>

            </div>

            <h1 className="mt-7 font-serif text-6xl font-light leading-[0.88] tracking-[-0.04em] text-white sm:text-7xl md:text-8xl lg:text-[9rem]">

              Good food.

              <br />

              <span className="font-serif font-normal text-[#D99AAA]">
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
                className="rounded-full border border-white/25 bg-[#8B2942]/65 px-8 py-4 text-sm font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_8px_35px_rgba(139,41,66,0.3)] backdrop-blur-xl transition duration-300 hover:scale-105 hover:bg-[#B65C73]/75"
              >
                Explore Menu
              </Link>

              <Link
                href="/booking"
                className="rounded-full border border-white/35 bg-white/[0.08] px-8 py-4 text-sm font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] backdrop-blur-xl transition duration-300 hover:border-[#D99AAA] hover:bg-white/[0.14] hover:text-[#F5DCE2]"
              >
                Book a Table
              </Link>

            </div>

            <div className="mt-14 flex flex-wrap gap-x-12 gap-y-5 border-t border-white/30 pt-6">

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#D99AAA]">
                  Experience
                </p>

                <p className="mt-2 text-sm text-white/85">
                  Dining & Social
                </p>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#D99AAA]">
                  Location
                </p>

                <p className="mt-2 text-sm text-white/85">
                  Mysuru, Karnataka
                </p>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#D99AAA]">
                  Events
                </p>

                <p className="mt-2 text-sm text-white/85">
                  Private Celebrations
                </p>
              </div>

            </div>

          </div>

        </div>

        <a
          href="#experience"
          className="absolute bottom-8 right-6 z-10 hidden items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/70 md:flex"
        >
          Scroll
          <span className="h-px w-10 bg-[#8B2942]" />
        </a>

      </section>

      {/* INTRO */}
      <section className="border-b border-[#8B2942]/30 bg-[#10090C] px-6 py-28 sm:py-36">

        <div className="mx-auto max-w-7xl">

          <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-end">

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.4em] text-[#D99AAA]">
                The Socials Experience
              </p>

              <h2 className="mt-5 font-serif text-5xl font-light leading-[0.95] tracking-tight text-white sm:text-7xl">
                Come hungry.
                <br />
                Leave with
                <br />
                <span className="font-serif font-normal text-[#D99AAA]">
                  memories.
                </span>
              </h2>

            </div>

            <div>

              <p className="max-w-2xl text-lg leading-8 text-white/75">
                Mysore Socials is designed around the simple things that make
                going out special — good food, comfortable spaces and people
                you actually want to spend time with.
              </p>

              <Link
                href="/menu"
                className="mt-8 inline-flex items-center gap-3 text-sm font-semibold text-[#D99AAA] transition hover:gap-5 hover:text-[#B65C73]"
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
        className="border-y border-[#8B2942]/35 bg-[#160D11]"
      >

        <div className="mx-auto max-w-7xl px-6 py-28 lg:px-10">

          <div className="mb-14">

            <p className="text-xs font-bold uppercase tracking-[0.4em] text-[#D99AAA]">
              Why Mysore Socials
            </p>

            <h2 className="mt-5 max-w-3xl font-serif text-4xl font-light tracking-tight text-white sm:text-6xl">
              It&apos;s not just
              <br />
              about what&apos;s on the plate.
            </h2>

          </div>

          <div className="grid gap-px overflow-hidden rounded-[2rem] border border-[#8B2942]/40 bg-[#8B2942]/25 md:grid-cols-3">

            {experiences.map((experience) => (

              <div
                key={experience.number}
                className="group bg-[#1B1015] p-8 transition duration-500 hover:bg-[#29131C] sm:p-10"
              >

                <div className="flex items-center justify-between">

                  <span className="text-xs font-bold text-[#D99AAA]">
                    {experience.number}
                  </span>

                  <span className="text-[#8B2942]/60 transition group-hover:text-[#D99AAA]">
                    ✦
                  </span>

                </div>

                <h3 className="mt-20 font-serif text-2xl font-semibold text-white">
                  {experience.title}
                </h3>

                <p className="mt-4 leading-7 text-white/65">
                  {experience.text}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* SIGNATURE FOOD */}
      <section className="bg-[#10090C] px-6 py-28 sm:py-36">

        <div className="mx-auto max-w-7xl">

          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.4em] text-[#D99AAA]">
                From the menu
              </p>

              <h2 className="mt-5 font-serif text-5xl font-light tracking-tight text-white sm:text-6xl">
                Worth ordering.
              </h2>

            </div>

            <Link
              href="/menu"
              className="text-sm font-semibold text-[#D99AAA] transition hover:text-[#B65C73]"
            >
              View full menu →
            </Link>

          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-3">

            {dishes.map((dish, index) => (

              <article
                key={dish.name}
                className={`group overflow-hidden rounded-[2rem] border border-[#8B2942]/35 bg-[#170D11] shadow-[0_25px_70px_rgba(0,0,0,0.5)] ${
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

                    <span className="rounded-full border border-[#8B2942]/80 bg-black/80 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.25em] text-[#D99AAA] backdrop-blur-md">
                      Signature Pick
                    </span>

                  </div>

                </div>

                <div className="p-6">

                  <div className="flex items-start justify-between gap-4">

                    <h3 className="font-serif text-lg font-semibold leading-snug text-white">
                      {dish.name}
                    </h3>

                    <span className="shrink-0 font-bold text-[#D99AAA]">
                      {dish.price}
                    </span>

                  </div>

                  <Link
                    href={`/order?item=${encodeURIComponent(
                      dish.name
                    )}&price=${dish.price.replace("₹", "")}`}
                    className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-white/55 transition group-hover:text-[#D99AAA]"
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

          <div className="absolute inset-0 bg-black/75" />

          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/65 to-black/20" />

          <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-6 lg:px-10">

            <div className="max-w-2xl">

              <p className="text-xs font-bold uppercase tracking-[0.4em] text-[#D99AAA]">
                More than dining
              </p>

              <h2 className="mt-5 font-serif text-5xl font-light leading-[0.95] text-white sm:text-7xl">
                Your celebration.
                <br />
                <span className="font-serif font-normal text-[#D99AAA]">
                  Our space.
                </span>
              </h2>

              <p className="mt-7 max-w-xl leading-8 text-white/75">
                Planning something special? Explore our outdoor lawn and
                indoor event space for gatherings and celebrations.
              </p>

              <Link
                href="/venue"
                className="mt-9 inline-flex rounded-full border border-white/25 bg-[#8B2942]/65 px-7 py-4 text-sm font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_8px_35px_rgba(139,41,66,0.3)] backdrop-blur-xl transition hover:scale-105 hover:bg-[#B65C73]/75"
              >
                Explore the Venue
              </Link>

            </div>

          </div>

        </div>

      </section>

      {/* FINAL CTA */}
      <section className="border-b border-[#8B2942]/30 bg-[#10090C] px-6 py-28 sm:py-36">

        <div className="mx-auto max-w-4xl text-center">

          <p className="text-xs font-bold uppercase tracking-[0.4em] text-[#D99AAA]">
            Your table awaits
          </p>

          <h2 className="mt-6 font-serif text-5xl font-light leading-[0.95] tracking-tight text-white sm:text-7xl">
            Make tonight
            <br />
            a little better.
          </h2>

          <p className="mx-auto mt-7 max-w-xl leading-7 text-white/65">
            Dinner with friends. A date. A celebration. Or simply a night
            where you don&apos;t feel like cooking.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">

            <Link
              href="/booking"
              className="rounded-full border border-white/25 bg-[#8B2942]/65 px-8 py-4 text-sm font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_8px_35px_rgba(139,41,66,0.3)] backdrop-blur-xl transition hover:scale-105 hover:bg-[#B65C73]/75"
            >
              Book a Table
            </Link>

            <Link
              href="/menu"
              className="rounded-full border border-white/35 bg-white/[0.08] px-8 py-4 text-sm font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] backdrop-blur-xl transition hover:border-[#D99AAA] hover:bg-white/[0.14] hover:text-[#F5DCE2]"
            >
              Browse the Menu
            </Link>

          </div>

        </div>

      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#8B2942]/30 bg-black px-6 py-12">

        <div className="mx-auto max-w-7xl">

          <div className="flex flex-col justify-between gap-10 md:flex-row">

            <div>

              <Link
                href="/"
                className="text-xl font-bold tracking-[0.2em] text-white"
              >
                MYSORE
                <span className="text-[#8B2942]"> SOCIALS</span>
              </Link>

              <p className="mt-4 max-w-sm text-sm leading-7 text-white/55">
                Dining, drinks, celebrations and good times in Mysuru.
              </p>

            </div>

            <div className="grid grid-cols-2 gap-x-16 gap-y-4 text-sm">

              <Link
                href="/menu"
                className="text-white/65 transition hover:text-[#D99AAA]"
              >
                Menu
              </Link>

              <Link
                href="/venue"
                className="text-white/65 transition hover:text-[#D99AAA]"
              >
                Venue
              </Link>

              <Link
                href="/booking"
                className="text-white/65 transition hover:text-[#D99AAA]"
              >
                Book a Table
              </Link>

              <Link
                href="/contact"
                className="text-white/65 transition hover:text-[#D99AAA]"
              >
                Contact
              </Link>

            </div>

          </div>

          <div className="mt-12 flex flex-col justify-between gap-3 border-t border-white/15 pt-6 text-xs text-white/40 sm:flex-row">

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

