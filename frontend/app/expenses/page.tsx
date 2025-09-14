"use client";

import { useEffect, useState } from "react";
import ManualExpenseForm from "@/components/ManualExpenseForm";
import ExpensesTable from "@/components/ExpensesTable";
import { fetchWithAuth } from "@/utils/fetchWithAuth";

interface Expense { item: string; amount: number; person: string; }

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ name: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    async function fetchExpenses() {
      setLoading(true);
      const res = await fetchWithAuth("http://localhost:5000/api/expenses");
      if (!res) return; // redirected
      const data = await res.json();
      setExpenses(data);
      setLoading(false);
    }

    fetchExpenses();
  }, []);

  const handleAddExpense = async (expense: Expense) => {
    const res = await fetchWithAuth("http://localhost:5000/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(expense),
    });
    if (!res) return;
    const newExpense = await res.json();
    setExpenses([...expenses, newExpense]);
  };

  if (loading) return <p className="p-6">Loading expenses...</p>;

  return (
    <div className="p-6">
      {user && <h2 className="text-xl mb-4">Hi, {user.name} 👋</h2>}
      <h1 className="text-2xl font-bold mb-4">Expenses</h1>
      <ManualExpenseForm onAdd={handleAddExpense} />
      <div className="mt-6">
        <ExpensesTable expenses={expenses} />
      </div>
    </div>
  );
}
