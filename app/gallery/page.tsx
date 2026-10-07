export default function GalleryPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#11100e",
        color: "#f5efe5",
        padding: "80px 24px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <p
          style={{
            color: "#c9a878",
            letterSpacing: "4px",
            fontSize: "12px",
            marginBottom: "16px",
          }}
        >
          MYSURU SOCIALS
        </p>

        <h1
          style={{
            fontSize: "clamp(42px, 7vw, 82px)",
            fontWeight: 500,
            margin: 0,
          }}
        >
          Gallery
        </h1>

        <p
          style={{
            maxWidth: "600px",
            margin: "24px auto 0",
            color: "rgba(245, 239, 229, 0.65)",
            lineHeight: 1.7,
            fontSize: "16px",
          }}
        >
          A glimpse into the food, atmosphere, and moments at Mysuru Socials.
        </p>

        <div
          style={{
            marginTop: "60px",
            padding: "80px 24px",
            border: "1px solid rgba(201, 168, 120, 0.2)",
            borderRadius: "24px",
            background: "rgba(255, 255, 255, 0.02)",
          }}
        >
          <p
            style={{
              color: "#c9a878",
              fontSize: "14px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            More moments coming soon
          </p>
        </div>
      </div>
    </main>
  );
}