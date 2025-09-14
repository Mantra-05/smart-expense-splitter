"use client";
import React from "react";
import Navbar from "../components/Navbar";
import UploadBill from "../components/ManualExpenseForm";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center mt-20">
      <h1 className="text-4xl font-bold mb-6">Smart Expense Splitter 💸</h1>
      <p className="text-lg text-gray-600 max-w-xl text-center">
        Easily manage group expenses. Add bills manually, view AI-powered insights,
        and settle payments seamlessly with integrated gateways.
      </p>

      <div className="mt-10 grid grid-cols-3 gap-6">
        <a
          href="/expenses"
          className="p-6 border rounded-2xl shadow-md hover:shadow-lg transition bg-white"
        >
          <h2 className="text-xl font-semibold mb-2">➕ Add Expenses</h2>
          <p className="text-gray-500">Enter bill details and track group spending.</p>
        </a>

        <a
          href="/insights"
          className="p-6 border rounded-2xl shadow-md hover:shadow-lg transition bg-white"
        >
          <h2 className="text-xl font-semibold mb-2">📊 Insights</h2>
          <p className="text-gray-500">Get an overview of who spent the most and on what.</p>
        </a>

        <a
          href="/payments"
          className="p-6 border rounded-2xl shadow-md hover:shadow-lg transition bg-white"
        >
          <h2 className="text-xl font-semibold mb-2">💵 Payments</h2>
          <p className="text-gray-500">Settle balances between group members instantly.</p>
        </a>
      </div>
    </div>
  );
}
