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

  const [tableNumber, setTableNumber] =
    useState<number | null>(null);

  const [tableId, setTableId] =
    useState<number | null>(null);

  const [sessionId, setSessionId] =
    useState<string | null>(null);

  const [orders, setOrders] =
    useState<Order[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [showPayment, setShowPayment] =
    useState(false);

  const [paying, setPaying] =
    useState(false);

  async function loadBill(
    currentTableNumber: number,
    currentSessionId: string
  ) {
    setLoading(true);
    setError("");

    try {
      const {
        data: table,
        error: tableError,
      } = await supabase
        .from("restaurant_tables")
        .select("id, table_number")
        .eq(
          "table_number",
          currentTableNumber
        )
        .single();

      if (tableError || !table) {
        console.error(
          "TABLE ERROR:",
          tableError
        );

        setError(
          "Table not found."
        );

        setLoading(false);
        return;
      }

      setTableId(table.id);

      const {
        data: orderData,
        error: orderError,
      } = await supabase
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
        .eq(
          "table_id",
          table.id
        )
        .eq(
          "session_id",
          currentSessionId
        )
        .order("created_at", {
          ascending: true,
        });

      if (orderError) {
        console.error(
          "BILL ORDER ERROR:",
          orderError
        );

        setError(
          "Could not load your bill."
        );

        setLoading(false);
        return;
      }

      setOrders(
        (orderData ?? []) as Order[]
      );

      setLoading(false);
    } catch (err) {
      console.error(
        "BILL LOAD ERROR:",
        err
      );

      setError(
        "Something went wrong while loading the bill."
      );

      setLoading(false);
    }
  }

  useEffect(() => {
    const tableParam =
      searchParams.get("table");

    const orderParam =
      searchParams.get("order");

    if (!tableParam) {
      setError(
        "Table number is missing."
      );
      setLoading(false);
      return;
    }

    const parsedTable =
      Number(tableParam);

    if (
      !Number.isInteger(parsedTable) ||
      parsedTable < 1 ||
      parsedTable > 10
    ) {
      setError(
        "Invalid table number."
      );
      setLoading(false);
      return;
    }

    setTableNumber(
      parsedTable
    );

    const initializeBill =
      async () => {
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
              .eq(
                "id",
                orderParam
              )
              .single();

            if (
              exactOrderError ||
              !exactOrder
            ) {
              console.error(
                "EXACT ORDER ERROR:",
                exactOrderError
              );

              setError(
                "Order not found. Please go back to the menu and try again."
              );

              setLoading(false);
              return;
            }

            const {
              data: table,
              error: tableError,
            } = await supabase
              .from(
                "restaurant_tables"
              )
              .select(
                "id, table_number"
              )
              .eq(
                "table_number",
                parsedTable
              )
              .single();

            if (
              tableError ||
              !table ||
              table.id !==
                exactOrder.table_id
            ) {
              setError(
                "This order does not belong to this table."
              );

              setLoading(false);
              return;
            }

            setTableId(
              table.id
            );

            const exactSessionId =
              exactOrder.session_id;

            localStorage.setItem(
              "mysuru-socials-session-id",
              exactSessionId
            );

            setSessionId(
              exactSessionId
            );

            await loadBill(
              parsedTable,
              exactSessionId
            );

            return;
          }

          let currentSessionId =
            localStorage.getItem(
              "mysuru-socials-session-id"
            );

          if (!currentSessionId) {
            currentSessionId =
              crypto.randomUUID();

            localStorage.setItem(
              "mysuru-socials-session-id",
              currentSessionId
            );
          }

          setSessionId(
            currentSessionId
          );

          await loadBill(
            parsedTable,
            currentSessionId
          );
        } catch (err) {
          console.error(
            "BILL INITIALIZATION ERROR:",
            err
          );

          setError(
            "Something went wrong while loading your bill."
          );

          setLoading(false);
        }
      };

    initializeBill();
  }, [searchParams]);

  useEffect(() => {
    if (
      !sessionId ||
      !tableNumber
    ) {
      return;
    }

    const channel =
      supabase
        .channel(
          `bill-live-${sessionId}`
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "orders",
          },
          () => {
            loadBill(
              tableNumber,
              sessionId
            );
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
            loadBill(
              tableNumber,
              sessionId
            );
          }
        )
        .subscribe();

    return () => {
      supabase.removeChannel(
        channel
      );
    };
  }, [
    sessionId,
    tableNumber,
  ]);

  const combinedItems =
    useMemo<CombinedItem[]>(
      () => {
        const map =
          new Map<
            string,
            CombinedItem
          >();

        orders.forEach(
          (order) => {
            order.order_items?.forEach(
              (item) => {
                const existing =
                  map.get(
                    item.item_name
                  );

                const price =
                  Number(
                    item.unit_price
                  );

                if (existing) {
                  existing.quantity +=
                    item.quantity;

                  existing.total +=
                    price *
                    item.quantity;
                } else {
                  map.set(
                    item.item_name,
                    {
                      item_name:
                        item.item_name,
                      unit_price:
                        price,
                      quantity:
                        item.quantity,
                      total:
                        price *
                        item.quantity,
                    }
                  );
                }
              }
            );
          }
        );

        return Array.from(
          map.values()
        );
      },
      [orders]
    );

  const subtotal = useMemo(
    () =>
      combinedItems.reduce(
        (sum, item) =>
          sum + item.total,
        0
      ),
    [combinedItems]
  );

  const totalQuantity = useMemo(
    () =>
      combinedItems.reduce(
        (sum, item) =>
          sum + item.quantity,
        0
      ),
    [combinedItems]
  );

  const allPaid =
    orders.length > 0 &&
    orders.every(
      (order) =>
        order.payment_status ===
        "Paid"
    );

  function getUPIUrl() {
    return (
      `upi://pay?pa=${encodeURIComponent(
        RESTAURANT_UPI_ID
      )}` +
      `&pn=${encodeURIComponent(
        RESTAURANT_NAME
      )}` +
      `&am=${subtotal.toFixed(2)}` +
      `&cu=INR`
    );
  }

  function openUPIApp() {
    window.location.href =
      getUPIUrl();
  }

  async function makeDemoPayment() {
    if (
      !sessionId ||
      subtotal <= 0 ||
      paying
    ) {
      return;
    }

    setPaying(true);

    try {
      const response =
        await fetch(
          "/api/payment/demo",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              sessionId,
              amount: subtotal,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Payment failed."
        );
      }

      setShowPayment(false);

      if (
        tableNumber &&
        sessionId
      ) {
        await loadBill(
          tableNumber,
          sessionId
        );
      }

      alert(
        "Demo payment successful! 🎉"
      );
    } catch (err) {
      console.error(
        "PAYMENT ERROR:",
        err
      );

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
    if (
      !tableNumber ||
      combinedItems.length === 0
    ) {
      return;
    }

    let message =
      `*${RESTAURANT_NAME}*\n` +
      `Table ${tableNumber}\n\n` +
      `*Your Bill*\n\n`;

    combinedItems.forEach(
      (item) => {
        message +=
          `${item.item_name} × ${item.quantity} — ₹${item.total.toFixed(
            2
          )}\n`;
      }
    );

    message +=
      `\nTotal Items: ${totalQuantity}` +
      `\n*Total: ₹${subtotal.toFixed(
        2
      )}*`;

    message += allPaid
      ? "\n\nPayment Status: PAID"
      : "\n\nPayment Status: PENDING";

    const whatsappUrl =
      `https://wa.me/${WHATSAPP_NUMBER}` +
      `?text=${encodeURIComponent(
        message
      )}`;

    window.open(
      whatsappUrl,
      "_blank"
    );
  }

  function orderMore() {
    if (!tableNumber) return;

    window.location.href =
      `/order?table=${tableNumber}`;
  }

  function finishDining() {
    if (!allPaid) {
      alert(
        "Please complete payment before finishing your dining session."
      );
      return;
    }

    const confirmed =
      window.confirm(
        "Payment is complete. Finish this dining session?"
      );

    if (!confirmed) return;

    localStorage.removeItem(
      "mysuru-socials-session-id"
    );

    window.location.href =
      "/";
  }

  if (loading) {
    return (
      <main className="loading-page">
        <div className="loading-spinner" />
        <p>
          Preparing your bill...
        </p>

        <style jsx>{`
          .loading-page {
            min-height: 100vh;
            background: #08090c;
            color: white;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 18px;
            font-family: Arial, sans-serif;
          }

          .loading-spinner {
            width: 44px;
            height: 44px;
            border: 3px solid
              rgba(201, 168, 120, 0.2);
            border-top-color: #c9a878;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }

          p {
            color: #777;
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
          <div className="error-icon">
            !
          </div>

          <h1>
            Something went wrong
          </h1>

          <p>{error}</p>

          <button
            onClick={() =>
              (window.location.href =
                tableNumber
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
            background: #08090c;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            font-family: Arial, sans-serif;
          }

          .error-box {
            width: 100%;
            max-width: 420px;
            padding: 35px 25px;
            text-align: center;
            border-radius: 24px;
            background: #111217;
            border: 1px solid #292a31;
          }

          .error-icon {
            width: 48px;
            height: 48px;
            margin: 0 auto 18px;
            border-radius: 50%;
            background: rgba(
              255,
              80,
              80,
              0.1
            );
            color: #ff7777;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 900;
            font-size: 22px;
          }

          h1 {
            font-size: 23px;
            margin: 0 0 10px;
          }

          p {
            color: #777;
            line-height: 1.5;
            font-size: 12px;
          }

          button {
            width: 100%;
            height: 50px;
            margin-top: 18px;
            border: 0;
            border-radius: 14px;
            background: #c9a878;
            color: #11100e;
            font-weight: 900;
            cursor: pointer;
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
          >
            ←
          </button>

          <div>
            <span className="brand">
              MYSURU SOCIALS
            </span>

            <h1>
              Your Bill
            </h1>
          </div>

          <div className="table-badge">
            TABLE {tableNumber}
          </div>
        </header>

        <section className="status-banner">
          <div
            className={`status-dot ${
              allPaid
                ? "paid"
                : ""
            }`}
          />

          <div>
            <strong>
              {allPaid
                ? "Payment completed"
                : "Bill is ready"}
            </strong>

            <span>
              {allPaid
                ? "Your dining session is complete."
                : "Review your order and pay when ready."}
            </span>
          </div>
        </section>

        <section className="bill-card">

          <div className="bill-top">
            <div>
              <span className="label">
                TABLE
              </span>

              <strong>
                {tableNumber}
              </strong>
            </div>

            <div className="logo-box">
              MS
            </div>
          </div>

          <div className="divider" />

          <div className="items">
            {combinedItems.length ===
            0 ? (
              <div className="empty">
                <p>
                  No items in this
                  bill yet.
                </p>

                <button
                  onClick={
                    orderMore
                  }
                >
                  Order Food
                </button>
              </div>
            ) : (
              combinedItems.map(
                (item) => (
                  <div
                    className="bill-item"
                    key={
                      item.item_name
                    }
                  >
                    <div>
                      <strong>
                        {
                          item.item_name
                        }
                      </strong>

                      <span>
                        ₹
                        {item.unit_price.toFixed(
                          2
                        )}{" "}
                        ×{" "}
                        {
                          item.quantity
                        }
                      </span>
                    </div>

                    <strong className="item-price">
                      ₹
                      {item.total.toFixed(
                        2
                      )}
                    </strong>
                  </div>
                )
              )
            )}
          </div>

          {combinedItems.length >
            0 && (
            <>
              <div className="divider" />

              <div className="summary">

                <div>
                  <span>
                    Items
                  </span>

                  <span>
                    {totalQuantity}
                  </span>
                </div>

                <div>
                  <span>
                    Subtotal
                  </span>

                  <span>
                    ₹
                    {subtotal.toFixed(
                      2
                    )}
                  </span>
                </div>

                <div className="grand-total">
                  <span>
                    Total
                  </span>

                  <strong>
                    ₹
                    {subtotal.toFixed(
                      2
                    )}
                  </strong>
                </div>

              </div>
            </>
          )}
        </section>

        {orders.length > 0 && (
          <section className="history">

            <div className="history-heading">
              <span>
                ORDER HISTORY
              </span>

              <small>
                {orders.length} order
                {orders.length !==
                1
                  ? "s"
                  : ""}
              </small>
            </div>

            {orders.map(
              (order) => (
                <div
                  className="history-card"
                  key={order.id}
                >
                  <div>
                    <strong>
                      {
                        order.order_number
                      }
                    </strong>

                    <span>
                      {new Date(
                        order.created_at
                      ).toLocaleTimeString(
                        [],
                        {
                          hour: "2-digit",
                          minute:
                            "2-digit",
                        }
                      )}
                    </span>
                  </div>

                  <div className="history-status">
                    <span>
                      {
                        order.status
                      }
                    </span>

                    <small
                      className={
                        order.payment_status.toLowerCase()
                      }
                    >
                      {
                        order.payment_status
                      }
                    </small>
                  </div>
                </div>
              )
            )}

          </section>
        )}

        {combinedItems.length >
          0 && (
          <section className="actions">

            {!allPaid && (
              <button
                className="pay-button"
                onClick={() =>
                  setShowPayment(
                    true
                  )
                }
              >
                <span>
                  Pay ₹
                  {subtotal.toFixed(
                    2
                  )}
                </span>

                <span>
                  →
                </span>
              </button>
            )}

            {allPaid && (
              <div className="paid-message">
                <div className="check">
                  ✓
                </div>

                <div>
                  <strong>
                    Paid successfully
                  </strong>

                  <span>
                    Thank you for
                    dining with us.
                  </span>
                </div>
              </div>
            )}

            <button
              className="whatsapp-button"
              onClick={
                sendWhatsAppBill
              }
            >
              <span>
                Send Bill on WhatsApp
              </span>

              <span>
                ↗
              </span>
            </button>

            <button
              className="order-more-button"
              onClick={
                orderMore
              }
            >
              + Order More
            </button>

            {allPaid && (
              <button
                className="finish-button"
                onClick={
                  finishDining
                }
              >
                <span>
                  Finish Dining
                </span>

                <span>
                  ✓
                </span>
              </button>
            )}

          </section>
        )}

        <footer>
          Thank you for visiting{" "}
          <strong>
            Mysuru Socials
          </strong>
        </footer>

      </div>

      {showPayment &&
        !allPaid && (
          <div
            className="modal-backdrop"
            onClick={() =>
              setShowPayment(
                false
              )
            }
          >
            <div
              className="payment-modal"
              onClick={(e) =>
                e.stopPropagation()
              }
            >
              <button
                className="close-modal"
                onClick={() =>
                  setShowPayment(
                    false
                  )
                }
              >
                ×
              </button>

              <span className="modal-label">
                SECURE PAYMENT
              </span>

              <h2>
                Pay your bill
              </h2>

              <div className="modal-amount">
                ₹
                {subtotal.toFixed(
                  2
                )}
              </div>

              <p className="description">
                Scan the QR with any
                UPI app or open your
                preferred UPI
                application.
              </p>

              <div className="qr-box">
                <QRCodeSVG
                  value={getUPIUrl()}
                  size={170}
                  bgColor="#ffffff"
                  fgColor="#08090c"
                  level="M"
                />
              </div>

              <p className="scan-text">
                Scan with Google Pay,
                PhonePe, Paytm or
                another UPI app
              </p>

              <button
                className="upi-button"
                onClick={
                  openUPIApp
                }
              >
                Open UPI App
              </button>

              <button
                className="demo-button"
                onClick={
                  makeDemoPayment
                }
                disabled={paying}
              >
                {paying
                  ? "Processing..."
                  : `Simulate Demo Payment — ₹${subtotal.toFixed(
                      2
                    )}`}
              </button>

              <div className="note">
                <span>
                  ⓘ
                </span>

                <p>
                  Demo payment is for
                  project demonstration
                  only. Real payments
                  should be verified
                  through a payment
                  gateway.
                </p>
              </div>

            </div>
          </div>
        )}

      <style jsx>{`
        .bill-page {
          min-height: 100vh;
          background:
            radial-gradient(
              circle at 20% 0%,
              rgba(
                201,
                168,
                120,
                0.08
              ),
              transparent 30%
            ),
            #08090c;
          color: white;
          padding: 24px 16px 50px;
          font-family: Arial,
            Helvetica, sans-serif;
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
          margin-bottom: 20px;
        }

        .back-button {
          width: 44px;
          height: 44px;
          flex-shrink: 0;
          border-radius: 14px;
          border: 1px solid #292a30;
          background: #111217;
          color: white;
          font-size: 20px;
          cursor: pointer;
        }

        .brand {
          color: #c9a878;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 2px;
        }

        h1 {
          margin: 4px 0 0;
          font-size: 28px;
          letter-spacing: -1px;
        }

        .table-badge {
          margin-left: auto;
          padding: 9px 11px;
          border-radius: 999px;
          color: #c9a878;
          background: rgba(
            201,
            168,
            120,
            0.08
          );
          border: 1px solid
            rgba(
              201,
              168,
              120,
              0.25
            );
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .status-banner {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          margin-bottom: 14px;
          border-radius: 18px;
          background: #111217;
          border: 1px solid #272830;
        }

        .status-dot {
          width: 10px;
          height: 10px;
          flex-shrink: 0;
          border-radius: 50%;
          background: #c9a878;
          box-shadow:
            0 0 16px
              rgba(
                201,
                168,
                120,
                0.6
              );
        }

        .status-dot.paid {
          background: #7ee2a8;
          box-shadow:
            0 0 16px
              rgba(
                126,
                226,
                168,
                0.5
              );
        }

        .status-banner strong,
        .status-banner span {
          display: block;
        }

        .status-banner strong {
          font-size: 13px;
          margin-bottom: 4px;
        }

        .status-banner span {
          color: #777;
          font-size: 11px;
        }

        .bill-card {
          padding: 22px;
          border-radius: 24px;
          background: #111217;
          border: 1px solid #292a31;
        }

        .bill-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .label {
          display: block;
          color: #777;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 1.5px;
          margin-bottom: 4px;
        }

        .bill-top strong {
          font-size: 18px;
        }

        .logo-box {
          width: 42px;
          height: 42px;
          border-radius: 13px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #c9a878;
          color: #11100e;
          font-size: 12px;
          font-weight: 1000;
        }

        .divider {
          height: 1px;
          background: #292a31;
          margin: 20px 0;
        }

        .items {
          display: flex;
          flex-direction: column;
          gap: 18px;
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
          line-height: 1.4;
        }

        .bill-item span {
          color: #666;
          font-size: 10px;
          margin-top: 4px;
        }

        .item-price {
          white-space: nowrap;
        }

        .summary {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .summary > div {
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: #777;
          font-size: 12px;
        }

        .summary .grand-total {
          padding-top: 17px;
          margin-top: 5px;
          border-top: 1px dashed #303138;
          color: white;
          font-size: 15px;
          font-weight: 800;
        }

        .grand-total strong {
          color: #c9a878;
          font-size: 25px;
        }

        .history {
          margin-top: 24px;
        }

        .history-heading {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
          padding: 0 3px;
        }

        .history-heading span {
          color: #666;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 1.5px;
        }

        .history-heading small {
          color: #555;
          font-size: 10px;
        }

        .history-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px;
          margin-bottom: 8px;
          border-radius: 15px;
          background: #101116;
          border: 1px solid #25262d;
        }

        .history-card strong,
        .history-card span {
          display: block;
        }

        .history-card strong {
          font-size: 12px;
        }

        .history-card > div:first-child span {
          color: #666;
          font-size: 10px;
          margin-top: 4px;
        }

        .history-status {
          text-align: right;
        }

        .history-status > span {
          color: #c9a878;
          font-size: 9px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .history-status small {
          display: block;
          margin-top: 4px;
          font-size: 9px;
          text-transform: uppercase;
          font-weight: 900;
        }

        .history-status small.paid {
          color: #7ee2a8;
        }

        .history-status small.pending {
          color: #e4b86a;
        }

        .history-status small.failed {
          color: #ff7777;
        }

        .actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 20px;
        }

        .pay-button,
        .whatsapp-button,
        .order-more-button,
        .finish-button {
          width: 100%;
          min-height: 54px;
          border-radius: 16px;
          padding: 15px 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-weight: 900;
          cursor: pointer;
        }

        .pay-button {
          border: 0;
          background: #c9a878;
          color: #11100e;
          font-size: 15px;
        }

        .whatsapp-button {
          border: 1px solid #303138;
          background: #18191e;
          color: white;
        }

        .order-more-button {
          justify-content: center;
          border: 1px solid #292a31;
          background: transparent;
          color: #888;
        }

        .finish-button {
          border: 1px solid
            rgba(
              126,
              226,
              168,
              0.25
            );
          background: #151a18;
          color: #7ee2a8;
        }

        .finish-button:hover {
          background: #1a211d;
        }

        .paid-message {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 15px;
          border-radius: 16px;
          background: rgba(
            126,
            226,
            168,
            0.07
          );
          border: 1px solid
            rgba(
              126,
              226,
              168,
              0.18
            );
        }

        .check {
          width: 36px;
          height: 36px;
          flex-shrink: 0;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #7ee2a8;
          color: #101510;
          font-weight: 1000;
        }

        .paid-message strong,
        .paid-message span {
          display: block;
        }

        .paid-message strong {
          font-size: 13px;
        }

        .paid-message span {
          color: #718078;
          font-size: 10px;
          margin-top: 3px;
        }

        footer {
          text-align: center;
          color: #555;
          font-size: 10px;
          margin-top: 30px;
        }

        footer strong {
          color: #777;
        }

        .empty {
          text-align: center;
          padding: 15px 0 5px;
        }

        .empty p {
          color: #777;
          font-size: 12px;
        }

        .empty button {
          margin-top: 8px;
          padding: 12px 18px;
          border: 0;
          border-radius: 12px;
          background: #c9a878;
          color: #11100e;
          font-weight: 900;
          cursor: pointer;
        }

        .modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 18px;
          background: rgba(
            0,
            0,
            0,
            0.8
          );
          backdrop-filter: blur(10px);
        }

        .payment-modal {
          position: relative;
          width: 100%;
          max-width: 390px;
          max-height: 92vh;
          overflow-y: auto;
          padding: 30px 22px 22px;
          text-align: center;
          border-radius: 26px;
          background: #111217;
          border: 1px solid #303138;
        }

        .close-modal {
          position: absolute;
          top: 14px;
          right: 14px;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          border: 1px solid #303138;
          background: #191a1f;
          color: #aaa;
          font-size: 20px;
          cursor: pointer;
        }

        .modal-label {
          color: #c9a878;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 2px;
        }

        .payment-modal h2 {
          margin: 8px 0;
          font-size: 24px;
        }

        .modal-amount {
          color: #c9a878;
          font-size: 32px;
          font-weight: 1000;
        }

        .description {
          max-width: 280px;
          margin: 12px auto 18px;
          color: #777;
          font-size: 11px;
          line-height: 1.5;
        }

        .qr-box {
          width: 190px;
          height: 190px;
          margin: auto;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 18px;
          background: white;
        }

        .scan-text {
          color: #666;
          font-size: 10px;
          margin: 12px 0 15px;
        }

        .upi-button,
        .demo-button {
          width: 100%;
          height: 50px;
          border-radius: 14px;
          font-weight: 900;
          cursor: pointer;
        }

        .upi-button {
          border: 0;
          background: #c9a878;
          color: #11100e;
        }

        .demo-button {
          margin-top: 10px;
          border: 1px solid
            rgba(
              255,
              255,
              255,
              0.1
            );
          background: rgba(
            255,
            255,
            255,
            0.06
          );
          color: white;
        }

        .demo-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .note {
          display: flex;
          gap: 8px;
          margin-top: 15px;
          padding: 12px;
          text-align: left;
          border-radius: 13px;
          background: rgba(
            255,
            255,
            255,
            0.03
          );
        }

        .note span {
          color: #c9a878;
        }

        .note p {
          margin: 0;
          color: #666;
          font-size: 9px;
          line-height: 1.5;
        }

        @media (min-width: 700px) {
          .bill-page {
            padding-top: 55px;
          }

          h1 {
            font-size: 32px;
          }

          .bill-card {
            padding: 28px;
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
            background: "#08090c",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "Arial, sans-serif",
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