
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

type MenuItem = {
  id: number;
  name: string;
  price: number;
  category: string;
};

type CartItem = MenuItem & {
  quantity: number;
};

const dishes: MenuItem[] = [
  { id: 1, name: "Exotic Veg Sizzler", price: 319, category: "Sizzlers" },
  { id: 2, name: "Paneer Shashlik Sizzler", price: 319, category: "Sizzlers" },
  { id: 3, name: "Chicken Steak Sizzler", price: 329, category: "Sizzlers" },
  { id: 4, name: "Veg Fried Rice", price: 159, category: "Fried Rice" },
  { id: 5, name: "Chicken Fried Rice", price: 179, category: "Fried Rice" },
  { id: 6, name: "Seafood Fried Rice", price: 209, category: "Fried Rice" },
  { id: 7, name: "Veg Hakka Noodles", price: 159, category: "Noodles" },
  { id: 8, name: "Chicken Hakka Noodles", price: 179, category: "Noodles" },
  { id: 9, name: "Veg Manchurian Gravy", price: 159, category: "Main Course" },
  { id: 10, name: "Chicken Manchurian Gravy", price: 179, category: "Main Course" },
  { id: 11, name: "Veg Pasta", price: 279, category: "Pasta" },
  { id: 12, name: "Chicken Pasta", price: 309, category: "Pasta" },
  { id: 13, name: "Veg Lasagna", price: 279, category: "Lasagna" },
  { id: 14, name: "Chicken Lasagna", price: 309, category: "Lasagna" },
];

const categories = [
  "All",
  "Sizzlers",
  "Fried Rice",
  "Noodles",
  "Main Course",
  "Pasta",
  "Lasagna",
];

