"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/utils/fetchWithAuth";

interface Expense { item: string; amount: number; person: string; }

export default function InsightsPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ name: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    async function fetchExpenses() {
      setLoading(true);
      const res = await fetchWithAuth("http://localhost:5000/api/expenses");
      if (!res) return;
      const data = await res.json();
      setExpenses(data);
      setLoading(false);
    }

    fetchExpenses();
  }, []);

  if (loading) return <p className="p-6">Loading insights...</p>;
  if (expenses.length === 0) return <p className="p-6">No expenses yet.</p>;

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const personTotals: Record<string, number> = {};
  expenses.forEach((e) => { personTotals[e.person] = (personTotals[e.person] || 0) + e.amount; });
  const topSpender = Object.entries(personTotals).sort((a, b) => b[1] - a[1])[0];
  const biggestExpense = expenses.sort((a, b) => b.amount - a.amount)[0];

  return (
    <div className="p-6">
      {user && <h2 className="text-xl mb-4">Hi, {user.name} 👋</h2>}
      <h1 className="text-2xl font-bold mb-4">Insights</h1>
      <div className="space-y-4">
        <p className="p-4 border rounded-lg bg-white shadow">💰 Total spent: <span className="font-semibold">₹{total}</span></p>
        <p className="p-4 border rounded-lg bg-white shadow">🏆 Top spender: <span className="font-semibold">{topSpender[0]}</span> (₹{topSpender[1]})</p>
        <p className="p-4 border rounded-lg bg-white shadow">🍕 Biggest expense: <span className="font-semibold">{biggestExpense.item}</span> (₹{biggestExpense.amount})</p>
      </div>
    </div>
  );
}
