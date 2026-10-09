
"use client";

import {
  Suspense,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useSearchParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { supabase } from "../lib/supabase";

type OrderItem = {
  id: string;
  item_name: string;
  unit_price: number;
  quantity: number;
};

type Order = {
  id: string;
  order_number: string;
  status: string;
  payment_status: "Pending" | "Paid" | "Failed";
  created_at: string;
  order_items: OrderItem[];
};

type CombinedItem = {
  item_name: string;
  unit_price: number;
  quantity: number;
  total: number;
};

const RESTAURANT_UPI_ID = "restaurant@upi";
const RESTAURANT_NAME = "Mysuru Socials";
const WHATSAPP_NUMBER = "919999999999";

function BillContent() {
  const searchParams = useSearchParams();

  const [tableNumber, setTableNumber] = useState<number | null>(null);
  const [tableId, setTableId] = useState<number | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const [paying, setPaying] = useState(false);

  async function loadBill(
    currentTableNumber: number,
    currentSessionId: string
  ) {
    setLoading(true);
    setError("");

    try {
      const { data: table, error: tableError } = await supabase
        .from("restaurant_tables")
        .select("id, table_number")
        .eq("table_number", currentTableNumber)
        .single();

      if (tableError || !table) {
        console.error("TABLE ERROR:", tableError);
        setError("Table not found.");
        setLoading(false);
        return;
      }

      setTableId(table.id);

      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .select(`
          id,
          order_number,
          status,
          payment_status,
          created_at,
          order_items (
            id,
            item_name,
            unit_price,
            quantity
          )
        `)
        .eq("table_id", table.id)
        .eq("session_id", currentSessionId)
        .order("created_at", { ascending: true });

      if (orderError) {
        console.error("BILL ORDER ERROR:", orderError);
        setError("Could not load your bill.");
        setLoading(false);
        return;
      }

      setOrders((orderData ?? []) as Order[]);
      setLoading(false);
    } catch (err) {
      console.error("BILL LOAD ERROR:", err);
      setError("Something went wrong while loading the bill.");
      setLoading(false);
    }
  }

  useEffect(() => {
    const tableParam = searchParams.get("table");
    const orderParam = searchParams.get("order");

    if (!tableParam) {
      setError("Table number is missing.");
      setLoading(false);
      return;
    }

    const parsedTable = Number(tableParam);

    if (
      !Number.isInteger(parsedTable) ||
      parsedTable < 1 ||
      parsedTable > 10
    ) {
      setError("Invalid table number.");
      setLoading(false);
      return;
    }

    setTableNumber(parsedTable);

    const initializeBill = async () => {
      try {
        if (orderParam) {
          const {
            data: exactOrder,
            error: exactOrderError,
          } = await supabase
            .from("orders")
            .select(`
              id,
              order_number,
              table_id,
              session_id,
              status,
              payment_status,
              created_at,
              order_items (
                id,
                item_name,
                unit_price,
                quantity
              )
            `)
            .eq("id", orderParam)
            .single();

          if (exactOrderError || !exactOrder) {
            console.error("EXACT ORDER ERROR:", exactOrderError);
            setError(
              "Order not found. Please go back to the menu and try again."
            );
            setLoading(false);
            return;
          }

          const { data: table, error: tableError } = await supabase
            .from("restaurant_tables")
            .select("id, table_number")
            .eq("table_number", parsedTable)
            .single();

          if (
            tableError ||
            !table ||
            table.id !== exactOrder.table_id
          ) {
            setError("This order does not belong to this table.");
            setLoading(false);
            return;
          }

          setTableId(table.id);

          const exactSessionId = exactOrder.session_id;

          localStorage.setItem(
            "mysuru-socials-session-id",
            exactSessionId
          );

          setSessionId(exactSessionId);
          await loadBill(parsedTable, exactSessionId);
          return;
        }

        let currentSessionId = localStorage.getItem(
          "mysuru-socials-session-id"
        );

        if (!currentSessionId) {
          currentSessionId = crypto.randomUUID();

          localStorage.setItem(
            "mysuru-socials-session-id",
            currentSessionId
          );
        }

        setSessionId(currentSessionId);
        await loadBill(parsedTable, currentSessionId);
      } catch (err) {
        console.error("BILL INITIALIZATION ERROR:", err);
        setError("Something went wrong while loading your bill.");
        setLoading(false);
      }
    };

    initializeBill();
  }, [searchParams]);

  useEffect(() => {
    if (!sessionId || !tableNumber) return;

    const channel = supabase
      .channel(`bill-live-${sessionId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
        },
        () => {
          loadBill(tableNumber, sessionId);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "order_items",
        },
        () => {
          loadBill(tableNumber, sessionId);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId, tableNumber]);

  const combinedItems = useMemo<CombinedItem[]>(() => {
    const map = new Map<string, CombinedItem>();

    orders.forEach((order) => {
      order.order_items?.forEach((item) => {
        const existing = map.get(item.item_name);
        const price = Number(item.unit_price);

        if (existing) {
          existing.quantity += item.quantity;
          existing.total += price * item.quantity;
        } else {
          map.set(item.item_name, {
            item_name: item.item_name,
            unit_price: price,
            quantity: item.quantity,
            total: price * item.quantity,
          });
        }
      });
    });

    return Array.from(map.values());
  }, [orders]);

  const subtotal = useMemo(
    () => combinedItems.reduce((sum, item) => sum + item.total, 0),
    [combinedItems]
  );

  const totalQuantity = useMemo(
    () => combinedItems.reduce((sum, item) => sum + item.quantity, 0),
    [combinedItems]
  );

  const allPaid =
    orders.length > 0 &&
    orders.every((order) => order.payment_status === "Paid");

  function getUPIUrl() {
    return (
      `upi://pay?pa=${encodeURIComponent(RESTAURANT_UPI_ID)}` +
      `&pn=${encodeURIComponent(RESTAURANT_NAME)}` +
      `&am=${subtotal.toFixed(2)}` +
      `&cu=INR`
    );
  }

  function openUPIApp() {
    window.location.href = getUPIUrl();
  }

  async function makeDemoPayment() {
    if (!sessionId || subtotal <= 0 || paying) return;

    setPaying(true);

    try {
      const response = await fetch("/api/payment/demo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          amount: subtotal,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Payment failed.");
      }

      setShowPayment(false);

      if (tableNumber && sessionId) {
        await loadBill(tableNumber, sessionId);
      }

      alert("Demo payment successful! 🎉");
    } catch (err) {
      console.error("PAYMENT ERROR:", err);

      alert(
        err instanceof Error
          ? err.message
          : "Demo payment failed."
      );
    } finally {
      setPaying(false);
    }
  }

  function sendWhatsAppBill() {
    if (!tableNumber || combinedItems.length === 0) return;

    let message =
      `*${RESTAURANT_NAME}*\n` +
      `Table ${tableNumber}\n\n` +
      `*Your Bill*\n\n`;

    combinedItems.forEach((item) => {
      message +=
        `${item.item_name} × ${item.quantity} — ₹${item.total.toFixed(2)}\n`;
    });

    message +=
      `\nTotal Items: ${totalQuantity}` +
      `\n*Total: ₹${subtotal.toFixed(2)}*`;

    message += allPaid
      ? "\n\nPayment Status: PAID"
      : "\n\nPayment Status: PENDING";

    const whatsappUrl =
      `https://wa.me/${WHATSAPP_NUMBER}` +
      `?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, "_blank");
  }

  function orderMore() {
    if (!tableNumber) return;
    window.location.href = `/order?table=${tableNumber}`;
  }

  function finishDining() {
    if (!allPaid) {
      alert(
        "Please complete payment before finishing your dining session."
      );
      return;
    }

    const confirmed = window.confirm(
      "Payment is complete. Finish this dining session?"
    );

    if (!confirmed) return;

    localStorage.removeItem("mysuru-socials-session-id");
    window.location.href = "/";
  }

  if (loading) {
    return (
      <main className="loading-page">
        <div className="loading-spinner" />
        <p>Preparing your bill...</p>

        <style jsx>{`
          .loading-page {
            min-height: 100vh;
            background: #10090c;
            color: #f5e9ec;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 18px;
            font-family: Arial, Helvetica, sans-serif;
          }

          .loading-spinner {
            width: 44px;
            height: 44px;
            border: 3px solid rgba(217, 154, 170, 0.2);
            border-top-color: #b65c73;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }

          p {
            color: #c6aeb5;
            font-size: 13px;
          }

          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </main>
    );
  }

  if (error) {
    return (
      <main className="error-page">
        <div className="error-box">
          <div className="error-icon">!</div>
          <h1>Something went wrong</h1>
          <p>{error}</p>

          <button
            onClick={() =>
              (window.location.href = tableNumber
                ? `/order?table=${tableNumber}`
                : "/")
            }
          >
            Back to Menu
          </button>
        </div>

        <style jsx>{`
          .error-page {
            min-height: 100vh;
            background: #10090c;
            color: #f5e9ec;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            font-family: Arial, Helvetica, sans-serif;
          }

          .error-box {
            width: 100%;
            max-width: 420px;
            padding: 35px 25px;
            text-align: center;
            border-radius: 24px;
            background: rgba(84, 22, 41, 0.3);
            border: 1px solid rgba(217, 154, 170, 0.2);
            backdrop-filter: blur(24px);
            -webkit-backdrop-filter: blur(24px);
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          }

          .error-icon {
            width: 48px;
            height: 48px;
            margin: 0 auto 18px;
            border-radius: 50%;
            background: rgba(255, 100, 120, 0.12);
            color: #ff9ba9;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 900;
            font-size: 22px;
          }

          h1 {
            font-family: Georgia, "Times New Roman", serif;
            font-size: 25px;
            margin: 0 0 10px;
            color: #f5e9ec;
          }

          p {
            color: #c6aeb5;
            line-height: 1.6;
            font-size: 12px;
          }

          button {
            width: 100%;
            min-height: 50px;
            margin-top: 18px;
            border: 1px solid rgba(255, 255, 255, 0.22);
            border-radius: 15px;
            background: linear-gradient(
              135deg,
              rgba(182, 92, 115, 0.7),
              rgba(84, 22, 41, 0.8)
            );
            color: #fff4f6;
            font-weight: 800;
            cursor: pointer;
            backdrop-filter: blur(18px);
            -webkit-backdrop-filter: blur(18px);
            box-shadow: inset 0 1px rgba(255, 255, 255, 0.16);
            transition: transform 0.2s, background 0.2s;
          }

          button:hover {
            transform: translateY(-2px);
            background: linear-gradient(
              135deg,
              rgba(182, 92, 115, 0.85),
              rgba(84, 22, 41, 0.9)
            );
          }
        `}</style>
      </main>
    );
  }

  return (
    <main className="bill-page">
      <div className="bill-container">
        <header className="header">
          <button
            className="back-button"
            onClick={orderMore}
            aria-label="Back to menu"
          >
            ←
          </button>

          <div className="heading-group">
            <span className="brand">MYSURU SOCIALS</span>
            <h1>Your Bill</h1>
          </div>

          <div className="table-badge">TABLE {tableNumber}</div>
        </header>

        <section className="status-banner glass-panel">
          <div className={`status-dot ${allPaid ? "paid" : ""}`} />

          <div>
            <strong>
              {allPaid ? "Payment completed" : "Bill is ready"}
            </strong>
            <span>
              {allPaid
                ? "Your dining session is complete."
                : "Review your order and pay when ready."}
            </span>
          </div>
        </section>

        <section className="bill-card glass-panel">
          <div className="bill-top">
            <div>
              <span className="label">TABLE</span>
              <strong>{tableNumber}</strong>
            </div>

            <div className="logo-box">MS</div>
          </div>

          <div className="divider" />

          <div className="items">
            {combinedItems.length === 0 ? (
              <div className="empty">
                <p>No items in this bill yet.</p>
                <button onClick={orderMore}>Order Food</button>
              </div>
            ) : (
              combinedItems.map((item) => (
                <div className="bill-item" key={item.item_name}>
                  <div>
                    <strong>{item.item_name}</strong>
                    <span>
                      ₹{item.unit_price.toFixed(2)} × {item.quantity}
                    </span>
                  </div>

                  <strong className="item-price">
                    ₹{item.total.toFixed(2)}
                  </strong>
                </div>
              ))
            )}
          </div>

          {combinedItems.length > 0 && (
            <>
              <div className="divider" />

              <div className="summary">
                <div>
                  <span>Items</span>
                  <span>{totalQuantity}</span>
                </div>

                <div>
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>

                <div className="grand-total">
                  <span>Total</span>
                  <strong>₹{subtotal.toFixed(2)}</strong>
                </div>
              </div>
            </>
          )}
        </section>

        {orders.length > 0 && (
          <section className="history">
            <div className="history-heading">
              <span>ORDER HISTORY</span>
              <small>
                {orders.length} order{orders.length !== 1 ? "s" : ""}
              </small>
            </div>

            {orders.map((order) => (
              <div className="history-card glass-panel" key={order.id}>
                <div>
                  <strong>{order.order_number}</strong>
                  <span>
                    {new Date(order.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                <div className="history-status">
                  <span>{order.status}</span>
                  <small className={order.payment_status.toLowerCase()}>
                    {order.payment_status}
                  </small>
                </div>
              </div>
            ))}
          </section>
        )}

        {combinedItems.length > 0 && (
          <section className="actions">
            {!allPaid && (
              <button
                className="pay-button glass-button"
                onClick={() => setShowPayment(true)}
              >
                <span>Pay ₹{subtotal.toFixed(2)}</span>
                <span>→</span>
              </button>
            )}

            {allPaid && (
              <div className="paid-message">
                <div className="check">✓</div>
                <div>
                  <strong>Paid successfully</strong>
                  <span>Thank you for dining with us.</span>
                </div>
              </div>
            )}

            <button
              className="whatsapp-button glass-button"
              onClick={sendWhatsAppBill}
            >
              <span>Send Bill on WhatsApp</span>
              <span>↗</span>
            </button>

            <button
              className="order-more-button glass-button"
              onClick={orderMore}
            >
              + Order More
            </button>

            {allPaid && (
              <button
                className="finish-button glass-button"
                onClick={finishDining}
              >
                <span>Finish Dining</span>
                <span>✓</span>
              </button>
            )}
          </section>
        )}

        <footer>
          Thank you for visiting <strong>Mysuru Socials</strong>
        </footer>
      </div>

      {showPayment && !allPaid && (
        <div
          className="modal-backdrop"
          onClick={() => setShowPayment(false)}
        >
          <div
            className="payment-modal glass-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-modal glass-button"
              onClick={() => setShowPayment(false)}
              aria-label="Close payment window"
            >
              ×
            </button>

            <span className="modal-label">SECURE PAYMENT</span>
            <h2>Pay your bill</h2>

            <div className="modal-amount">
              ₹{subtotal.toFixed(2)}
            </div>

            <p className="description">
              Scan the QR with any UPI app or open your preferred UPI
              application.
            </p>

            <div className="qr-box">
              <QRCodeSVG
                value={getUPIUrl()}
                size={170}
                bgColor="#ffffff"
                fgColor="#10090c"
                level="M"
              />
            </div>

            <p className="scan-text">
              Scan with Google Pay, PhonePe, Paytm or another UPI app
            </p>

            <button
              className="upi-button glass-button"
              onClick={openUPIApp}
            >
              Open UPI App
            </button>

            <button
              className="demo-button glass-button"
              onClick={makeDemoPayment}
              disabled={paying}
            >
              {paying
                ? "Processing..."
                : `Simulate Demo Payment — ₹${subtotal.toFixed(2)}`}
            </button>

            <div className="note">
              <span>ⓘ</span>
              <p>
                Demo payment is for project demonstration only. Real
                payments should be verified through a payment gateway.
              </p>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .bill-page {
          min-height: 100vh;
          padding: 28px 16px 50px;
          color: #f5e9ec;
          font-family: Arial, Helvetica, sans-serif;
          background:
            radial-gradient(
              ellipse at 12% 0%,
              rgba(139, 41, 66, 0.24),
              transparent 38%
            ),
            radial-gradient(
              ellipse at 100% 48%,
              rgba(84, 22, 41, 0.16),
              transparent 36%
            ),
            #10090c;
        }

        .bill-container {
          width: 100%;
          max-width: 620px;
          margin: 0 auto;
        }

        .header {
          display: flex;
          align-items: center;
          gap: 13px;
          margin-bottom: 22px;
        }

        .heading-group {
          min-width: 0;
        }

        .back-button,
        .glass-button,
        .close-modal {
          font-family: Arial, Helvetica, sans-serif;
          backdrop-filter: blur(22px);
          -webkit-backdrop-filter: blur(22px);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.13),
            0 8px 22px rgba(0, 0, 0, 0.15);
          transition:
            transform 0.2s ease,
            background 0.2s ease,
            border-color 0.2s ease,
            box-shadow 0.2s ease;
        }

        .back-button {
          width: 44px;
          height: 44px;
          flex-shrink: 0;
          border-radius: 15px;
          border: 1px solid rgba(217, 154, 170, 0.24);
          background: rgba(255, 255, 255, 0.055);
          color: #f5e9ec;
          font-size: 20px;
          cursor: pointer;
        }

        .back-button:hover,
        .glass-button:hover:not(:disabled),
        .close-modal:hover {
          transform: translateY(-2px);
          border-color: rgba(217, 154, 170, 0.48);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.19),
            0 12px 28px rgba(0, 0, 0, 0.24);
        }

        .brand {
          color: #d99aaa;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 2.2px;
        }

        h1,
        h2 {
          font-family: Georgia, "Times New Roman", serif;
          color: #f5e9ec;
        }

        h1 {
          margin: 5px 0 0;
          font-size: 30px;
          line-height: 1.1;
          font-weight: 500;
          letter-spacing: -0.6px;
        }

        .table-badge {
          margin-left: auto;
          padding: 10px 12px;
          flex-shrink: 0;
          border-radius: 999px;
          color: #e6b4c0;
          background: rgba(139, 41, 66, 0.2);
          border: 1px solid rgba(217, 154, 170, 0.25);
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 1px;
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
        }

        .glass-panel {
          background: linear-gradient(
            145deg,
            rgba(255, 255, 255, 0.065),
            rgba(84, 22, 41, 0.18)
          );
          border: 1px solid rgba(217, 154, 170, 0.17);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.065),
            0 18px 45px rgba(0, 0, 0, 0.15);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
        }

        .status-banner {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          margin-bottom: 14px;
          border-radius: 19px;
        }

        .status-dot {
          width: 10px;
          height: 10px;
          flex-shrink: 0;
          border-radius: 50%;
          background: #d99aaa;
          box-shadow: 0 0 16px rgba(217, 154, 170, 0.55);
        }

        .status-dot.paid {
          background: #7ee2a8;
          box-shadow: 0 0 16px rgba(126, 226, 168, 0.45);
        }

        .status-banner strong,
        .status-banner span {
          display: block;
        }

        .status-banner strong {
          font-size: 13px;
          margin-bottom: 5px;
        }

        .status-banner span {
          color: #c6aeb5;
          font-size: 11px;
          line-height: 1.5;
        }

        .bill-card {
          padding: 23px;
          border-radius: 25px;
        }

        .bill-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .label {
          display: block;
          color: #c6aeb5;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 1.6px;
          margin-bottom: 5px;
        }

        .bill-top strong {
          font-size: 19px;
          color: #f5e9ec;
        }

        .logo-box {
          width: 44px;
          height: 44px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(
            145deg,
            rgba(182, 92, 115, 0.85),
            rgba(84, 22, 41, 0.9)
          );
          border: 1px solid rgba(255, 255, 255, 0.22);
          color: #fff4f6;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 14px;
          font-weight: 700;
          box-shadow: inset 0 1px rgba(255, 255, 255, 0.18);
        }

        .divider {
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(217, 154, 170, 0.28),
            transparent
          );
          margin: 21px 0;
        }

        .items {
          display: flex;
          flex-direction: column;
          gap: 19px;
        }

        .bill-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .bill-item strong,
        .bill-item span {
          display: block;
        }

        .bill-item strong {
          font-size: 13px;
          line-height: 1.5;
          color: #f5e9ec;
        }

        .bill-item span {
          color: #c6aeb5;
          font-size: 10px;
          margin-top: 4px;
        }

        .item-price {
          white-space: nowrap;
          color: #e6b4c0 !important;
        }

        .summary {
          display: flex;
          flex-direction: column;
          gap: 13px;
        }

        .summary > div {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          color: #c6aeb5;
          font-size: 12px;
        }

        .summary .grand-total {
          padding-top: 17px;
          margin-top: 5px;
          border-top: 1px dashed rgba(217, 154, 170, 0.28);
          color: #f5e9ec;
          font-size: 15px;
          font-weight: 800;
        }

        .grand-total strong {
          color: #e6b4c0;
          font-size: 26px;
          font-weight: 700;
        }

        .history {
          margin-top: 25px;
        }

        .history-heading {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 11px;
          padding: 0 3px;
        }

        .history-heading span {
          color: #d99aaa;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 1.6px;
        }

        .history-heading small {
          color: #c6aeb5;
          font-size: 10px;
        }

        .history-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 14px;
          padding: 15px;
          margin-bottom: 9px;
          border-radius: 17px;
        }

        .history-card strong,
        .history-card span {
          display: block;
        }

        .history-card strong {
          font-size: 12px;
          color: #f5e9ec;
        }

        .history-card > div:first-child span {
          color: #c6aeb5;
          font-size: 10px;
          margin-top: 5px;
        }

        .history-status {
          text-align: right;
          flex-shrink: 0;
        }

        .history-status > span {
          color: #e6b4c0;
          font-size: 9px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .history-status small {
          display: block;
          margin-top: 5px;
          font-size: 9px;
          text-transform: uppercase;
          font-weight: 900;
        }

        .history-status small.paid {
          color: #7ee2a8;
        }

        .history-status small.pending {
          color: #e6b4c0;
        }

        .history-status small.failed {
          color: #ff9ba9;
        }

        .actions {
          display: flex;
          flex-direction: column;
          gap: 11px;
          margin-top: 21px;
        }

        .pay-button,
        .whatsapp-button,
        .order-more-button,
        .finish-button {
          width: 100%;
          min-height: 54px;
          border-radius: 17px;
          padding: 15px 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
        }

        .pay-button {
          border: 1px solid rgba(255, 255, 255, 0.24);
          background: linear-gradient(
            135deg,
            rgba(182, 92, 115, 0.85),
            rgba(84, 22, 41, 0.88)
          );
          color: #fff4f6;
          font-size: 15px;
        }

        .whatsapp-button {
          border: 1px solid rgba(217, 154, 170, 0.24);
          background: rgba(255, 255, 255, 0.055);
          color: #f5e9ec;
        }

        .order-more-button {
          justify-content: center;
          border: 1px solid rgba(217, 154, 170, 0.22);
          background: rgba(84, 22, 41, 0.13);
          color: #e6b4c0;
        }

        .finish-button {
          border: 1px solid rgba(126, 226, 168, 0.25);
          background: rgba(126, 226, 168, 0.07);
          color: #a4edc1;
        }

        .finish-button:hover {
          background: rgba(126, 226, 168, 0.12);
        }

        .paid-message {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 15px;
          border-radius: 17px;
          background: rgba(126, 226, 168, 0.065);
          border: 1px solid rgba(126, 226, 168, 0.18);
        }

        .check {
          width: 36px;
          height: 36px;
          flex-shrink: 0;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(126, 226, 168, 0.16);
          border: 1px solid rgba(126, 226, 168, 0.35);
          color: #a4edc1;
          font-weight: 900;
        }

        .paid-message strong,
        .paid-message span {
          display: block;
        }

        .paid-message strong {
          font-size: 13px;
          color: #d8f7e4;
        }

        .paid-message span {
          color: #a6c5b2;
          font-size: 10px;
          margin-top: 4px;
        }

        footer {
          text-align: center;
          color: #c6aeb5;
          font-size: 10px;
          line-height: 1.7;
          margin-top: 30px;
        }

        footer strong {
          color: #e6b4c0;
          font-weight: 700;
        }

        .empty {
          text-align: center;
          padding: 15px 0 5px;
        }

        .empty p {
          color: #c6aeb5;
          font-size: 12px;
          line-height: 1.6;
        }

        .empty button {
          margin-top: 9px;
          min-height: 44px;
          padding: 12px 19px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 14px;
          background: linear-gradient(
            135deg,
            rgba(182, 92, 115, 0.72),
            rgba(84, 22, 41, 0.82)
          );
          color: #fff4f6;
          font-weight: 800;
          cursor: pointer;
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          box-shadow: inset 0 1px rgba(255, 255, 255, 0.13);
          transition: transform 0.2s, background 0.2s;
        }

        .empty button:hover {
          transform: translateY(-2px);
        }

        .modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 18px;
          background: rgba(8, 4, 6, 0.78);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }

        .payment-modal {
          position: relative;
          width: 100%;
          max-width: 390px;
          max-height: 92vh;
          overflow-y: auto;
          padding: 31px 22px 23px;
          text-align: center;
          border-radius: 27px;
          background: linear-gradient(
            145deg,
            rgba(35, 17, 24, 0.97),
            rgba(22, 10, 15, 0.98)
          );
          border: 1px solid rgba(217, 154, 170, 0.25);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.08),
            0 28px 90px rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(28px);
          -webkit-backdrop-filter: blur(28px);
        }

        .close-modal {
          position: absolute;
          top: 13px;
          right: 13px;
          width: 35px;
          height: 35px;
          border-radius: 50%;
          border: 1px solid rgba(217, 154, 170, 0.2);
          background: rgba(255, 255, 255, 0.055);
          color: #f5e9ec;
          font-size: 21px;
          cursor: pointer;
        }

        .modal-label {
          color: #d99aaa;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 2px;
        }

        .payment-modal h2 {
          margin: 10px 0;
          font-size: 27px;
          font-weight: 500;
        }

        .modal-amount {
          color: #e6b4c0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 34px;
          font-weight: 700;
        }

        .description {
          max-width: 280px;
          margin: 12px auto 18px;
          color: #c6aeb5;
          font-size: 11px;
          line-height: 1.6;
        }

        .qr-box {
          width: 190px;
          height: 190px;
          margin: auto;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 19px;
          background: #ffffff;
          box-shadow: 0 0 0 6px rgba(217, 154, 170, 0.07);
        }

        .scan-text {
          color: #c6aeb5;
          font-size: 10px;
          line-height: 1.5;
          margin: 14px 0 16px;
        }

        .upi-button,
        .demo-button {
          width: 100%;
          min-height: 50px;
          padding: 12px;
          border-radius: 15px;
          font-size: 11px;
          font-weight: 800;
          cursor: pointer;
        }

        .upi-button {
          border: 1px solid rgba(255, 255, 255, 0.23);
          background: linear-gradient(
            135deg,
            rgba(182, 92, 115, 0.82),
            rgba(84, 22, 41, 0.9)
          );
          color: #fff4f6;
        }

        .demo-button {
          margin-top: 10px;
          border: 1px solid rgba(217, 154, 170, 0.22);
          background: rgba(255, 255, 255, 0.055);
          color: #f5e9ec;
        }

        .demo-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .note {
          display: flex;
          gap: 9px;
          margin-top: 15px;
          padding: 12px;
          text-align: left;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.035);
          border: 1px solid rgba(217, 154, 170, 0.1);
        }

        .note span {
          color: #d99aaa;
          flex-shrink: 0;
        }

        .note p {
          margin: 0;
          color: #c6aeb5;
          font-size: 9px;
          line-height: 1.6;
        }

        @media (min-width: 700px) {
          .bill-page {
            padding-top: 55px;
          }

          h1 {
            font-size: 33px;
          }

          .bill-card {
            padding: 29px;
          }
        }

        @media (max-width: 390px) {
          .bill-page {
            padding-right: 12px;
            padding-left: 12px;
          }

          .header {
            gap: 9px;
          }

          .back-button {
            width: 40px;
            height: 40px;
          }

          .brand {
            font-size: 8px;
            letter-spacing: 1.5px;
          }

          h1 {
            font-size: 26px;
          }

          .table-badge {
            padding: 8px;
            font-size: 8px;
          }

          .bill-card {
            padding: 18px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>
    </main>
  );
}

export default function BillPage() {
  return (
    <Suspense
      fallback={
        <main
          style={{
            minHeight: "100vh",
            background: "#10090c",
            color: "#f5e9ec",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "Arial, Helvetica, sans-serif",
          }}
        >
          Preparing your bill...
        </main>
      }
    >
      <BillContent />
    </Suspense>
  );
}

