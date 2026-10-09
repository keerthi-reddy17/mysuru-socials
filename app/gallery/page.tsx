export default function GalleryPage() {
return ( <main className="min-h-screen bg-[#10090c] px-6 py-20 text-[#f5e9ec]"> <div className="mx-auto flex min-h-[70vh] max-w-5xl flex-col items-center justify-center text-center"> <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-[#b65c73]/40 bg-[#541629]/40 shadow-lg shadow-[#8b2942]/10"> <svg
         xmlns="http://www.w3.org/2000/svg"
         width="38"
         height="38"
         viewBox="0 0 24 24"
         fill="none"
         stroke="#d99aaa"
         strokeWidth="1.5"
         strokeLinecap="round"
         strokeLinejoin="round"
         aria-hidden="true"
       > <rect x="3" y="3" width="18" height="18" rx="3" /> <circle cx="8.5" cy="8.5" r="1.5" /> <path d="m21 15-5-5L5 21" /> </svg> </div>

```
    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-[#d99aaa]">
      Mysore Socials
    </p>

    <h1 className="mb-5 font-[Georgia,serif] text-5xl font-normal tracking-tight sm:text-7xl">
      Gallery
    </h1>

    <div className="mb-7 h-px w-20 bg-gradient-to-r from-transparent via-[#b65c73] to-transparent" />

    <p className="max-w-2xl text-base leading-8 text-[#c6aeb5] sm:text-lg">
      Every gathering has a story, every celebration a memory.
      Discover the atmosphere, the moments, and the experiences
      that make Mysore Socials special.
    </p>

    <div className="mt-12 w-full max-w-xl rounded-2xl border border-[#b65c73]/25 bg-white/[0.04] p-8 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-12">
      <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-[#b65c73]/30 bg-[#541629]/40">
        <span className="text-xl text-[#d99aaa]">✦</span>
      </div>

      <h2 className="mb-3 font-[Georgia,serif] text-2xl text-[#f5e9ec] sm:text-3xl">
        More moments coming soon
      </h2>

      <p className="text-sm leading-7 text-[#c6aeb5]">
        We are getting our favourite moments ready to share with you.
        Check back soon for a glimpse of celebrations at Mysore Socials.
      </p>
    </div>

    <p className="mt-12 text-xs uppercase tracking-[0.25em] text-[#a78b94]">
      Good food · Great company · Beautiful memories
    </p>
  </div>
</main>


);
}
