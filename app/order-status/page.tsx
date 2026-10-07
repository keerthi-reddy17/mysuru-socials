"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/app/lib/supabase";

type OrderStatus =
  | "Received"
  | "Preparing"
  | "Ready"
  | "Completed";

const STATUS_STEPS: OrderStatus[] = [
  "Received",
  "Preparing",
  "Ready",
  "Completed",
];

export default function OrderStatusPage() {
  const searchParams = useSearchParams();

  const orderNumber = searchParams.get("order");
  const urlTableNumber = searchParams.get("table");

  const [status, setStatus] =
    useState<OrderStatus>("Received");

  const [actualTableNumber, setActualTableNumber] =
    useState(urlTableNumber || "");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadOrder() {
    if (!orderNumber) {
      setError("Order number is missing.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("orders")
      .select(`
        status,
        restaurant_tables (
          table_number
        )
      `)
      .eq("order_number", orderNumber)
      .single();

    if (error || !data) {
      console.error("Order loading error:", error);
      setError("Order not found.");
      setLoading(false);
      return;
    }

    setStatus(data.status as OrderStatus);

    const tableData = data.restaurant_tables as
      | { table_number: number }
      | { table_number: number }[]
      | null;

    if (Array.isArray(tableData)) {
      if (tableData[0]?.table_number) {
        setActualTableNumber(
          tableData[0].table_number.toString()
        );
      }
    } else if (tableData?.table_number) {
      setActualTableNumber(
        tableData.table_number.toString()
      );
    }

    setLoading(false);
  }

  useEffect(() => {
    loadOrder();
  }, [orderNumber]);

  useEffect(() => {
    if (!orderNumber) return;

    const channel = supabase
      .channel(`order-status-${orderNumber}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
        },
        (payload) => {
          const updatedOrder = payload.new as {
            order_number?: string;
            status?: OrderStatus;
          };

          if (
            updatedOrder.order_number === orderNumber &&
            updatedOrder.status
          ) {
            setStatus(updatedOrder.status);
          }
        }
      )
      .subscribe();

    const interval = setInterval(() => {
      loadOrder();
    }, 3000);

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, [orderNumber]);

  const currentIndex =
    STATUS_STEPS.indexOf(status);

  function goToBill() {
    if (!actualTableNumber) {
      alert("Table number is missing.");
      return;
    }

    window.location.href =
      `/bill?table=${encodeURIComponent(actualTableNumber)}`;
  }

  function orderMore() {
    if (!actualTableNumber) {
      alert("Table number is missing.");
      return;
    }

    window.location.href =
      `/order?table=${encodeURIComponent(actualTableNumber)}`;
  }

  return (
    <main className="status-page">
      <div className="glow glow-one" />
      <div className="glow glow-two" />

      <section className="status-card">

        <div className="brand">
          MYSURU SOCIALS
        </div>

        <div className="status-icon">
          {status === "Completed" ? "✓" : "🍽️"}
        </div>

        <p className="eyebrow">
          ORDER TRACKING
        </p>

        <h1>
          {status === "Completed"
            ? "Order Completed"
            : "Your order is on its way"}
        </h1>

        <p className="subtitle">
          {actualTableNumber
            ? `Table ${actualTableNumber}`
            : "Your table"}
        </p>

        {orderNumber && (
          <div className="order-number">
            {orderNumber}
          </div>
        )}

        {loading ? (
          <div className="loading">
            Loading order status...
          </div>
        ) : error ? (
          <div className="error">
            {error}
          </div>
        ) : (
          <>
            <div className="current-status">
              {status}
            </div>

            <div className="progress">
              {STATUS_STEPS.map(
                (step, index) => {
                  const completed =
                    index <= currentIndex;

                  const active =
                    index === currentIndex;

                  return (
                    <div
                      className="step-wrapper"
                      key={step}
                    >
                      <div
                        className={`step-dot ${
                          completed
                            ? "completed"
                            : ""
                        } ${
                          active
                            ? "active"
                            : ""
                        }`}
                      >
                        {completed
                          ? "✓"
                          : index + 1}
                      </div>

                      <span
                        className={
                          completed
                            ? "step-label active-label"
                            : "step-label"
                        }
                      >
                        {step}
                      </span>

                      {index <
                        STATUS_STEPS.length -
                          1 && (
                        <div
                          className={`step-line ${
                            index <
                            currentIndex
                              ? "line-active"
                              : ""
                          }`}
                        />
                      )}
                    </div>
                  );
                }
              )}
            </div>

            <div className="message">
              {status === "Received" &&
                "We've received your order. The kitchen will start preparing it shortly."}

              {status === "Preparing" &&
                "Your food is being freshly prepared in the kitchen."}

              {status === "Ready" &&
                "Your order is ready. Please enjoy your meal!"}

              {status === "Completed" &&
                "This order has been completed. Thank you for dining with us!"}
            </div>
          </>
        )}

        <div className="buttons">

          <button onClick={orderMore}>
            Order More
          </button>

          <button
            className="secondary"
            onClick={goToBill}
          >
            View Bill
          </button>

        </div>

      </section>

      <style jsx>{`

        * {
          box-sizing: border-box;
        }

        .status-page {
          min-height: 100vh;
          background: #08090c;
          color: #f5f5f5;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          position: relative;
          overflow: hidden;
          font-family: Arial, sans-serif;
        }

        .glow {
          position: absolute;
          width: 350px;
          height: 350px;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.18;
          pointer-events: none;
        }

        .glow-one {
          background: #7c3aed;
          top: -150px;
          left: -100px;
        }

        .glow-two {
          background: #06b6d4;
          bottom: -150px;
          right: -100px;
        }

        .status-card {
          width: 100%;
          max-width: 560px;
          background: rgba(17, 18, 23, 0.9);
          border: 1px solid
            rgba(255, 255, 255, 0.09);
          border-radius: 28px;
          padding: 32px 24px;
          position: relative;
          z-index: 2;
          box-shadow:
            0 30px 80px
            rgba(0, 0, 0, 0.4);
          text-align: center;
        }

        .brand {
          font-size: 12px;
          letter-spacing: 3px;
          font-weight: 700;
          opacity: 0.65;
          margin-bottom: 28px;
        }

        .status-icon {
          width: 72px;
          height: 72px;
          margin: 0 auto 20px;
          border-radius: 50%;
          background:
            rgba(124, 58, 237, 0.14);
          border:
            1px solid
            rgba(124, 58, 237, 0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
        }

        .eyebrow {
          font-size: 11px;
          letter-spacing: 2px;
          color: #a78bfa;
          font-weight: 700;
          margin: 0 0 8px;
        }

        h1 {
          font-size: 28px;
          margin: 0;
          line-height: 1.15;
        }

        .subtitle {
          margin: 10px 0 0;
          color: #9ca3af;
        }

        .order-number {
          display: inline-block;
          margin-top: 16px;
          padding: 8px 12px;
          border-radius: 10px;
          background:
            rgba(255, 255, 255, 0.05);
          color: #d1d5db;
          font-size: 12px;
          letter-spacing: 1px;
        }

        .current-status {
          margin: 28px auto;
          display: inline-block;
          padding: 9px 18px;
          border-radius: 999px;
          background:
            rgba(124, 58, 237, 0.14);
          color: #c4b5fd;
          font-weight: 700;
        }

        .progress {
          margin: 10px 0 30px;
          display: flex;
          justify-content: space-between;
          gap: 4px;
        }

        .step-wrapper {
          flex: 1;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .step-dot {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          border: 1px solid #3f4148;
          background: #15161b;
          color: #777;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 700;
          position: relative;
          z-index: 2;
        }

        .step-dot.completed {
          background: #7c3aed;
          border-color: #7c3aed;
          color: white;
        }

        .step-dot.active {
          box-shadow:
            0 0 0 6px
            rgba(124, 58, 237, 0.12);
        }

        .step-label {
          margin-top: 9px;
          font-size: 10px;
          color: #6b7280;
        }

        .active-label {
          color: #ddd6fe;
          font-weight: 700;
        }

        .step-line {
          position: absolute;
          height: 1px;
          background: #303139;
          top: 17px;
          left: 58%;
          width: 84%;
          z-index: 1;
        }

        .line-active {
          background: #7c3aed;
        }

        .message {
          background:
            rgba(255, 255, 255, 0.04);
          border-radius: 14px;
          padding: 16px;
          color: #a1a1aa;
          font-size: 13px;
          line-height: 1.6;
        }

        .loading {
          margin: 40px 0;
          color: #9ca3af;
        }

        .error {
          margin: 35px 0;
          padding: 16px;
          border-radius: 12px;
          background:
            rgba(239, 68, 68, 0.1);
          color: #fca5a5;
        }

        .buttons {
          display: flex;
          gap: 12px;
          margin-top: 24px;
        }

        button {
          flex: 1;
          border: none;
          border-radius: 14px;
          padding: 14px;
          background: #7c3aed;
          color: white;
          font-weight: 700;
          cursor: pointer;
          transition:
            transform 0.2s ease;
        }

        button:hover {
          transform: translateY(-2px);
        }

        button.secondary {
          background:
            rgba(255, 255, 255, 0.07);
          border:
            1px solid
            rgba(255, 255, 255, 0.08);
        }

        @media (max-width: 480px) {

          .status-page {
            padding: 14px;
          }

          .status-card {
            padding: 28px 16px;
            border-radius: 22px;
          }

          h1 {
            font-size: 24px;
          }

          .step-label {
            font-size: 8px;
          }

          .step-dot {
            width: 30px;
            height: 30px;
          }

          .step-line {
            top: 15px;
          }
        }

      `}</style>
    </main>
  );
}


