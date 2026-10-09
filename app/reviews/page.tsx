
export default function ReviewsPage() {
  const reviews = [
    {
      name: "Guest Review",
      rating: 5,
      text: "A lovely place to spend time with friends and family. The ambience and food make it a great choice for a relaxed evening.",
    },
    {
      name: "Guest Review",
      rating: 5,
      text: "Good ambience, spacious setting and a nice selection of food. The outdoor area is especially pleasant.",
    },
    {
      name: "Guest Review",
      rating: 4,
      text: "A comfortable place for gatherings with good food and a welcoming atmosphere.",
    },
    {
      name: "Guest Review",
      rating: 5,
      text: "The setting is beautiful and works really well for spending time with a group.",
    },
  ];

  return (
    <main className="min-h-screen overflow-hidden bg-[#10090c] font-[Arial,sans-serif] text-[#f5e9ec]">

      {/* HEADER */}
      <section className="relative px-6 pb-16 pt-36">
        <div className="pointer-events-none absolute right-0 top-20 h-80 w-80 rounded-full bg-[#8b2942]/10 blur-[100px]" />

        <div className="relative mx-auto max-w-6xl">
          <a
            href="/"
            className="inline-flex rounded-full border border-[#d99aaa]/20 bg-white/[0.04] px-4 py-2 text-sm text-[#d0b8c0] backdrop-blur-xl transition hover:border-[#d99aaa]/50 hover:bg-[#8b2942]/20 hover:text-[#f5e9ec]"
          >
            ← Back to Home
          </a>

          <div className="mt-12 max-w-4xl">
            <p className="text-xs uppercase tracking-[0.35em] text-[#d99aaa]">
              Guest Reviews
            </p>

            <h1 className="mt-5 font-[Georgia,serif] text-5xl font-semibold leading-[1.05] tracking-tight text-[#f5e9ec] sm:text-7xl">
              Good food.
              <br />
              <span className="text-[#b65c73]">Good words.</span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-8 text-[#c6aeb5] sm:text-lg">
              See what guests have to say about their experience at
              Mysore Socials.
            </p>
          </div>
        </div>
      </section>

      {/* RATING */}
      <section className="px-6 pb-20">
        <div className="mx-auto max-w-6xl">
          <div className="relative overflow-hidden rounded-[2rem] border border-[#d99aaa]/20 bg-gradient-to-br from-[#321721]/90 via-[#211017]/90 to-[#160b10]/95 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.2)] backdrop-blur-2xl sm:p-10">
            <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[#8b2942]/20 blur-[80px]" />

            <div className="relative flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-[#b99da7]">
                  Overall Experience
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-4">
                  <span className="font-[Georgia,serif] text-6xl font-semibold text-[#fff5f7]">
                    4.1
                  </span>

                  <div>
                    <div
                      className="text-xl tracking-widest text-[#d99aaa]"
                      aria-label="Five stars displayed"
                    >
                      ★★★★★
                    </div>

                    <p className="mt-1 text-sm text-[#b99da7]">
                      Based on publicly listed reviews
                    </p>
                  </div>
                </div>
              </div>

              <div className="max-w-sm text-sm leading-7 text-[#c6aeb5]">
                From casual meals to celebrations and gatherings, guests
                come for the food, atmosphere and setting.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.3em] text-[#d99aaa]">
              Words from our guests
            </p>

            <h2 className="mt-4 font-[Georgia,serif] text-3xl font-semibold text-[#f5e9ec] sm:text-4xl">
              Moments worth sharing.
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {reviews.map((review, index) => (
              <article
                key={index}
                className="group rounded-[2rem] border border-[#d99aaa]/15 bg-white/[0.035] p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_12px_35px_rgba(0,0,0,0.12)] backdrop-blur-2xl transition duration-300 hover:-translate-y-1 hover:border-[#d99aaa]/40 hover:bg-[#8b2942]/10 sm:p-8"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d99aaa]/25 bg-[#8b2942]/25 font-[Georgia,serif] text-lg text-[#e5a8b8]">
                      G
                    </div>

                    <span className="text-sm text-[#d0b8c0]">
                      {review.name}
                    </span>
                  </div>

                  <span
                    className="text-sm tracking-widest text-[#d99aaa]"
                    aria-label={`${review.rating} out of 5 stars`}
                  >
                    {"★".repeat(review.rating)}
                  </span>
                </div>

                <p className="mt-6 text-lg leading-8 text-[#e5d7dc]">
                  “{review.text}”
                </p>

                <div className="mt-6 h-px w-12 bg-[#8b2942]/80 transition-all duration-300 group-hover:w-20 group-hover:bg-[#d99aaa]" />
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEW CTA */}
      <section className="border-t border-[#d99aaa]/15 bg-gradient-to-b from-[#1c0d13]/60 to-transparent px-6 py-24">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-[#d99aaa]">
            Your experience matters
          </p>

          <h2 className="mt-5 font-[Georgia,serif] text-4xl font-semibold leading-tight text-[#f5e9ec] sm:text-5xl">
            Been here before?
          </h2>

          <p className="mx-auto mt-5 max-w-xl leading-7 text-[#c6aeb5]">
            We’d love to hear about your experience at Mysore Socials.
          </p>

          <a
            href="/contact"
            className="mt-8 inline-flex items-center justify-center rounded-full border border-[#d99aaa]/40 bg-gradient-to-br from-[#a6425d]/90 to-[#6e2037]/90 px-8 py-4 font-medium text-[#fff5f7] shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_8px_28px_rgba(82,18,39,0.3)] backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:from-[#b6506b] hover:to-[#812943]"
          >
            Share Your Experience →
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#d99aaa]/15 px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-4 text-sm text-[#b99da7] sm:flex-row">
          <p className="tracking-[0.2em] text-[#d99aaa]">
            MYSORE SOCIALS
          </p>

          <p>© 2026 Mysore Socials</p>
        </div>
      </footer>
    </main>
  );
}

