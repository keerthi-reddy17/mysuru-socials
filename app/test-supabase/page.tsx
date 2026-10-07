"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function TestSupabase() {
  const [message, setMessage] = useState("Testing order system...");

  useEffect(() => {
    async function testOrderSystem() {
      // Get Table 1
      const { data: table, error: tableError } = await supabase
        .from("restaurant_tables")
        .select("id, table_number")
        .eq("table_number", 1)
        .single();

      if (tableError) {
        setMessage(`Table error: ${tableError.message}`);
        return;
      }

      // Create a test session
      const sessionId = crypto.randomUUID();

      // Create a test order
      const orderNumber = `TEST-${Date.now()}`;

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          order_number: orderNumber,
          table_id: table.id,
          session_id: sessionId,
          status: "Received",
        })
        .select()
        .single();

      if (orderError) {
        setMessage(`Order error: ${orderError.message}`);
        return;
      }

      // Add test item
      const { error: itemError } = await supabase
        .from("order_items")
        .insert({
          order_id: order.id,
          item_name: "Cold Coffee",
          unit_price: 149,
          quantity: 2,
        });

      if (itemError) {
        setMessage(`Item error: ${itemError.message}`);
        return;
      }

      setMessage(
        `SUCCESS! Order ${order.order_number} created for Table ${table.table_number}.`
      );
    }

    testOrderSystem();
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#11100e",
        color: "#f5efe5",
        fontSize: "24px",
        textAlign: "center",
        padding: "20px",
      }}
    >
      {message}
    </main>
  );
}