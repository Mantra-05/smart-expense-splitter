"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/utils/fetchWithAuth";

interface Settlement { from: string; to: string; amount: number; }

export default function PaymentsPage() {
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ name: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    async function fetchSettlements() {
      setLoading(true);
      const res = await fetchWithAuth("http://localhost:5000/api/settlements");
      if (!res) return;
      const data = await res.json();
      setSettlements(data);
      setLoading(false);
    }

    fetchSettlements();
  }, []);

  if (loading) return <p className="p-6">Loading settlements...</p>;

  return (
    <div className="p-6">
      {user && <h2 className="text-xl mb-4">Hi, {user.name} 👋</h2>}
      <h1 className="text-2xl font-bold mb-4">Payments</h1>
      {settlements.length === 0 ? (
        <p className="text-green-600">All settled! 🎉</p>
      ) : (
        <ul className="space-y-2">
          {settlements.map((s, idx) => (
            <li key={idx} className="p-3 border rounded-lg shadow-sm bg-white">
              <span className="font-semibold">{s.from}</span> ➝ <span className="font-semibold">{s.to}</span>: ₹{s.amount.toFixed(2)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
