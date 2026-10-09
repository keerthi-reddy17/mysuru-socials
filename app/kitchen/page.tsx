
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
  { label: string; shortLabel: string; icon: string }
> = {
  Received: { label: "New Order", shortLabel: "NEW", icon: "●" },
  Preparing: { label: "Preparing", shortLabel: "COOKING", icon: "◐" },
  Ready: { label: "Ready", shortLabel: "READY", icon: "✓" },
  Completed: { label: "Completed", shortLabel: "DONE", icon: "✓" },
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
    void loadOrders();

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
          void loadOrders();
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
          void loadOrders();
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
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
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );

    setUpdatingId(null);
  }

  function getNextStatus(status: Order["status"]): Order["status"] | null {
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
    return order.items.reduce((total, item) => total + item.quantity, 0);
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
    received: orders.filter((order) => order.status === "Received").length,
    preparing: orders.filter((order) => order.status === "Preparing").length,
    ready: orders.filter((order) => order.status === "Ready").length,
  };

  return (
    <main className="kitchen-page">
      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .kitchen-page {
          min-height: 100vh;
          padding: 26px;
          color: #f5e9ec;
          font-family: Arial, Helvetica, sans-serif;
          background:
            radial-gradient(
              circle at 8% 0%,
              rgba(139, 41, 66, 0.2),
              transparent 32%
            ),
            radial-gradient(
              circle at 95% 8%,
              rgba(182, 92, 115, 0.1),
              transparent 28%
            ),
            #10090c;
        }

        .container {
          width: 100%;
          max-width: 1500px;
          margin: 0 auto;
        }

        .topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 5px 0 25px;
          border-bottom: 1px solid rgba(217, 154, 170, 0.17);
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .logo {
          display: grid;
          width: 52px;
          height: 52px;
          place-items: center;
          border: 1px solid rgba(217, 154, 170, 0.3);
          border-radius: 16px;
          color: #e6a8b8;
          background: linear-gradient(
            145deg,
            rgba(139, 41, 66, 0.48),
            rgba(84, 22, 41, 0.22)
          );
          box-shadow: inset 0 1px rgba(255, 255, 255, 0.08);
          font-size: 24px;
        }

        .eyebrow {
          margin-bottom: 5px;
          color: #d99aaa;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 2.5px;
          text-transform: uppercase;
        }

        .title {
          margin: 0;
          color: #fff0f3;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 30px;
          font-weight: 500;
          line-height: 1.15;
          letter-spacing: -0.5px;
        }

        .subtitle {
          margin: 7px 0 0;
          color: #c6aeb5;
          font-size: 12px;
        }

        .live {
          display: inline-flex;
          flex-shrink: 0;
          align-items: center;
          gap: 9px;
          padding: 10px 14px;
          border: 1px solid rgba(126, 227, 156, 0.23);
          border-radius: 999px;
          background: rgba(126, 227, 156, 0.06);
          color: #9ae5b0;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1.5px;
          backdrop-filter: blur(12px);
        }

        .live-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #75d994;
          box-shadow: 0 0 12px rgba(117, 217, 148, 0.65);
          animation: livePulse 1.5s ease-in-out infinite;
        }

        @keyframes livePulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.45;
            transform: scale(0.7);
          }
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 13px;
          margin: 24px 0;
        }

        .stat {
          position: relative;
          overflow: hidden;
          padding: 19px;
          border: 1px solid rgba(217, 154, 170, 0.16);
          border-radius: 17px;
          background: linear-gradient(
            145deg,
            rgba(139, 41, 66, 0.16),
            rgba(255, 255, 255, 0.025)
          );
          box-shadow:
            0 12px 30px rgba(0, 0, 0, 0.16),
            inset 0 1px rgba(255, 255, 255, 0.045);
          backdrop-filter: blur(16px);
        }

        .stat::after {
          position: absolute;
          right: 0;
          bottom: 0;
          left: 0;
          height: 2px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(182, 92, 115, 0.8),
            transparent
          );
          content: "";
        }

        .stat-label {
          color: #c6aeb5;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }

        .stat-number {
          margin-top: 9px;
          color: #fff0f3;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 34px;
          line-height: 1;
        }

        .filter-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          margin-bottom: 18px;
        }

        .section-title {
          color: #f0d9df;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 19px;
          white-space: nowrap;
        }

        .filters {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 3px;
        }

        .filters::-webkit-scrollbar {
          display: none;
        }

        .filter {
          flex: 0 0 auto;
          padding: 10px 13px;
          border: 1px solid rgba(217, 154, 170, 0.16);
          border-radius: 11px;
          color: #c6aeb5;
          background: rgba(255, 255, 255, 0.035);
          backdrop-filter: blur(12px);
          cursor: pointer;
          font-family: Arial, Helvetica, sans-serif;
          font-size: 11px;
          font-weight: 700;
          transition:
            color 0.2s ease,
            border-color 0.2s ease,
            background 0.2s ease,
            transform 0.2s ease;
        }

        .filter:hover {
          color: #fff0f3;
          border-color: rgba(217, 154, 170, 0.38);
          transform: translateY(-1px);
        }

        .filter.active {
          border-color: rgba(217, 154, 170, 0.5);
          color: #fff0f3;
          background: linear-gradient(
            135deg,
            rgba(139, 41, 66, 0.62),
            rgba(84, 22, 41, 0.45)
          );
          box-shadow: inset 0 1px rgba(255, 255, 255, 0.08);
        }

        .orders {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 15px;
          align-items: start;
        }

        .order-card {
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(217, 154, 170, 0.17);
          border-radius: 18px;
          background: linear-gradient(
            155deg,
            rgba(84, 22, 41, 0.3),
            rgba(255, 255, 255, 0.025) 55%,
            rgba(139, 41, 66, 0.07)
          );
          box-shadow:
            0 16px 40px rgba(0, 0, 0, 0.22),
            inset 0 1px rgba(255, 255, 255, 0.045);
          backdrop-filter: blur(18px);
          animation: ticketIn 0.35s ease both;
          transition:
            border-color 0.2s ease,
            transform 0.2s ease;
        }

        .order-card:hover {
          transform: translateY(-3px);
          border-color: rgba(217, 154, 170, 0.36);
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
          background: #d99aaa;
        }

        .ticket-accent.preparing {
          background: #c8798d;
        }

        .ticket-accent.ready {
          background: #78d69b;
        }

        .ticket-accent.completed {
          background: #b7a2e7;
        }

        .order-top {
          padding: 19px 18px 15px;
          border-bottom: 1px dashed rgba(217, 154, 170, 0.2);
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
          display: grid;
          width: 55px;
          height: 55px;
          flex-shrink: 0;
          place-items: center;
          border: 1px solid rgba(217, 154, 170, 0.3);
          border-radius: 15px;
          color: #f1bdca;
          background: linear-gradient(
            145deg,
            rgba(139, 41, 66, 0.5),
            rgba(84, 22, 41, 0.26)
          );
          font-family: Georgia, "Times New Roman", serif;
          font-size: 25px;
        }

        .table-label {
          color: #c6aeb5;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }

        .table-title {
          margin-top: 4px;
          color: #fff0f3;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 18px;
        }

        .status {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 7px 9px;
          border: 1px solid transparent;
          border-radius: 8px;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.8px;
          white-space: nowrap;
        }

        .status.received {
          border-color: rgba(217, 154, 170, 0.22);
          color: #f0bac8;
          background: rgba(139, 41, 66, 0.2);
        }

        .status.preparing {
          border-color: rgba(200, 121, 141, 0.22);
          color: #e8a3b4;
          background: rgba(139, 41, 66, 0.28);
        }

        .status.ready {
          border-color: rgba(120, 214, 155, 0.22);
          color: #94e2ad;
          background: rgba(120, 214, 155, 0.08);
        }

        .status.completed {
          border-color: rgba(183, 162, 231, 0.22);
          color: #c6b6f0;
          background: rgba(183, 162, 231, 0.08);
        }

        .order-meta {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          margin-top: 14px;
          color: #c6aeb5;
          font-size: 10px;
          font-weight: 600;
        }

        .order-number {
          color: #e1bdc7;
          font-family: monospace;
          letter-spacing: 0.5px;
        }

        .items {
          padding: 3px 18px;
        }

        .item {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          align-items: center;
          gap: 12px;
          padding: 14px 0;
          border-bottom: 1px dashed rgba(217, 154, 170, 0.13);
        }

        .item:last-child {
          border-bottom: none;
        }

        .item-name {
          color: #f5e9ec;
          font-size: 13px;
          font-weight: 700;
          line-height: 1.4;
          overflow-wrap: anywhere;
        }

        .item-price {
          margin-top: 5px;
          color: #c6aeb5;
          font-size: 10px;
        }

        .quantity {
          display: grid;
          min-width: 43px;
          height: 36px;
          place-items: center;
          padding: 0 8px;
          border: 1px solid rgba(217, 154, 170, 0.2);
          border-radius: 10px;
          color: #f5e9ec;
          background: rgba(139, 41, 66, 0.17);
          font-size: 13px;
          font-weight: 800;
        }

        .bottom {
          padding: 15px 18px 18px;
          border-top: 1px solid rgba(217, 154, 170, 0.13);
          background: rgba(16, 9, 12, 0.2);
        }

        .bottom-info {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 12px;
        }

        .item-count {
          color: #d9bac3;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.8px;
          text-transform: uppercase;
        }

        .age {
          color: #c6aeb5;
          font-size: 10px;
        }

        .age.urgent {
          color: #f0a8b8;
          font-weight: 800;
        }

        .action {
          width: 100%;
          padding: 12px 14px;
          border: 1px solid rgba(217, 154, 170, 0.38);
          border-radius: 11px;
          color: #fff0f3;
          background: linear-gradient(
            135deg,
            rgba(139, 41, 66, 0.72),
            rgba(84, 22, 41, 0.65)
          );
          box-shadow:
            inset 0 1px rgba(255, 255, 255, 0.09),
            0 5px 15px rgba(0, 0, 0, 0.13);
          backdrop-filter: blur(12px);
          cursor: pointer;
          font-family: Arial, Helvetica, sans-serif;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.3px;
          transition:
            border-color 0.2s ease,
            background 0.2s ease,
            transform 0.2s ease;
        }

        .action:hover {
          border-color: rgba(217, 154, 170, 0.65);
          background: linear-gradient(
            135deg,
            rgba(166, 53, 81, 0.8),
            rgba(102, 27, 49, 0.75)
          );
          transform: translateY(-1px);
        }

        .action:disabled {
          opacity: 0.55;
          cursor: wait;
          transform: none;
        }

        .completed-message {
          display: flex;
          min-height: 40px;
          align-items: center;
          justify-content: center;
          gap: 7px;
          border: 1px solid rgba(120, 214, 155, 0.17);
          border-radius: 11px;
          color: #94e2ad;
          background: rgba(120, 214, 155, 0.055);
          font-size: 11px;
          font-weight: 800;
        }

        .empty {
          grid-column: 1 / -1;
          display: grid;
          min-height: 330px;
          place-items: center;
          padding: 35px;
          border: 1px dashed rgba(217, 154, 170, 0.23);
          border-radius: 18px;
          background: rgba(139, 41, 66, 0.07);
          text-align: center;
          backdrop-filter: blur(14px);
        }

        .empty-icon {
          display: grid;
          width: 62px;
          height: 62px;
          place-items: center;
          margin: 0 auto 17px;
          border: 1px solid rgba(217, 154, 170, 0.27);
          border-radius: 19px;
          color: #e6a8b8;
          background: rgba(139, 41, 66, 0.2);
          font-size: 26px;
        }

        .empty-title {
          color: #fff0f3;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 20px;
        }

        .empty-text {
          margin-top: 8px;
          color: #c6aeb5;
          font-size: 12px;
          line-height: 1.6;
        }

        button:focus-visible {
          outline: 2px solid #e6a8b8;
          outline-offset: 3px;
        }

        @media (max-width: 1150px) {
          .orders {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 760px) {
          .kitchen-page {
            padding: 16px;
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
            font-size: 25px;
          }

          .subtitle {
            max-width: 230px;
            font-size: 11px;
            line-height: 1.5;
          }

          .live {
            padding: 8px 10px;
            font-size: 9px;
          }

          .stats {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 10px;
            margin: 18px 0 22px;
          }

          .stat {
            padding: 16px;
          }

          .stat-number {
            font-size: 29px;
          }

          .filter-bar {
            display: block;
          }

          .section-title {
            display: block;
            margin-bottom: 12px;
          }

          .filters {
            width: 100%;
          }

          .orders {
            grid-template-columns: 1fr;
          }

          .order-card {
            border-radius: 16px;
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
            font-size: 22px;
          }

          .live {
            gap: 6px;
            padding: 7px 9px;
          }

          .table-number {
            width: 49px;
            height: 49px;
            font-size: 22px;
          }

          .table-title {
            font-size: 16px;
          }

          .status {
            padding: 6px 7px;
            font-size: 8px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .live-dot,
          .order-card {
            animation: none;
          }

          .order-card,
          .filter,
          .action {
            transition: none;
          }
        }
      `}</style>

      <div className="container">
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

        <div className="filter-bar">
          <div className="section-title">Order queue</div>

          <div className="filters">
            <button
              className={`filter ${filter === "All" ? "active" : ""}`}
              onClick={() => setFilter("All")}
            >
              All · {stats.all}
            </button>

            <button
              className={`filter ${filter === "Received" ? "active" : ""}`}
              onClick={() => setFilter("Received")}
            >
              New · {stats.received}
            </button>

            <button
              className={`filter ${filter === "Preparing" ? "active" : ""}`}
              onClick={() => setFilter("Preparing")}
            >
              Cooking · {stats.preparing}
            </button>

            <button
              className={`filter ${filter === "Ready" ? "active" : ""}`}
              onClick={() => setFilter("Ready")}
            >
              Ready · {stats.ready}
            </button>

            <button
              className={`filter ${filter === "Completed" ? "active" : ""}`}
              onClick={() => setFilter("Completed")}
            >
              Completed
            </button>
          </div>
        </div>

        <section className="orders">
          {loading ? (
            <div className="empty">
              <div>
                <div className="empty-icon">◌</div>
                <div className="empty-title">Loading kitchen orders</div>
                <div className="empty-text">
                  Connecting to the live order queue...
                </div>
              </div>
            </div>
          ) : visibleOrders.length === 0 ? (
            <div className="empty">
              <div>
                <div className="empty-icon">✓</div>
                <div className="empty-title">Kitchen queue is clear</div>
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
                (Date.now() - new Date(order.created_at).getTime()) / 60000
              );

              return (
                <article className="order-card" key={order.id}>
                  <div
                    className={`ticket-accent ${order.status.toLowerCase()}`}
                  />

                  <div className="order-top">
                    <div className="order-heading">
                      <div className="table-wrap">
                        <div className="table-number">
                          {order.table_number}
                        </div>

                        <div>
                          <div className="table-label">Table</div>
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
                      <span>{formatTime(order.created_at)}</span>
                    </div>
                  </div>

                  <div className="items">
                    {order.items.map((item) => (
                      <div className="item" key={item.id}>
                        <div>
                          <div className="item-name">{item.item_name}</div>
                          <div className="item-price">
                            ₹{Number(item.unit_price).toFixed(0)} each
                          </div>
                        </div>

                        <div className="quantity">×{item.quantity}</div>
                      </div>
                    ))}
                  </div>

                  <div className="bottom">
                    <div className="bottom-info">
                      <span className="item-count">
                        {getTotalItems(order)} item
                        {getTotalItems(order) !== 1 ? "s" : ""}
                      </span>

                      <span className={`age ${ageMinutes >= 10 ? "urgent" : ""}`}>
                        {getAge(order.created_at)}
                      </span>
                    </div>

                    {nextStatus ? (
                      <button
                        className="action"
                        disabled={updatingId === order.id}
                        onClick={() => updateStatus(order.id, nextStatus)}
                      >
                        {updatingId === order.id
                          ? "Updating..."
                          : `Move to ${statusStyles[nextStatus].label}`}
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

