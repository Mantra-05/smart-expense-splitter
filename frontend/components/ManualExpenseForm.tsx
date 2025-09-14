"use client";
import React from "react";

export default function UploadBill() {
  return (
    <section className="bg-white shadow rounded-2xl p-6">
      <h2 className="text-lg font-semibold mb-2">Upload Bill</h2>
      <input
        type="file"
        accept="image/*"
        className="block w-full text-sm text-gray-600 border border-gray-300 rounded-lg cursor-pointer p-2"
        onChange={(e) => {
          console.log("Uploaded file:", e.target.files?.[0]);
        }}
      />
    </section>
  );
}
