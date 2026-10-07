import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { sessionId, amount } = body;

    if (!sessionId || !amount) {
      return NextResponse.json(
        { error: "Session ID and amount are required." },
        { status: 400 }
      );
    }

    // Create a demo payment record
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .insert({
        session_id: sessionId,
        amount: Number(amount),
        status: "Paid",
        payment_method: "Demo",
        paid_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (paymentError) {
      console.error("Payment error:", paymentError);

      return NextResponse.json(
        { error: paymentError.message },
        { status: 500 }
      );
    }

    // Mark all orders in this session as paid
    const { error: orderError } = await supabase
      .from("orders")
      .update({
        payment_status: "Paid",
      })
      .eq("session_id", sessionId);

    if (orderError) {
      console.error("Order update error:", orderError);

      return NextResponse.json(
        { error: orderError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      payment,
    });
  } catch (error) {
    console.error("Demo payment error:", error);

    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}