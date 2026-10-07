"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

const tables = Array.from({ length: 10 }, (_, index) => index + 1);

export default function QRPage() {
  const [baseUrl, setBaseUrl] = useState("");

  useEffect(() => {
    setBaseUrl(window.location.origin);
  }, []);

  if (!baseUrl) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#11100e",
          color: "#f5efe5",
          fontFamily: "Arial, sans-serif",
        }}
      >
        Loading QR codes...
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#11100e",
        color: "#f5efe5",
        padding: "40px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            fontSize: "42px",
            marginBottom: "10px",
          }}
        >
          Mysuru Socials
        </h1>

        <p
          style={{
            color: "#aaa",
            marginBottom: "40px",
          }}
        >
          Table QR Codes
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "24px",
          }}
        >
          {tables.map((tableNumber) => {
            const qrUrl = `${baseUrl}/order?table=${tableNumber}`;

            return (
              <div
                key={tableNumber}
                style={{
                  background: "#f5efe5",
                  color: "#11100e",
                  borderRadius: "20px",
                  padding: "24px",
                  textAlign: "center",
                }}
              >
                <h2
                  style={{
                    fontSize: "24px",
                    marginBottom: "20px",
                  }}
                >
                  Table {tableNumber}
                </h2>

                <div
                  style={{
                    background: "white",
                    padding: "15px",
                    borderRadius: "12px",
                    display: "inline-block",
                  }}
                >
                  <QRCodeSVG
                    value={qrUrl}
                    size={160}
                    level="H"
                  />
                </div>

                <p
                  style={{
                    marginTop: "15px",
                    fontSize: "13px",
                    wordBreak: "break-all",
                    opacity: 0.7,
                  }}
                >
                  {qrUrl}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}