export default function OrderPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [tableNumber, setTableNumber] = useState<number | null>(null);
  const [tableId, setTableId] = useState<number | null>(null);
  const [loadingTable, setLoadingTable] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const filteredDishes = useMemo(() => {
    if (activeCategory === "All") return dishes;
    return dishes.filter((dish) => dish.category === activeCategory);
  }, [activeCategory]);

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  useEffect(() => {
    let cancelled = false;

    async function loadTable() {
      try {
        setLoadingTable(true);
        setErrorMessage("");

        const params = new URLSearchParams(window.location.search);
        const tableParam = params.get("table");

        if (!tableParam) {
          if (!cancelled) {
            setErrorMessage("Please scan the QR code at your table.");
            setLoadingTable(false);
          }
          return;
        }

        const selectedTableNumber = Number(tableParam);

        if (
          !Number.isInteger(selectedTableNumber) ||
          selectedTableNumber < 1 ||
          selectedTableNumber > 10
        ) {
          if (!cancelled) {
            setErrorMessage("Invalid table number.");
            setLoadingTable(false);
          }
          return;
        }

        if (!cancelled) setTableNumber(selectedTableNumber);

        const { data, error } = await supabase
          .from("restaurant_tables")
          .select("id, table_number")
          .eq("table_number", selectedTableNumber)
          .maybeSingle();

        console.log("TABLE RESULT:", data);
        console.log("TABLE ERROR:", error);

        if (error) {
          if (!cancelled) {
            setErrorMessage(`Supabase error: ${error.message}`);
            setLoadingTable(false);
          }
          return;
        }

        if (!data) {
          if (!cancelled) {
            setErrorMessage(
              `Table ${selectedTableNumber} does not exist in Supabase.`
            );
            setLoadingTable(false);
          }
          return;
        }

        if (!cancelled) {
          setTableId(Number(data.id));
          setLoadingTable(false);
        }
      } catch (error) {
        console.error("TABLE LOAD ERROR:", error);

        if (!cancelled) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Unable to load table information."
          );
          setLoadingTable(false);
        }
      }
    }

    loadTable();

    return () => {
      cancelled = true;
    };
  }, []);

  function addToCart(item: MenuItem) {
    setCart((current) => {
      const existing = current.find((cartItem) => cartItem.id === item.id);

      if (existing) {
        return current.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }

      return [...current, { ...item, quantity: 1 }];
    });
  }

  function decreaseQuantity(itemId: number) {
    setCart((current) =>
      current
        .map((item) =>
          item.id === itemId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function increaseQuantity(itemId: number) {
    setCart((current) =>
      current.map((item) =>
        item.id === itemId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  }

  function getQuantity(itemId: number) {
    return cart.find((item) => item.id === itemId)?.quantity ?? 0;
  }

  async function placeOrder() {
    if (placingOrder) return;

    if (!tableId) {
      setErrorMessage("Table information is not available.");
      return;
    }

    if (cart.length === 0) {
      setErrorMessage("Please add at least one item.");
      return;
    }

    setPlacingOrder(true);
    setErrorMessage("");

    try {
      let sessionId = localStorage.getItem("mysuru-socials-session-id");

      if (!sessionId) {
        sessionId = crypto.randomUUID();
        localStorage.setItem("mysuru-socials-session-id", sessionId);
      }

      const newOrderNumber =
        `MS${Date.now().toString().slice(-8)}${Math.floor(
          Math.random() * 100
        )
          .toString()
          .padStart(2, "0")}`;

      const { data: createdOrder, error: orderError } = await supabase
        .from("orders")
        .insert({
          order_number: newOrderNumber,
          table_id: tableId,
          session_id: sessionId,
          status: "Received",
          payment_status: "Pending",
        })
        .select("id, order_number")
        .single();

      if (orderError || !createdOrder) {
        console.error("ORDER CREATION FAILED:", orderError);
        throw new Error(
          orderError?.message || "Could not place your order."
        );
      }

      const orderItems = cart.map((item) => ({
        order_id: createdOrder.id,
        item_name: item.name,
        unit_price: item.price,
        quantity: item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) {
        console.error("ORDER ITEMS FAILED:", itemsError);

        await supabase
          .from("orders")
          .delete()
          .eq("id", createdOrder.id);

        throw new Error(
          itemsError.message ||
            "Could not save the items in your order."
        );
      }

      setOrderNumber(createdOrder.order_number);
      setCart([]);
      setOrderPlaced(true);
      setPlacingOrder(false);
    } catch (error) {
      console.error("PLACE ORDER ERROR:", error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong while placing your order."
      );

      setPlacingOrder(false);
    }
  }

  if (loadingTable) {
    return (
      <main className="loading-page">
        <div className="loading-spinner" />
        <h2>Preparing your order...</h2>
        <p>Connecting to your table</p>

        <style jsx>{`
          .loading-page {
            min-height: 100vh;
            background: #10090c;
            color: #f5e9ec;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 12px;
            font-family: Arial, Helvetica, sans-serif;
            padding: 24px;
            text-align: center;
          }

          .loading-spinner {
            width: 46px;
            height: 46px;
            border: 3px solid rgba(182, 92, 115, 0.2);
            border-top-color: #b65c73;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }

          h2 {
            margin: 8px 0 0;
            font-family: Georgia, "Times New Roman", serif;
            font-size: 23px;
          }

          p {
            margin: 0;
            color: #c6aeb5;
            font-size: 12px;
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

  if (errorMessage && !tableId) {
    return (
      <main className="error-page">
        <div className="error-box">
          <div className="error-icon">!</div>
          <span className="brand">MYSURU SOCIALS</span>
          <h1>Unable to load table</h1>
          <p>{errorMessage}</p>

          <button onClick={() => window.location.reload()}>
            Try Again
          </button>

          <button
            className="home-button"
            onClick={() => (window.location.href = "/")}
          >
            Go Home
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
            max-width: 430px;
            padding: 35px 25px;
            text-align: center;
            border-radius: 24px;
            background: rgba(42, 19, 27, 0.7);
            border: 1px solid rgba(217, 154, 170, 0.22);
            box-shadow: 0 20px 70px rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(22px);
          }

          .error-icon {
            width: 50px;
            height: 50px;
            margin: 0 auto 18px;
            border-radius: 50%;
            background: rgba(182, 92, 115, 0.14);
            color: #d99aaa;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 22px;
            font-weight: 900;
          }

          .brand {
            color: #d99aaa;
            font-size: 9px;
            font-weight: 900;
            letter-spacing: 2px;
          }

          h1 {
            font-family: Georgia, "Times New Roman", serif;
            font-size: 28px;
            margin: 10px 0;
          }

          p {
            color: #d0b8c0;
            font-size: 12px;
            line-height: 1.6;
            word-break: break-word;
          }

          button {
            width: 100%;
            min-height: 50px;
            margin-top: 18px;
            border: 1px solid rgba(217, 154, 170, 0.32);
            border-radius: 15px;
            background: rgba(182, 92, 115, 0.22);
            color: #fff0f4;
            font-weight: 900;
            cursor: pointer;
            backdrop-filter: blur(16px);
            box-shadow: inset 0 1px rgba(255, 255, 255, 0.12);
            transition: background 180ms ease, transform 180ms ease;
          }

          button:hover {
            background: rgba(182, 92, 115, 0.38);
            transform: translateY(-1px);
          }

          .home-button {
            margin-top: 8px;
            background: rgba(255, 255, 255, 0.04);
            color: #ead9df;
            border-color: rgba(217, 154, 170, 0.18);
          }
        `}</style>
      </main>
    );
  }

  if (orderPlaced) {
    return (
      <main className="success-page">
        <div className="success-card">
          <div className="success-icon">✓</div>
          <span className="brand">MYSURU SOCIALS</span>
          <h1>Order sent!</h1>
          <p>Your order has been sent to the kitchen.</p>

          <div className="order-number">
            <span>ORDER NUMBER</span>
            <strong>{orderNumber}</strong>
          </div>

          <div className="table-info">TABLE {tableNumber}</div>

          <Link
            className="bill-button"
            href={`/bill?table=${tableNumber}`}
          >
            View Bill →
          </Link>

          <a
            className="order-more-button"
            href={`/order?table=${tableNumber}`}
          >
            Order More
          </a>
        </div>

        <style jsx>{`
          .success-page {
            min-height: 100vh;
            background:
              radial-gradient(
                circle at 50% 0%,
                rgba(139, 41, 66, 0.3),
                transparent 42%
              ),
              #10090c;
            color: #f5e9ec;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            font-family: Arial, Helvetica, sans-serif;
          }

          .success-card {
            width: 100%;
            max-width: 430px;
            padding: 40px 25px;
            text-align: center;
            border-radius: 28px;
            background: rgba(42, 19, 27, 0.72);
            border: 1px solid rgba(217, 154, 170, 0.24);
            box-shadow: 0 24px 80px rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(24px);
          }

          .success-icon {
            width: 68px;
            height: 68px;
            margin: 0 auto 20px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(182, 92, 115, 0.18);
            border: 1px solid rgba(217, 154, 170, 0.4);
            color: #e9b6c4;
            font-size: 30px;
            font-weight: 900;
          }

          .brand {
            color: #d99aaa;
            font-size: 9px;
            font-weight: 900;
            letter-spacing: 2px;
          }

          h1 {
            font-family: Georgia, "Times New Roman", serif;
            margin: 9px 0;
            font-size: 34px;
          }

          p {
            margin: 0;
            color: #d0b8c0;
            font-size: 12px;
            line-height: 1.6;
          }

          .order-number {
            margin: 25px 0 12px;
            padding: 16px;
            border-radius: 15px;
            background: rgba(255, 255, 255, 0.045);
            border: 1px solid rgba(217, 154, 170, 0.2);
          }

          .order-number span,
          .order-number strong {
            display: block;
          }

          .order-number span {
            color: #c6aeb5;
            font-size: 8px;
            font-weight: 900;
            letter-spacing: 1.5px;
          }

          .order-number strong {
            color: #e9b6c4;
            margin-top: 7px;
            font-size: 20px;
            letter-spacing: 1px;
          }

          .table-info {
            color: #d0b8c0;
            font-size: 10px;
            font-weight: 900;
            letter-spacing: 1px;
            margin-bottom: 20px;
          }

          .bill-button,
          .order-more-button {
            width: 100%;
            min-height: 52px;
            border-radius: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            text-decoration: none;
            font-weight: 900;
            box-sizing: border-box;
            transition: background 180ms ease, transform 180ms ease;
          }

          .bill-button {
            background: rgba(182, 92, 115, 0.3);
            border: 1px solid rgba(217, 154, 170, 0.42);
            color: #fff0f4;
            backdrop-filter: blur(18px);
            box-shadow: inset 0 1px rgba(255, 255, 255, 0.13);
          }

          .order-more-button {
            margin-top: 9px;
            border: 1px solid rgba(217, 154, 170, 0.22);
            color: #ead9df;
            background: rgba(255, 255, 255, 0.04);
            backdrop-filter: blur(18px);
          }

          .bill-button:hover,
          .order-more-button:hover {
            transform: translateY(-2px);
            background: rgba(182, 92, 115, 0.4);
          }
        `}</style>
      </main>
    );
  }

  return (
    <main className="order-page">
      <header className="navbar">
        <Link href="/" className="logo">
          MYSURU <span>SOCIALS</span>
        </Link>

        <div className="table-pill">TABLE {tableNumber}</div>
      </header>

      <section className="hero">
        <span>ORDER FROM YOUR TABLE</span>

        <h1>
          Good food.
          <br />
          No waiting.
        </h1>

        <p>
          Choose your favourites and send them straight to our kitchen.
        </p>
      </section>

      <div className="category-wrapper">
        <div className="categories">
          {categories.map((category) => (
            <button
              key={category}
              className={activeCategory === category ? "active" : ""}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <section className="menu-section">
        <div className="section-heading">
          <div>
            <span>{activeCategory.toUpperCase()}</span>
            <h2>Pick your plate</h2>
          </div>

          {cartCount > 0 && (
            <div className="cart-count">
              {cartCount} ITEM{cartCount !== 1 ? "S" : ""}
            </div>
          )}
        </div>

        <div className="food-grid">
          {filteredDishes.map((dish) => {
            const quantity = getQuantity(dish.id);

            return (
              <article className="food-card" key={dish.id}>
                <div>
                  <span className="food-category">{dish.category}</span>
                  <h3>{dish.name}</h3>
                  <strong className="price">₹{dish.price}</strong>
                </div>

                {quantity === 0 ? (
                  <button
                    className="add-button"
                    onClick={() => addToCart(dish)}
                  >
                    + ADD
                  </button>
                ) : (
                  <div className="quantity-control">
                    <button
                      aria-label={`Decrease ${dish.name} quantity`}
                      onClick={() => decreaseQuantity(dish.id)}
                    >
                      −
                    </button>

                    <strong>{quantity}</strong>

                    <button
                      aria-label={`Increase ${dish.name} quantity`}
                      onClick={() => increaseQuantity(dish.id)}
                    >
                      +
                    </button>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>

      {cart.length > 0 && (
        <section className="cart-section">
          <div className="cart-header">
            <div>
              <span>YOUR ORDER</span>
              <h2>
                {cartCount} item{cartCount !== 1 ? "s" : ""}
              </h2>
            </div>

            <strong>₹{total.toFixed(2)}</strong>
          </div>

          <div className="cart-items">
            {cart.map((item) => (
              <div className="cart-item" key={item.id}>
                <div>
                  <strong>{item.name}</strong>
                  <span>
                    ₹{item.price} × {item.quantity}
                  </span>
                </div>

                <strong>
                  ₹{(item.price * item.quantity).toFixed(2)}
                </strong>
              </div>
            ))}
          </div>

          <div className="cart-total">
            <span>Total</span>
            <strong>₹{total.toFixed(2)}</strong>
          </div>

          {errorMessage && (
            <div className="order-error">{errorMessage}</div>
          )}

          <button
            className="send-button"
            onClick={placeOrder}
            disabled={placingOrder}
          >
            {placingOrder
              ? "Sending to Kitchen..."
              : "Send Order to Kitchen →"}
          </button>
        </section>
      )}

      <footer>
        <strong>MYSURU SOCIALS</strong>
        <span>Good food. Good people.</span>
      </footer>

      <style jsx>{`
        .order-page {
          min-height: 100vh;
          background:
            radial-gradient(
              circle at 15% 0%,
              rgba(139, 41, 66, 0.2),
              transparent 34%
            ),
            radial-gradient(
              circle at 90% 40%,
              rgba(84, 22, 41, 0.15),
              transparent 30%
            ),
            #10090c;
          color: #f5e9ec;
          font-family: Arial, Helvetica, sans-serif;
          padding-bottom: 60px;
        }

        .navbar {
          position: sticky;
          top: 0;
          z-index: 20;
          height: 70px;
          padding: 0 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(16, 9, 12, 0.78);
          backdrop-filter: blur(22px);
          -webkit-backdrop-filter: blur(22px);
          border-bottom: 1px solid rgba(217, 154, 170, 0.16);
        }

        .logo {
          color: #d99aaa;
          text-decoration: none;
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 2px;
        }

        .logo span {
          color: #f5e9ec;
          margin-left: 5px;
        }

        .table-pill {
          padding: 9px 12px;
          border-radius: 999px;
          color: #e9b6c4;
          background: rgba(182, 92, 115, 0.12);
          border: 1px solid rgba(217, 154, 170, 0.3);
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 1px;
          backdrop-filter: blur(12px);
        }

        .hero {
          padding: 52px 20px 35px;
          max-width: 720px;
          margin: auto;
        }

        .hero > span {
          color: #d99aaa;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 2px;
        }

        .hero h1 {
          font-family: Georgia, "Times New Roman", serif;
          color: #fff0f4;
          margin: 12px 0;
          font-size: clamp(42px, 10vw, 68px);
          line-height: 0.98;
          letter-spacing: -2px;
          font-weight: 500;
        }

        .hero p {
          max-width: 380px;
          color: #c6aeb5;
          font-size: 13px;
          line-height: 1.7;
        }

        .category-wrapper {
          position: sticky;
          top: 70px;
          z-index: 15;
          padding: 10px 16px;
          background: rgba(16, 9, 12, 0.8);
          backdrop-filter: blur(22px);
          -webkit-backdrop-filter: blur(22px);
          border-bottom: 1px solid rgba(217, 154, 170, 0.15);
          overflow-x: auto;
          scrollbar-width: none;
        }

        .category-wrapper::-webkit-scrollbar {
          display: none;
        }

        .categories {
          max-width: 720px;
          margin: auto;
          display: flex;
          gap: 7px;
          min-width: max-content;
        }

        .categories button {
          border: 1px solid rgba(217, 154, 170, 0.2);
          background: rgba(255, 255, 255, 0.045);
          color: #d0b8c0;
          border-radius: 999px;
          padding: 10px 14px;
          font-size: 10px;
          font-weight: 800;
          cursor: pointer;
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          box-shadow: inset 0 1px rgba(255, 255, 255, 0.06);
          transition: background 180ms ease, border-color 180ms ease,
            color 180ms ease, transform 180ms ease;
        }

        .categories button:hover {
          background: rgba(182, 92, 115, 0.16);
          border-color: rgba(217, 154, 170, 0.42);
          color: #fff0f4;
        }

        .categories button.active {
          background: rgba(139, 41, 66, 0.55);
          border-color: rgba(217, 154, 170, 0.55);
          color: #fff0f4;
          box-shadow: inset 0 1px rgba(255, 255, 255, 0.12);
        }

        .menu-section {
          max-width: 720px;
          margin: auto;
          padding: 40px 18px 0;
        }

        .section-heading {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 12px;
          margin-bottom: 18px;
        }

        .section-heading span {
          color: #c6aeb5;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 1.5px;
        }

        .section-heading h2 {
          font-family: Georgia, "Times New Roman", serif;
          color: #fff0f4;
          margin: 5px 0 0;
          font-size: 27px;
          font-weight: 500;
        }

        .cart-count {
          color: #e9b6c4 !important;
          font-size: 10px;
          white-space: nowrap;
        }

        .food-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }

        .food-card {
          min-height: 220px;
          padding: 16px;
          border-radius: 20px;
          background: linear-gradient(
            145deg,
            rgba(67, 29, 41, 0.62),
            rgba(31, 16, 22, 0.72)
          );
          border: 1px solid rgba(217, 154, 170, 0.19);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-shadow: inset 0 1px rgba(255, 255, 255, 0.045);
          transition: transform 180ms ease, border-color 180ms ease,
            background 180ms ease;
        }

        .food-card:hover {
          transform: translateY(-2px);
          border-color: rgba(217, 154, 170, 0.36);
          background: linear-gradient(
            145deg,
            rgba(75, 31, 45, 0.72),
            rgba(35, 17, 24, 0.8)
          );
        }

        .food-category {
          color: #c6aeb5;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .food-card h3 {
          font-family: Georgia, "Times New Roman", serif;
          color: #fff0f4;
          margin: 10px 0;
          font-size: 17px;
          line-height: 1.3;
          font-weight: 500;
        }

        .price {
          color: #e9b6c4;
          font-size: 14px;
        }

        .add-button {
          width: 100%;
          min-height: 42px;
          border: 1px solid rgba(217, 154, 170, 0.36);
          border-radius: 13px;
          background: rgba(182, 92, 115, 0.15);
          color: #f8e4e9;
          font-weight: 900;
          cursor: pointer;
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          box-shadow: inset 0 1px rgba(255, 255, 255, 0.12);
          transition: background 180ms ease, transform 180ms ease;
        }

        .add-button:hover {
          background: rgba(182, 92, 115, 0.32);
          transform: translateY(-1px);
        }

        .quantity-control {
          height: 42px;
          border-radius: 13px;
          background: rgba(255, 255, 255, 0.055);
          border: 1px solid rgba(217, 154, 170, 0.28);
          display: flex;
          align-items: center;
          justify-content: space-between;
          overflow: hidden;
          backdrop-filter: blur(14px);
        }

        .quantity-control button {
          width: 42px;
          height: 100%;
          border: 0;
          background: transparent;
          color: #e9b6c4;
          font-size: 21px;
          cursor: pointer;
          transition: background 180ms ease;
        }

        .quantity-control button:hover {
          background: rgba(182, 92, 115, 0.2);
        }

        .quantity-control strong {
          color: #fff0f4;
          font-size: 13px;
        }

        .cart-section {
          position: sticky;
          bottom: 12px;
          z-index: 25;
          max-width: 680px;
          margin: 35px auto 0;
          padding: 20px;
          border-radius: 24px;
          background: rgba(35, 17, 24, 0.86);
          border: 1px solid rgba(217, 154, 170, 0.28);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.42),
            inset 0 1px rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(26px);
          -webkit-backdrop-filter: blur(26px);
        }

        .cart-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 12px;
        }

        .cart-header span {
          color: #c6aeb5;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 1.5px;
        }

        .cart-header h2 {
          font-family: Georgia, "Times New Roman", serif;
          color: #fff0f4;
          margin: 5px 0 0;
          font-size: 24px;
          font-weight: 500;
        }

        .cart-header > strong {
          color: #e9b6c4;
          font-size: 22px;
        }

        .cart-items {
          margin-top: 18px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .cart-item {
          display: flex;
          justify-content: space-between;
          gap: 15px;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(217, 154, 170, 0.13);
        }

        .cart-item div {
          min-width: 0;
        }

        .cart-item strong,
        .cart-item span {
          display: block;
        }

        .cart-item strong {
          color: #f5e9ec;
          font-size: 12px;
        }

        .cart-item span {
          color: #c6aeb5;
          margin-top: 4px;
          font-size: 10px;
        }

        .cart-total {
          display: flex;
          justify-content: space-between;
          padding: 15px 0;
          color: #d0b8c0;
          font-size: 12px;
        }

        .cart-total strong {
          color: #e9b6c4;
          font-size: 18px;
        }

        .order-error {
          margin-bottom: 10px;
          padding: 12px;
          border-radius: 12px;
          background: rgba(182, 92, 115, 0.12);
          border: 1px solid rgba(217, 154, 170, 0.3);
          color: #ffd4de;
          font-size: 10px;
          line-height: 1.5;
        }

        .send-button {
          width: 100%;
          min-height: 54px;
          border: 1px solid rgba(217, 154, 170, 0.42);
          border-radius: 15px;
          background: rgba(139, 41, 66, 0.55);
          color: #fff0f4;
          font-size: 13px;
          font-weight: 900;
          cursor: pointer;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          box-shadow: inset 0 1px rgba(255, 255, 255, 0.15),
            0 8px 25px rgba(0, 0, 0, 0.16);
          transition: background 180ms ease, transform 180ms ease;
        }

        .send-button:hover:not(:disabled) {
          background: rgba(182, 92, 115, 0.52);
          transform: translateY(-1px);
        }

        .send-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        footer {
          max-width: 720px;
          margin: 50px auto 0;
          padding: 0 18px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
          color: #c6aeb5;
          font-size: 10px;
        }

        footer strong {
          color: #d99aaa;
          letter-spacing: 1px;
        }

        footer span {
          color: #c6aeb5;
        }

        @media (max-width: 520px) {
          .food-grid {
            grid-template-columns: 1fr;
          }

          .food-card {
            min-height: 190px;
          }

          .hero h1 {
            letter-spacing: -1px;
          }

          .cart-section {
            margin-left: 10px;
            margin-right: 10px;
            bottom: 8px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </main>
  );
}

