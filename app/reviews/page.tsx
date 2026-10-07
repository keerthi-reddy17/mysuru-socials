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
    <main className="min-h-screen bg-[#11100e] text-[#f5efe5]">

      {/* Header */}
      <section className="px-6 pb-16 pt-36">
        <div className="mx-auto max-w-6xl">

          <a
            href="/"
            className="text-sm text-white/50 transition hover:text-[#c9a878]"
          >
            ← Back to Home
          </a>

          <div className="mt-12 max-w-4xl">
            <p className="text-sm uppercase tracking-[0.35em] text-[#c9a878]">
              Guest Reviews
            </p>

            <h1 className="mt-5 text-5xl font-semibold tracking-tight sm:text-7xl">
              Good food.
              <br />
              Good words.
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-8 text-white/50 sm:text-lg">
              See what guests have to say about their experience at
              Mysore Socials.
            </p>
          </div>

        </div>
      </section>

      {/* Rating */}
      <section className="px-6 pb-20">
        <div className="mx-auto max-w-6xl">

          <div className="rounded-[2rem] border border-white/10 bg-[#171512] p-8 sm:p-10">

            <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-white/30">
                  Overall Experience
                </p>

                <div className="mt-3 flex items-center gap-4">
                  <span className="text-6xl font-semibold">
                    4.1
                  </span>

                  <div>
                    <div className="text-xl tracking-widest text-[#c9a878]">
                      ★★★★★
                    </div>

                    <p className="mt-1 text-sm text-white/40">
                      Based on publicly listed reviews
                    </p>
                  </div>
                </div>
              </div>

              <div className="max-w-sm text-sm leading-7 text-white/50">
                From casual meals to celebrations and gatherings, guests
                come for the food, atmosphere and setting.
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Reviews */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-6xl">

          <div className="grid gap-5 md:grid-cols-2">

            {reviews.map((review, index) => (
              <div
                key={index}
                className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-7 transition duration-300 hover:-translate-y-1 hover:border-[#c9a878]/30 sm:p-8"
              >

                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/50">
                    {review.name}
                  </span>

                  <span className="text-sm tracking-widest text-[#c9a878]">
                    {"★".repeat(review.rating)}
                  </span>
                </div>

                <p className="mt-6 text-lg leading-8 text-white/70">
                  “{review.text}”
                </p>

              </div>
            ))}

          </div>

        </div>
      </section>

      {/* Review CTA */}
      <section className="border-t border-white/10 px-6 py-24">
        <div className="mx-auto max-w-4xl text-center">

          <p className="text-sm uppercase tracking-[0.3em] text-[#c9a878]">
            Your experience matters
          </p>

          <h2 className="mt-5 text-4xl font-semibold sm:text-5xl">
            Been here before?
          </h2>

          <p className="mx-auto mt-5 max-w-xl leading-7 text-white/50">
            We’d love to hear about your experience at Mysore Socials.
          </p>

          <a
            href="/contact"
            className="mt-8 inline-block rounded-full bg-[#c9a878] px-8 py-4 font-medium text-[#11100e] transition duration-300 hover:scale-[1.02] hover:bg-[#d8bb91]"
          >
            Share Your Experience
          </a>

        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-4 text-sm text-white/40 sm:flex-row">
          <p>MYSORE SOCIALS</p>
          <p>© 2026 Mysore Socials</p>
        </div>
      </footer>

    </main>
  );
}