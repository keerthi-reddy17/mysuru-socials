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
  {
    id: 1,
    name: "Exotic Veg Sizzler",
    price: 319,
    category: "Sizzlers",
  },
  {
    id: 2,
    name: "Paneer Shashlik Sizzler",
    price: 319,
    category: "Sizzlers",
  },
  {
    id: 3,
    name: "Chicken Steak Sizzler",
    price: 329,
    category: "Sizzlers",
  },
  {
    id: 4,
    name: "Veg Fried Rice",
    price: 159,
    category: "Fried Rice",
  },
  {
    id: 5,
    name: "Chicken Fried Rice",
    price: 179,
    category: "Fried Rice",
  },
  {
    id: 6,
    name: "Seafood Fried Rice",
    price: 209,
    category: "Fried Rice",
  },
  {
    id: 7,
    name: "Veg Hakka Noodles",
    price: 159,
    category: "Noodles",
  },
  {
    id: 8,
    name: "Chicken Hakka Noodles",
    price: 179,
    category: "Noodles",
  },
  {
    id: 9,
    name: "Veg Manchurian Gravy",
    price: 159,
    category: "Main Course",
  },
  {
    id: 10,
    name: "Chicken Manchurian Gravy",
    price: 179,
    category: "Main Course",
  },
  {
    id: 11,
    name: "Veg Pasta",
    price: 279,
    category: "Pasta",
  },
  {
    id: 12,
    name: "Chicken Pasta",
    price: 309,
    category: "Pasta",
  },
  {
    id: 13,
    name: "Veg Lasagna",
    price: 279,
    category: "Lasagna",
  },
  {
    id: 14,
    name: "Chicken Lasagna",
    price: 309,
    category: "Lasagna",
  },
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
  const [activeCategory, setActiveCategory] =
    useState("All");

  const [cart, setCart] =
    useState<CartItem[]>([]);

  const [tableNumber, setTableNumber] =
    useState<number | null>(null);

  const [tableId, setTableId] =
    useState<number | null>(null);

  const [loadingTable, setLoadingTable] =
    useState(true);

  const [placingOrder, setPlacingOrder] =
    useState(false);

  const [orderPlaced, setOrderPlaced] =
    useState(false);

  const [orderNumber, setOrderNumber] =
    useState("");

  const [errorMessage, setErrorMessage] =
    useState("");

  const filteredDishes = useMemo(() => {
    if (activeCategory === "All") {
      return dishes;
    }

    return dishes.filter(
      (dish) =>
        dish.category === activeCategory
    );
  }, [activeCategory]);

  const cartCount = useMemo(() => {
    return cart.reduce(
      (sum, item) =>
        sum + item.quantity,
      0
    );
  }, [cart]);

  const total = useMemo(() => {
    return cart.reduce(
      (sum, item) =>
        sum +
        item.price *
          item.quantity,
      0
    );
  }, [cart]);

  useEffect(() => {
    let cancelled = false;

    async function loadTable() {
      try {
        setLoadingTable(true);
        setErrorMessage("");

        const params =
          new URLSearchParams(
            window.location.search
          );

        const tableParam =
          params.get("table");

        if (!tableParam) {
          if (!cancelled) {
            setErrorMessage(
              "Please scan the QR code at your table."
            );
            setLoadingTable(false);
          }
          return;
        }

        const selectedTableNumber =
          Number(tableParam);

        if (
          !Number.isInteger(
            selectedTableNumber
          ) ||
          selectedTableNumber < 1 ||
          selectedTableNumber > 10
        ) {
          if (!cancelled) {
            setErrorMessage(
              "Invalid table number."
            );
            setLoadingTable(false);
          }
          return;
        }

        if (!cancelled) {
          setTableNumber(
            selectedTableNumber
          );
        }

        const {
          data,
          error,
        } = await supabase
          .from(
            "restaurant_tables"
          )
          .select(
            "id, table_number"
          )
          .eq(
            "table_number",
            selectedTableNumber
          )
          .maybeSingle();

        console.log(
          "TABLE RESULT:",
          data
        );

        console.log(
          "TABLE ERROR:",
          error
        );

        if (error) {
          if (!cancelled) {
            setErrorMessage(
              `Supabase error: ${error.message}`
            );
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
          setTableId(
            Number(data.id)
          );
          setLoadingTable(false);
        }
      } catch (error) {
        console.error(
          "TABLE LOAD ERROR:",
          error
        );

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

  function addToCart(
    item: MenuItem
  ) {
    setCart((current) => {
      const existing =
        current.find(
          (cartItem) =>
            cartItem.id ===
            item.id
        );

      if (existing) {
        return current.map(
          (cartItem) =>
            cartItem.id ===
            item.id
              ? {
                  ...cartItem,
                  quantity:
                    cartItem.quantity +
                    1,
                }
              : cartItem
        );
      }

      return [
        ...current,
        {
          ...item,
          quantity: 1,
        },
      ];
    });
  }

  function decreaseQuantity(
    itemId: number
  ) {
    setCart((current) =>
      current
        .map((item) =>
          item.id === itemId
            ? {
                ...item,
                quantity:
                  item.quantity - 1,
              }
            : item
        )
        .filter(
          (item) =>
            item.quantity > 0
        )
    );
  }

  function increaseQuantity(
    itemId: number
  ) {
    setCart((current) =>
      current.map((item) =>
        item.id === itemId
          ? {
              ...item,
              quantity:
                item.quantity + 1,
            }
          : item
      )
    );
  }

  function getQuantity(
    itemId: number
  ) {
    return (
      cart.find(
        (item) =>
          item.id === itemId
      )?.quantity ?? 0
    );
  }

  async function placeOrder() {
    if (placingOrder) {
      return;
    }

    if (!tableId) {
      setErrorMessage(
        "Table information is not available."
      );
      return;
    }

    if (cart.length === 0) {
      setErrorMessage(
        "Please add at least one item."
      );
      return;
    }

    setPlacingOrder(true);
    setErrorMessage("");

    try {
      let sessionId =
        localStorage.getItem(
          "mysuru-socials-session-id"
        );

      if (!sessionId) {
        sessionId =
          crypto.randomUUID();

        localStorage.setItem(
          "mysuru-socials-session-id",
          sessionId
        );
      }

      const newOrderNumber =
        `MS${Date.now()
          .toString()
          .slice(-8)}${Math.floor(
          Math.random() * 100
        )
          .toString()
          .padStart(2, "0")}`;

      const {
        data: createdOrder,
        error: orderError,
      } = await supabase
        .from("orders")
        .insert({
          order_number:
            newOrderNumber,
          table_id: tableId,
          session_id: sessionId,
          status: "Received",
          payment_status:
            "Pending",
        })
        .select(
          "id, order_number"
        )
        .single();

      if (
        orderError ||
        !createdOrder
      ) {
        console.error(
          "ORDER CREATION FAILED:",
          orderError
        );

        throw new Error(
          orderError?.message ||
            "Could not place your order."
        );
      }

      const orderItems =
        cart.map((item) => ({
          order_id:
            createdOrder.id,
          item_name:
            item.name,
          unit_price:
            item.price,
          quantity:
            item.quantity,
        }));

      const {
        error: itemsError,
      } = await supabase
        .from("order_items")
        .insert(
          orderItems
        );

      if (itemsError) {
        console.error(
          "ORDER ITEMS FAILED:",
          itemsError
        );

        await supabase
          .from("orders")
          .delete()
          .eq(
            "id",
            createdOrder.id
          );

        throw new Error(
          itemsError.message ||
            "Could not save the items in your order."
        );
      }

      setOrderNumber(
        createdOrder.order_number
      );

      setCart([]);

      setOrderPlaced(true);
      setPlacingOrder(false);
    } catch (error) {
      console.error(
        "PLACE ORDER ERROR:",
        error
      );

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

        <h2>
          Preparing your order...
        </h2>

        <p>
          Connecting to your table
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
            gap: 12px;
            font-family: Arial,
              Helvetica, sans-serif;
            padding: 24px;
            text-align: center;
          }

          .loading-spinner {
            width: 46px;
            height: 46px;
            border: 3px solid
              rgba(
                201,
                168,
                120,
                0.18
              );
            border-top-color: #c9a878;
            border-radius: 50%;
            animation: spin
              0.8s linear infinite;
          }

          h2 {
            margin: 8px 0 0;
            font-size: 20px;
          }

          p {
            margin: 0;
            color: #666;
            font-size: 12px;
          }

          @keyframes spin {
            to {
              transform: rotate(
                360deg
              );
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
          <div className="error-icon">
            !
          </div>

          <span className="brand">
            MYSURU SOCIALS
          </span>

          <h1>
            Unable to load table
          </h1>

          <p>
            {errorMessage}
          </p>

          <button
            onClick={() =>
              window.location.reload()
            }
          >
            Try Again
          </button>

          <button
            className="home-button"
            onClick={() =>
              (window.location.href =
                "/")
            }
          >
            Go Home
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
            font-family: Arial,
              Helvetica, sans-serif;
          }

          .error-box {
            width: 100%;
            max-width: 430px;
            padding: 35px 25px;
            text-align: center;
            border-radius: 24px;
            background: #111217;
            border: 1px solid #292a31;
          }

          .error-icon {
            width: 50px;
            height: 50px;
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
            font-size: 22px;
            font-weight: 900;
          }

          .brand {
            color: #c9a878;
            font-size: 9px;
            font-weight: 900;
            letter-spacing: 2px;
          }

          h1 {
            font-size: 22px;
            margin: 10px 0;
          }

          p {
            color: #777;
            font-size: 12px;
            line-height: 1.6;
            word-break: break-word;
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

          .home-button {
            margin-top: 8px;
            background: transparent;
            color: #888;
            border: 1px solid #292a31;
          }
        `}</style>
      </main>
    );
  }

  if (orderPlaced) {
    return (
      <main className="success-page">
        <div className="success-card">
          <div className="success-icon">
            ✓
          </div>

          <span className="brand">
            MYSURU SOCIALS
          </span>

          <h1>
            Order sent!
          </h1>

          <p>
            Your order has been sent
            to the kitchen.
          </p>

          <div className="order-number">
            <span>
              ORDER NUMBER
            </span>

            <strong>
              {orderNumber}
            </strong>
          </div>

          <div className="table-info">
            TABLE {tableNumber}
          </div>

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
                rgba(
                  201,
                  168,
                  120,
                  0.12
                ),
                transparent 35%
              ),
              #08090c;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            font-family: Arial,
              Helvetica, sans-serif;
          }

          .success-card {
            width: 100%;
            max-width: 430px;
            padding: 40px 25px;
            text-align: center;
            border-radius: 28px;
            background: #111217;
            border: 1px solid #292a31;
          }

          .success-icon {
            width: 68px;
            height: 68px;
            margin: 0 auto 20px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(
              126,
              226,
              168,
              0.1
            );
            border: 1px solid
              rgba(
                126,
                226,
                168,
                0.25
              );
            color: #7ee2a8;
            font-size: 30px;
            font-weight: 900;
          }

          .brand {
            color: #c9a878;
            font-size: 9px;
            font-weight: 900;
            letter-spacing: 2px;
          }

          h1 {
            margin: 9px 0;
            font-size: 30px;
          }

          p {
            margin: 0;
            color: #777;
            font-size: 12px;
          }

          .order-number {
            margin: 25px 0 12px;
            padding: 16px;
            border-radius: 15px;
            background: #18191e;
            border: 1px solid #292a31;
          }

          .order-number span,
          .order-number strong {
            display: block;
          }

          .order-number span {
            color: #666;
            font-size: 8px;
            font-weight: 900;
            letter-spacing: 1.5px;
          }

          .order-number strong {
            color: #c9a878;
            margin-top: 7px;
            font-size: 20px;
            letter-spacing: 1px;
          }

          .table-info {
            color: #888;
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
          }

          .bill-button {
            background: #c9a878;
            color: #11100e;
          }

          .order-more-button {
            margin-top: 9px;
            border: 1px solid #292a31;
            color: #888;
            background: transparent;
          }
        `}</style>
      </main>
    );
  }

  return (
    <main className="order-page">
      <header className="navbar">
        <Link
          href="/"
          className="logo"
        >
          MYSURU
          <span>SOCIALS</span>
        </Link>

        <div className="table-pill">
          TABLE {tableNumber}
        </div>
      </header>

      <section className="hero">
        <span>
          ORDER FROM YOUR TABLE
        </span>

        <h1>
          Good food.
          <br />
          No waiting.
        </h1>

        <p>
          Choose your favourites
          and send them straight
          to our kitchen.
        </p>
      </section>

      <div className="category-wrapper">
        <div className="categories">
          {categories.map(
            (category) => (
              <button
                key={category}
                className={
                  activeCategory ===
                  category
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setActiveCategory(
                    category
                  )
                }
              >
                {category}
              </button>
            )
          )}
        </div>
      </div>

      <section className="menu-section">
        <div className="section-heading">
          <div>
            <span>
              {activeCategory.toUpperCase()}
            </span>

            <h2>
              Pick your plate
            </h2>
          </div>

          {cartCount > 0 && (
            <div className="cart-count">
              {cartCount} ITEM
              {cartCount !== 1
                ? "S"
                : ""}
            </div>
          )}
        </div>

        <div className="food-grid">
          {filteredDishes.map(
            (dish) => {
              const quantity =
                getQuantity(
                  dish.id
                );

              return (
                <article
                  className="food-card"
                  key={dish.id}
                >
                  <div>
                    <span className="food-category">
                      {dish.category}
                    </span>

                    <h3>
                      {dish.name}
                    </h3>

                    <strong className="price">
                      ₹{dish.price}
                    </strong>
                  </div>

                  {quantity ===
                  0 ? (
                    <button
                      className="add-button"
                      onClick={() =>
                        addToCart(
                          dish
                        )
                      }
                    >
                      + ADD
                    </button>
                  ) : (
                    <div className="quantity-control">
                      <button
                        onClick={() =>
                          decreaseQuantity(
                            dish.id
                          )
                        }
                      >
                        −
                      </button>

                      <strong>
                        {quantity}
                      </strong>

                      <button
                        onClick={() =>
                          increaseQuantity(
                            dish.id
                          )
                        }
                      >
                        +
                      </button>
                    </div>
                  )}
                </article>
              );
            }
          )}
        </div>
      </section>

      {cart.length > 0 && (
        <section className="cart-section">
          <div className="cart-header">
            <div>
              <span>
                YOUR ORDER
              </span>

              <h2>
                {cartCount} item
                {cartCount !==
                1
                  ? "s"
                  : ""}
              </h2>
            </div>

            <strong>
              ₹{total.toFixed(2)}
            </strong>
          </div>

          <div className="cart-items">
            {cart.map(
              (item) => (
                <div
                  className="cart-item"
                  key={item.id}
                >
                  <div>
                    <strong>
                      {item.name}
                    </strong>

                    <span>
                      ₹{item.price} ×{" "}
                      {
                        item.quantity
                      }
                    </span>
                  </div>

                  <strong>
                    ₹
                    {(
                      item.price *
                      item.quantity
                    ).toFixed(2)}
                  </strong>
                </div>
              )
            )}
          </div>

          <div className="cart-total">
            <span>
              Total
            </span>

            <strong>
              ₹{total.toFixed(2)}
            </strong>
          </div>

          {errorMessage && (
            <div className="order-error">
              {errorMessage}
            </div>
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
        <strong>
          MYSURU SOCIALS
        </strong>

        <span>
          Good food. Good people.
        </span>
      </footer>

      <style jsx>{`
        .order-page {
          min-height: 100vh;
          background:
            radial-gradient(
              circle at 15% 0%,
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
          font-family: Arial,
            Helvetica, sans-serif;
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
          background: rgba(
            8,
            9,
            12,
            0.92
          );
          backdrop-filter: blur(
            14px
          );
          border-bottom: 1px solid
            #202126;
        }

        .logo {
          color: #c9a878;
          text-decoration: none;
          font-size: 13px;
          font-weight: 1000;
          letter-spacing: 2px;
        }

        .logo span {
          color: white;
          margin-left: 5px;
        }

        .table-pill {
          padding: 9px 12px;
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

        .hero {
          padding: 52px 20px 35px;
          max-width: 720px;
          margin: auto;
        }

        .hero > span {
          color: #c9a878;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 2px;
        }

        .hero h1 {
          margin: 12px 0;
          font-size: clamp(
            42px,
            10vw,
            68px
          );
          line-height: 0.95;
          letter-spacing: -3px;
        }

        .hero p {
          max-width: 380px;
          color: #777;
          font-size: 13px;
          line-height: 1.6;
        }

        .category-wrapper {
          position: sticky;
          top: 70px;
          z-index: 15;
          padding: 10px 16px;
          background: rgba(
            8,
            9,
            12,
            0.94
          );
          backdrop-filter: blur(
            12px
          );
          border-bottom: 1px solid
            #202126;
          overflow-x: auto;
        }

        .categories {
          max-width: 720px;
          margin: auto;
          display: flex;
          gap: 7px;
          min-width: max-content;
        }

        .categories button {
          border: 1px solid #292a31;
          background: #111217;
          color: #777;
          border-radius: 999px;
          padding: 9px 13px;
          font-size: 10px;
          font-weight: 900;
          cursor: pointer;
        }

        .categories button.active {
          background: #c9a878;
          border-color: #c9a878;
          color: #11100e;
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
          margin-bottom: 18px;
        }

        .section-heading span {
          color: #666;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 1.5px;
        }

        .section-heading h2 {
          margin: 5px 0 0;
          font-size: 23px;
        }

        .cart-count {
          color: #c9a878 !important;
        }

        .food-grid {
          display: grid;
          grid-template-columns: repeat(
            2,
            minmax(0, 1fr)
          );
          gap: 10px;
        }

        .food-card {
          min-height: 220px;
          padding: 16px;
          border-radius: 20px;
          background: #111217;
          border: 1px solid #292a31;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .food-category {
          color: #666;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .food-card h3 {
          margin: 10px 0;
          font-size: 15px;
          line-height: 1.25;
        }

        .price {
          color: #c9a878;
          font-size: 14px;
        }

        .add-button {
          width: 100%;
          height: 42px;
          border: 1px solid
            rgba(
              201,
              168,
              120,
              0.4
            );
          border-radius: 12px;
          background: rgba(
            201,
            168,
            120,
            0.08
          );
          color: #c9a878;
          font-weight: 900;
          cursor: pointer;
        }

        .quantity-control {
          height: 42px;
          border-radius: 12px;
          background: #191a1f;
          border: 1px solid #303138;
          display: flex;
          align-items: center;
          justify-content: space-between;
          overflow: hidden;
        }

        .quantity-control button {
          width: 40px;
          height: 100%;
          border: 0;
          background: transparent;
          color: #c9a878;
          font-size: 20px;
          cursor: pointer;
        }

        .quantity-control strong {
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
          background: rgba(
            17,
            18,
            23,
            0.97
          );
          border: 1px solid #393a40;
          box-shadow:
            0 20px 60px
              rgba(
                0,
                0,
                0,
                0.45
              );
          backdrop-filter: blur(
            16px
          );
        }

        .cart-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }

        .cart-header span {
          color: #666;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 1.5px;
        }

        .cart-header h2 {
          margin: 5px 0 0;
          font-size: 19px;
        }

        .cart-header > strong {
          color: #c9a878;
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
          border-bottom: 1px solid
            #25262d;
        }

        .cart-item div {
          min-width: 0;
        }

        .cart-item strong,
        .cart-item span {
          display: block;
        }

        .cart-item strong {
          font-size: 12px;
        }

        .cart-item span {
          color: #666;
          margin-top: 4px;
          font-size: 10px;
        }

        .cart-total {
          display: flex;
          justify-content: space-between;
          padding: 15px 0;
          color: #888;
          font-size: 12px;
        }

        .cart-total strong {
          color: #c9a878;
          font-size: 18px;
        }

        .order-error {
          margin-bottom: 10px;
          padding: 12px;
          border-radius: 12px;
          background: rgba(
            255,
            80,
            80,
            0.08
          );
          border: 1px solid
            rgba(
              255,
              80,
              80,
              0.2
            );
          color: #ff9999;
          font-size: 10px;
          line-height: 1.5;
        }

        .send-button {
          width: 100%;
          height: 54px;
          border: 0;
          border-radius: 15px;
          background: #c9a878;
          color: #11100e;
          font-size: 13px;
          font-weight: 1000;
          cursor: pointer;
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
          color: #555;
          font-size: 10px;
        }

        footer strong {
          color: #777;
          letter-spacing: 1px;
        }

        @media (max-width: 520px) {
          .food-grid {
            grid-template-columns: 1fr;
          }

          .food-card {
            min-height: 190px;
          }

          .hero h1 {
            letter-spacing: -2px;
          }
        }
      `}</style>
    </main>
  );
}