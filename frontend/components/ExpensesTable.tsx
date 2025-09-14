"use client";
import React from "react";

interface Expense {
  item: string;
  amount: number;
  person: string;
}

export default function ExpensesTable({ expenses }: { expenses: Expense[] }) {
  return (
    <section className="bg-white shadow rounded-2xl p-6">
      <h2 className="text-lg font-semibold mb-2">Expenses</h2>
      {expenses.length === 0 ? (
        <p className="text-gray-500">No expenses added yet.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">Item</th>
              <th className="border border-gray-300 p-2">Amount</th>
              <th className="border border-gray-300 p-2">Person</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((exp, idx) => (
              <tr key={idx}>
                <td className="border border-gray-300 p-2">{exp.item}</td>
                <td className="border border-gray-300 p-2">₹{exp.amount}</td>
                <td className="border border-gray-300 p-2">{exp.person}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
