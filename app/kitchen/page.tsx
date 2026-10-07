"use client";

import { useEffect, useMemo, useState } from "react";
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
  table_number: number;
  status: "Received" | "Preparing" | "Ready" | "Completed";
  created_at: string;
  items: OrderItem[];
};

const STATUS_FLOW: Order["status"][] = [
  "Received",
  "Preparing",
  "Ready",
  "Completed",
];

const statusStyles: Record<
  Order["status"],
  {
    label: string;
    shortLabel: string;
    icon: string;
  }
> = {
  Received: {
    label: "New Order",
    shortLabel: "NEW",
    icon: "●",
  },
  Preparing: {
    label: "Preparing",
    shortLabel: "COOKING",
    icon: "◐",
  },
  Ready: {
    label: "Ready",
    shortLabel: "READY",
    icon: "✓",
  },
  Completed: {
    label: "Completed",
    shortLabel: "DONE",
    icon: "✓",
  },
};

export default function KitchenPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<"All" | Order["status"]>("All");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function loadOrders() {
    const { data, error } = await supabase
      .from("orders")
      .select(`
        id,
        order_number,
        status,
        created_at,
        restaurant_tables (
          table_number
        ),
        order_items (
          id,
          item_name,
          unit_price,
          quantity
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Kitchen orders error:", error);
      setLoading(false);
      return;
    }

    const formatted: Order[] = (data ?? []).map((order: any) => ({
      id: order.id,
      order_number: order.order_number,
      status: order.status,
      created_at: order.created_at,
      table_number: order.restaurant_tables?.table_number ?? 0,
      items: order.order_items ?? [],
    }));

    setOrders(formatted);
    setLoading(false);
  }

  useEffect(() => {
    loadOrders();

    const channel = supabase
      .channel("kitchen-live-orders")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
        },
        () => {
          loadOrders();
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
          loadOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function updateStatus(
    orderId: string,
    newStatus: Order["status"]
  ) {
    setUpdatingId(orderId);

    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (error) {
      console.error("Status update error:", error);
      alert("Could not update order status.");
      setUpdatingId(null);
      return;
    }

    setOrders((current) =>
      current.map((order) =>
        order.id === orderId
          ? { ...order, status: newStatus }
          : order
      )
    );

    setUpdatingId(null);
  }

  function getNextStatus(
    status: Order["status"]
  ): Order["status"] | null {
    const index = STATUS_FLOW.indexOf(status);

    if (index === -1 || index === STATUS_FLOW.length - 1) {
      return null;
    }

    return STATUS_FLOW[index + 1];
  }

  function formatTime(date: string) {
    return new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function getTotalItems(order: Order) {
    return order.items.reduce(
      (total, item) => total + item.quantity,
      0
    );
  }

  function getAge(date: string) {
    const minutes = Math.floor(
      (Date.now() - new Date(date).getTime()) / 60000
    );

    if (minutes <= 0) return "Just now";
    if (minutes === 1) return "1 min ago";

    return `${minutes} mins ago`;
  }

  const visibleOrders = useMemo(() => {
    if (filter === "All") return orders;

    return orders.filter((order) => order.status === filter);
  }, [orders, filter]);

  const stats = {
    all: orders.length,
    received: orders.filter((o) => o.status === "Received").length,
    preparing: orders.filter((o) => o.status === "Preparing").length,
    ready: orders.filter((o) => o.status === "Ready").length,
  };

  return (
    <main className="kitchen-page">
      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .kitchen-page {
          min-height: 100vh;
          background:
            radial-gradient(
              circle at 10% 0%,
              rgba(201, 168, 120, 0.08),
              transparent 25%
            ),
            radial-gradient(
              circle at 90% 0%,
              rgba(255, 255, 255, 0.04),
              transparent 22%
            ),
            #0a0a09;
          color: #f5efe5;
          padding: 24px;
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        .container {
          max-width: 1500px;
          margin: 0 auto;
        }

        /* HEADER */

        .topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 4px 0 25px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.07);
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .logo {
          width: 52px;
          height: 52px;
          display: grid;
          place-items: center;
          border-radius: 16px;
          border: 1px solid rgba(201, 168, 120, 0.25);
          background: rgba(201, 168, 120, 0.08);
          color: #c9a878;
          font-size: 23px;
        }

        .eyebrow {
          margin-bottom: 3px;
          color: #c9a878;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .title {
          margin: 0;
          font-size: 26px;
          line-height: 1.1;
          font-weight: 850;
          letter-spacing: -0.8px;
        }

        .subtitle {
          margin: 5px 0 0;
          color: #77756f;
          font-size: 12px;
        }

        .live {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 10px 14px;
          border: 1px solid rgba(81, 183, 111, 0.2);
          border-radius: 999px;
          background: rgba(81, 183, 111, 0.06);
          color: #7ddc9c;
          font-size: 11px;
          font-weight: 850;
          letter-spacing: 1px;
        }

        .live-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #55d47d;
          box-shadow: 0 0 12px rgba(85, 212, 125, 0.8);
          animation: livePulse 1.5s ease-in-out infinite;
        }

        @keyframes livePulse {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }

          50% {
            opacity: 0.45;
            transform: scale(0.7);
          }
        }

        /* STATS */

        .stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin: 22px 0;
        }

        .stat {
          position: relative;
          overflow: hidden;
          padding: 17px 18px;
          border: 1px solid rgba(255, 255, 255, 0.065);
          border-radius: 15px;
          background: rgba(255, 255, 255, 0.025);
        }

        .stat::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          height: 1px;
          background: rgba(201, 168, 120, 0.3);
        }

        .stat-label {
          color: #77756f;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1.4px;
          text-transform: uppercase;
        }

        .stat-number {
          margin-top: 6px;
          color: #f5efe5;
          font-size: 29px;
          line-height: 1;
          font-weight: 850;
        }

        /* FILTERS */

        .filter-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          margin-bottom: 17px;
        }

        .section-title {
          color: #aaa69d;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 1.3px;
          text-transform: uppercase;
        }

        .filters {
          display: flex;
          gap: 7px;
          overflow-x: auto;
          padding-bottom: 3px;
        }

        .filters::-webkit-scrollbar {
          display: none;
        }

        .filter {
          flex: 0 0 auto;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 9px;
          background: rgba(255, 255, 255, 0.025);
          color: #77756f;
          padding: 9px 13px;
          cursor: pointer;
          font-size: 11px;
          font-weight: 800;
          transition: all 0.2s ease;
        }

        .filter:hover {
          color: #e8e2d8;
          border-color: rgba(201, 168, 120, 0.25);
        }

        .filter.active {
          border-color: rgba(201, 168, 120, 0.4);
          background: rgba(201, 168, 120, 0.1);
          color: #d8bd91;
        }

        /* ORDER GRID */

        .orders {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
        }

        /* ORDER TICKET */

        .order-card {
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.075);
          border-radius: 17px;
          background: #11110f;
          box-shadow:
            0 15px 40px rgba(0, 0, 0, 0.2),
            inset 0 1px rgba(255, 255, 255, 0.025);
          animation: ticketIn 0.35s ease both;
          transition:
            border-color 0.2s ease,
            transform 0.2s ease;
        }

        .order-card:hover {
          transform: translateY(-2px);
          border-color: rgba(201, 168, 120, 0.2);
        }

        @keyframes ticketIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .ticket-accent {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 3px;
        }

        .ticket-accent.received {
          background: #d6a94b;
        }

        .ticket-accent.preparing {
          background: #d77a3c;
        }

        .ticket-accent.ready {
          background: #5ecb83;
        }

        .ticket-accent.completed {
          background: #8882cf;
        }

        /* TICKET HEADER */

        .order-top {
          padding: 18px 18px 15px;
          border-bottom: 1px dashed rgba(255, 255, 255, 0.08);
        }

        .order-heading {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }

        .table-wrap {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .table-number {
          width: 55px;
          height: 55px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(201, 168, 120, 0.3);
          border-radius: 14px;
          background: rgba(201, 168, 120, 0.08);
          color: #c9a878;
          font-size: 24px;
          font-weight: 900;
        }

        .table-label {
          color: #6f6d67;
          font-size: 9px;
          font-weight: 850;
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }

        .table-title {
          margin-top: 2px;
          color: #eee8de;
          font-size: 17px;
          font-weight: 850;
        }

        .status {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 7px 9px;
          border-radius: 7px;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.8px;
          white-space: nowrap;
        }

        .status.received {
          background: rgba(214, 169, 75, 0.1);
          color: #e5bd63;
        }

        .status.preparing {
          background: rgba(215, 122, 60, 0.1);
          color: #e9955e;
        }

        .status.ready {
          background: rgba(94, 203, 131, 0.1);
          color: #7ee39c;
        }

        .status.completed {
          background: rgba(136, 130, 207, 0.1);
          color: #aaa5ec;
        }

        .order-meta {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          margin-top: 13px;
          color: #65635e;
          font-size: 10px;
          font-weight: 700;
        }

        .order-number {
          color: #aaa69d;
          font-family: monospace;
          letter-spacing: 0.5px;
        }

        /* ITEMS */

        .items {
          padding: 3px 18px;
        }

        .item {
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: center;
          gap: 12px;
          padding: 14px 0;
          border-bottom: 1px dashed rgba(255, 255, 255, 0.06);
        }

        .item:last-child {
          border-bottom: none;
        }

        .item-name {
          color: #e8e2d8;
          font-size: 13px;
          font-weight: 750;
          line-height: 1.35;
        }

        .item-price {
          margin-top: 4px;
          color: #62605b;
          font-size: 10px;
        }

        .quantity {
          min-width: 42px;
          height: 35px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 9px;
          background: rgba(255, 255, 255, 0.04);
          color: #f0eadf;
          font-size: 13px;
          font-weight: 900;
        }

        /* BOTTOM */

        .bottom {
          padding: 14px 18px 17px;
          border-top: 1px solid rgba(255, 255, 255, 0.055);
          background: rgba(0, 0, 0, 0.12);
        }

        .bottom-info {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
        }

        .item-count {
          color: #77746d;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.7px;
          text-transform: uppercase;
        }

        .age {
          color: #67655f;
          font-size: 10px;
        }

        .age.urgent {
          color: #dca15f;
        }

        .action {
          width: 100%;
          border: 1px solid rgba(201, 168, 120, 0.28);
          border-radius: 10px;
          padding: 12px 14px;
          background: rgba(201, 168, 120, 0.09);
          color: #d9bd91;
          font-size: 11px;
          font-weight: 850;
          letter-spacing: 0.3px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .action:hover {
          border-color: rgba(201, 168, 120, 0.5);
          background: rgba(201, 168, 120, 0.15);
          transform: translateY(-1px);
        }

        .action:disabled {
          opacity: 0.45;
          cursor: wait;
          transform: none;
        }

        .completed-message {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          min-height: 38px;
          border-radius: 10px;
          background: rgba(94, 203, 131, 0.06);
          color: #76d694;
          font-size: 11px;
          font-weight: 800;
        }

        /* EMPTY */

        .empty {
          grid-column: 1 / -1;
          min-height: 330px;
          display: grid;
          place-items: center;
          border: 1px dashed rgba(255, 255, 255, 0.09);
          border-radius: 17px;
          background: rgba(255, 255, 255, 0.015);
          text-align: center;
          padding: 35px;
        }

        .empty-icon {
          width: 60px;
          height: 60px;
          display: grid;
          place-items: center;
          margin: 0 auto 14px;
          border: 1px solid rgba(201, 168, 120, 0.15);
          border-radius: 18px;
          background: rgba(201, 168, 120, 0.05);
          font-size: 25px;
        }

        .empty-title {
          color: #d8d2c8;
          font-size: 15px;
          font-weight: 800;
        }

        .empty-text {
          margin-top: 6px;
          color: #66645e;
          font-size: 11px;
        }

        /* RESPONSIVE */

        @media (max-width: 1150px) {
          .orders {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 760px) {
          .kitchen-page {
            padding: 15px;
          }

          .topbar {
            align-items: flex-start;
          }

          .logo {
            width: 44px;
            height: 44px;
            border-radius: 13px;
          }

          .title {
            font-size: 20px;
          }

          .subtitle {
            font-size: 10px;
          }

          .live {
            padding: 8px 10px;
            font-size: 9px;
          }

          .stats {
            grid-template-columns: repeat(2, 1fr);
            gap: 9px;
            margin: 17px 0;
          }

          .stat {
            padding: 14px;
          }

          .stat-number {
            font-size: 24px;
          }

          .filter-bar {
            display: block;
          }

          .section-title {
            display: block;
            margin-bottom: 10px;
          }

          .filters {
            width: 100%;
          }

          .orders {
            grid-template-columns: 1fr;
          }

          .order-card {
            border-radius: 15px;
          }
        }

        @media (max-width: 430px) {
          .brand {
            gap: 10px;
          }

          .logo {
            display: none;
          }

          .title {
            font-size: 19px;
          }

          .live {
            padding: 7px 9px;
          }

          .table-number {
            width: 50px;
            height: 50px;
            font-size: 21px;
          }

          .table-title {
            font-size: 15px;
          }

          .status {
            padding: 6px 7px;
            font-size: 8px;
          }
        }
      `}</style>

      <div className="container">
        {/* HEADER */}

        <header className="topbar">
          <div className="brand">
            <div className="logo">✦</div>

            <div>
              <div className="eyebrow">Mysuru Socials</div>

              <h1 className="title">Kitchen Console</h1>

              <p className="subtitle">
                Live order management • Service floor
              </p>
            </div>
          </div>

          <div className="live">
            <span className="live-dot" />
            LIVE
          </div>
        </header>

        {/* STATS */}

        <section className="stats">
          <div className="stat">
            <div className="stat-label">All Orders</div>
            <div className="stat-number">{stats.all}</div>
          </div>

          <div className="stat">
            <div className="stat-label">New</div>
            <div className="stat-number">{stats.received}</div>
          </div>

          <div className="stat">
            <div className="stat-label">Preparing</div>
            <div className="stat-number">{stats.preparing}</div>
          </div>

          <div className="stat">
            <div className="stat-label">Ready</div>
            <div className="stat-number">{stats.ready}</div>
          </div>
        </section>

        {/* FILTERS */}

        <div className="filter-bar">
          <div className="section-title">Order queue</div>

          <div className="filters">
            <button
              className={`filter ${
                filter === "All" ? "active" : ""
              }`}
              onClick={() => setFilter("All")}
            >
              All · {stats.all}
            </button>

            <button
              className={`filter ${
                filter === "Received" ? "active" : ""
              }`}
              onClick={() => setFilter("Received")}
            >
              New · {stats.received}
            </button>

            <button
              className={`filter ${
                filter === "Preparing" ? "active" : ""
              }`}
              onClick={() => setFilter("Preparing")}
            >
              Cooking · {stats.preparing}
            </button>

            <button
              className={`filter ${
                filter === "Ready" ? "active" : ""
              }`}
              onClick={() => setFilter("Ready")}
            >
              Ready · {stats.ready}
            </button>

            <button
              className={`filter ${
                filter === "Completed" ? "active" : ""
              }`}
              onClick={() => setFilter("Completed")}
            >
              Completed
            </button>
          </div>
        </div>

        {/* ORDERS */}

        <section className="orders">
          {loading ? (
            <div className="empty">
              <div>
                <div className="empty-icon">◌</div>

                <div className="empty-title">
                  Loading kitchen orders
                </div>

                <div className="empty-text">
                  Connecting to the live order queue...
                </div>
              </div>
            </div>
          ) : visibleOrders.length === 0 ? (
            <div className="empty">
              <div>
                <div className="empty-icon">✓</div>

                <div className="empty-title">
                  Kitchen queue is clear
                </div>

                <div className="empty-text">
                  New customer orders will appear automatically.
                </div>
              </div>
            </div>
          ) : (
            visibleOrders.map((order) => {
              const nextStatus = getNextStatus(order.status);
              const statusInfo = statusStyles[order.status];

              const ageMinutes = Math.floor(
                (Date.now() -
                  new Date(order.created_at).getTime()) /
                  60000
              );

              return (
                <article className="order-card" key={order.id}>
                  <div
                    className={`ticket-accent ${order.status.toLowerCase()}`}
                  />

                  {/* ORDER HEADER */}

                  <div className="order-top">
                    <div className="order-heading">
                      <div className="table-wrap">
                        <div className="table-number">
                          {order.table_number}
                        </div>

                        <div>
                          <div className="table-label">
                            Table
                          </div>

                          <div className="table-title">
                            Table {order.table_number}
                          </div>
                        </div>
                      </div>

                      <div
                        className={`status ${order.status.toLowerCase()}`}
                      >
                        <span>{statusInfo.icon}</span>
                        {statusInfo.shortLabel}
                      </div>
                    </div>

                    <div className="order-meta">
                      <span className="order-number">
                        {order.order_number}
                      </span>

                      <span>
                        {formatTime(order.created_at)}
                      </span>
                    </div>
                  </div>

                  {/* ITEMS */}

                  <div className="items">
                    {order.items.map((item) => (
                      <div className="item" key={item.id}>
                        <div>
                          <div className="item-name">
                            {item.item_name}
                          </div>

                          <div className="item-price">
                            ₹
                            {Number(item.unit_price).toFixed(
                              0
                            )}{" "}
                            each
                          </div>
                        </div>

                        <div className="quantity">
                          ×{item.quantity}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* ACTION */}

                  <div className="bottom">
                    <div className="bottom-info">
                      <span className="item-count">
                        {getTotalItems(order)} item
                        {getTotalItems(order) !== 1
                          ? "s"
                          : ""}
                      </span>

                      <span
                        className={`age ${
                          ageMinutes >= 10 ? "urgent" : ""
                        }`}
                      >
                        {getAge(order.created_at)}
                      </span>
                    </div>

                    {nextStatus ? (
                      <button
                        className="action"
                        disabled={updatingId === order.id}
                        onClick={() =>
                          updateStatus(
                            order.id,
                            nextStatus
                          )
                        }
                      >
                        {updatingId === order.id
                          ? "Updating..."
                          : `Move to ${
                              statusStyles[nextStatus]
                                .label
                            }`}
                      </button>
                    ) : (
                      <div className="completed-message">
                        <span>✓</span>
                        Order completed
                      </div>
                    )}
                  </div>
                </article>
              );
            })
          )}
        </section>
      </div>
    </main>
  );
}