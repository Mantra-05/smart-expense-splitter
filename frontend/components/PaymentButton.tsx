"use client";
import React from "react";

export default function PaymentButton() {
  return (
    <section className="bg-white shadow rounded-2xl p-6 text-center">
      <h2 className="text-lg font-semibold mb-4">Settle Payments</h2>
      <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
        Pay Now
      </button>
    </section>
  );
}
