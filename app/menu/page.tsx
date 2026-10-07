"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type MenuItem = {
  name: string;
  price: number;
  type: "Veg" | "Non-Veg";
  category:
    | "Sizzlers"
    | "Fried Rice"
    | "Noodles"
    | "Main Course"
    | "Pasta"
    | "Lasagna";
  image: string;
};

const menuItems: MenuItem[] = [
  {
    name: "Exotic Veg Sizzler",
    price: 319,
    type: "Veg",
    category: "Sizzlers",
    image:
      "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=90",
  },
  {
    name: "Paneer Shashlik Sizzler",
    price: 319,
    type: "Veg",
    category: "Sizzlers",
    image:
      "https://images.unsplash.com/photo-1757715376287-90f24dac4593?auto=format&fit=crop&w=1200&q=90",
  },
  {
    name: "Chicken Steak Sizzler",
    price: 329,
    type: "Non-Veg",
    category: "Sizzlers",
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=90",
  },

  {
    name: "Veg Fried Rice",
    price: 159,
    type: "Veg",
    category: "Fried Rice",
    image:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1200&q=90",
  },
  {
    name: "Chicken Fried Rice",
    price: 179,
    type: "Non-Veg",
    category: "Fried Rice",
    image:
      "https://images.unsplash.com/photo-1772729440931-e8efd3adc748?auto=format&fit=crop&w=1200&q=90",
  },
  {
    name: "Seafood Fried Rice",
    price: 209,
    type: "Non-Veg",
    category: "Fried Rice",
    image:
      "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=1200&q=90",
  },

  {
    name: "Veg Hakka Noodles",
    price: 159,
    type: "Veg",
    category: "Noodles",
    image:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1200&q=90",
  },
  {
    name: "Chicken Hakka Noodles",
    price: 179,
    type: "Non-Veg",
    category: "Noodles",
    image:
      "https://images.unsplash.com/photo-1557872943-16a5ac26437e?auto=format&fit=crop&w=1200&q=90",
  },

  {
    name: "Veg Manchurian Gravy",
    price: 159,
    type: "Veg",
    category: "Main Course",
    image:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=90",
  },
  {
    name: "Chicken Manchurian Gravy",
    price: 179,
    type: "Non-Veg",
    category: "Main Course",
    image:
      "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=1200&q=90",
  },

  {
    name: "Veg Pasta",
    price: 279,
    type: "Veg",
    category: "Pasta",
    image:
      "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1200&q=90",
  },
  {
    name: "Chicken Pasta",
    price: 309,
    type: "Non-Veg",
    category: "Pasta",
    image:
      "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=1200&q=90",
  },

  {
    name: "Veg Lasagna",
    price: 279,
    type: "Veg",
    category: "Lasagna",
    image:
      "https://images.unsplash.com/photo-1574894709920-11b28e7367a0?auto=format&fit=crop&w=1200&q=90",
  },
  {
    name: "Chicken Lasagna",
    price: 309,
    type: "Non-Veg",
    category: "Lasagna",
    image:
      "https://images.unsplash.com/photo-1574894709920-11b28e7367a0?auto=format&fit=crop&w=1200&q=90",
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

function MenuCard({ item }: { item: MenuItem }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
      },
      {
        threshold: 0.2,
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`menu-card ${visible ? "menu-visible" : ""}`}
    >
      <div className="menu-info">
        <div className="dish-category">{item.category}</div>

        <h2>{item.name}</h2>

        <div className="dish-bottom">
          <span className="dish-price">₹{item.price}</span>

          <span
            className={`dish-type ${
              item.type === "Veg" ? "veg" : "nonveg"
            }`}
          >
            <span className="type-dot" />
            {item.type}
          </span>
        </div>
      </div>

      <div className="dish-image-wrap">
        <img
          src={item.image}
          alt={item.name}
          className="dish-image"
        />
      </div>
    </div>
  );
}

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredItems =
    activeCategory === "All"
      ? menuItems
      : menuItems.filter(
          (item) => item.category === activeCategory
        );

  return (
    <main className="menu-page">
      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          background: #050505;
          color: #f5efe5;
          font-family: Arial, Helvetica, sans-serif;
        }

        .menu-page {
          min-height: 100vh;
          background:
            radial-gradient(
              circle at 50% 0%,
              rgba(212, 175, 55, 0.09),
              transparent 35%
            ),
            #050505;
          overflow: hidden;
        }

        .menu-nav {
          position: sticky;
          top: 0;
          z-index: 100;
          height: 78px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 6vw;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(5, 5, 5, 0.88);
          backdrop-filter: blur(18px);
        }

        .brand {
          text-decoration: none;
          color: #f5efe5;
          letter-spacing: 5px;
          font-size: 17px;
          font-weight: 700;
        }

        .brand span {
          color: #d4af37;
        }

        .back-link {
          text-decoration: none;
          color: #d4af37;
          font-size: 12px;
          letter-spacing: 2px;
          text-transform: uppercase;
          transition: 0.3s ease;
        }

        .back-link:hover {
          color: #fff;
        }

        .menu-header {
          text-align: center;
          padding: 110px 20px 65px;
        }

        .eyebrow {
          color: #d4af37;
          font-size: 11px;
          letter-spacing: 5px;
          text-transform: uppercase;
          margin-bottom: 20px;
        }

        .menu-title {
          margin: 0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(55px, 10vw, 120px);
          font-weight: 400;
          line-height: 0.9;
          letter-spacing: -5px;
        }

        .menu-subtitle {
          max-width: 570px;
          margin: 30px auto 0;
          color: rgba(245, 239, 229, 0.62);
          font-size: 14px;
          line-height: 1.8;
        }

        .filters {
          display: flex;
          justify-content: center;
          gap: 10px;
          flex-wrap: wrap;
          padding: 0 25px 80px;
        }

        .filter-button {
          border: 1px solid rgba(212, 175, 55, 0.28);
          background: transparent;
          color: rgba(245, 239, 229, 0.65);
          padding: 12px 20px;
          border-radius: 999px;
          font-size: 11px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .filter-button:hover,
        .filter-button.active {
          background: #d4af37;
          border-color: #d4af37;
          color: #050505;
        }

        .menu-list {
          width: min(1150px, 90%);
          margin: 0 auto;
          padding-bottom: 100px;
        }

        .menu-card {
          min-height: 400px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 90px;
          padding: 65px 0;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          opacity: 0;
          transform: translateY(35px);
          transition:
            opacity 0.8s ease,
            transform 0.8s ease;
        }

        .menu-card.menu-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .menu-info {
          flex: 1;
          transform: translateX(-75px);
          opacity: 0;
          transition:
            transform 0.9s cubic-bezier(0.22, 1, 0.36, 1),
            opacity 0.8s ease;
        }

        .menu-card.menu-visible .menu-info {
          transform: translateX(0);
          opacity: 1;
        }

        .dish-image-wrap {
          width: 310px;
          height: 310px;
          flex-shrink: 0;
          border-radius: 50%;
          overflow: hidden;
          border: 1px solid rgba(212, 175, 55, 0.3);
          box-shadow:
            0 0 0 10px rgba(212, 175, 55, 0.025),
            0 20px 60px rgba(0, 0, 0, 0.55);
          transform: translateX(75px) scale(0.9);
          opacity: 0;
          transition:
            transform 1s cubic-bezier(0.22, 1, 0.36, 1),
            opacity 0.8s ease;
        }

        .menu-card.menu-visible .dish-image-wrap {
          transform: translateX(0) scale(1);
          opacity: 1;
        }

        .dish-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.8s ease;
        }

        .dish-image-wrap:hover .dish-image {
          transform: scale(1.08);
        }

        .dish-category {
          color: #d4af37;
          font-size: 10px;
          letter-spacing: 4px;
          text-transform: uppercase;
          margin-bottom: 18px;
        }

        .menu-info h2 {
          max-width: 650px;
          margin: 0;
          font-family: Georgia, "Times New Roman", serif;
          font-weight: 400;
          font-size: clamp(34px, 4vw, 56px);
          line-height: 1.05;
          letter-spacing: -1.5px;
        }

        .dish-bottom {
          display: flex;
          align-items: center;
          gap: 22px;
          margin-top: 28px;
        }

        .dish-price {
          color: #f5efe5;
          font-size: 18px;
          font-weight: 600;
        }

        .dish-type {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          color: rgba(245, 239, 229, 0.5);
          font-size: 11px;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .type-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          display: inline-block;
        }

        .dish-type.veg .type-dot {
          background: #4caf50;
        }

        .dish-type.nonveg .type-dot {
          background: #d9534f;
        }

        .menu-cta {
          text-align: center;
          padding: 100px 20px 130px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .menu-cta h2 {
          margin: 0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(38px, 6vw, 75px);
          font-weight: 400;
        }

        .menu-cta p {
          color: rgba(245, 239, 229, 0.55);
          margin: 20px auto 35px;
          font-size: 14px;
        }

        .order-button {
          display: inline-block;
          text-decoration: none;
          background: #d4af37;
          color: #050505;
          padding: 15px 30px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          transition: 0.3s ease;
        }

        .order-button:hover {
          background: #f5efe5;
          transform: translateY(-2px);
        }

        @media (max-width: 800px) {
          .menu-nav {
            height: 68px;
            padding: 0 22px;
          }

          .brand {
            font-size: 14px;
            letter-spacing: 3px;
          }

          .menu-header {
            padding: 80px 20px 50px;
          }

          .menu-title {
            letter-spacing: -3px;
          }

          .filters {
            padding-bottom: 50px;
          }

          .menu-list {
            width: 88%;
          }

          .menu-card {
            min-height: auto;
            flex-direction: column-reverse;
            align-items: flex-start;
            gap: 35px;
            padding: 55px 0;
          }

          .dish-image-wrap {
            width: 225px;
            height: 225px;
            align-self: center;
          }

          .menu-info {
            width: 100%;
          }

          .menu-info h2 {
            font-size: 34px;
          }

          .dish-bottom {
            margin-top: 20px;
          }
        }

        @media (max-width: 450px) {
          .dish-image-wrap {
            width: 205px;
            height: 205px;
          }

          .menu-info h2 {
            font-size: 31px;
          }
        }
      `}</style>

      <nav className="menu-nav">
        <Link href="/" className="brand">
          MYSURU <span>SOCIALS</span>
        </Link>

        <Link href="/" className="back-link">
          ← Back Home
        </Link>
      </nav>

      <section className="menu-header">
        <div className="eyebrow">Mysuru Socials · Dining</div>

        <h1 className="menu-title">THE MENU</h1>

        <p className="menu-subtitle">
          Good food, good mood, and a little bit of Mysuru in every plate.
          Explore our favourites, from sizzling classics to comforting pasta
          and noodles.
        </p>
      </section>

      <div className="filters">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={`filter-button ${
              activeCategory === category ? "active" : ""
            }`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <section className="menu-list">
        {filteredItems.map((item) => (
          <MenuCard key={item.name} item={item} />
        ))}
      </section>

      <section className="menu-cta">
        <div className="eyebrow">Hungry already?</div>

        <h2>Let&apos;s make it a meal.</h2>

        <p>Scan your table QR and order directly from the menu.</p>

        <Link href="/order?table=1" className="order-button">
          Order Now
        </Link>
      </section>
    </main>
  );
}