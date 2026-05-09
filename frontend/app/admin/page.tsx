"use client";

import { motion } from "framer-motion";

const stats = [
  ["Revenue", "$102,440"],
  ["Paying Users", "1,204"],
  ["Daily Requests", "42,100"],
  ["Error Rate", "0.09%"]
];

export default function AdminPage() {
  return (
    <main className="mx-auto max-w-6xl p-6 md:p-10">
      <h1 className="text-3xl font-semibold">Admin Control Center</h1>
      <p className="mt-1 text-slate-300">Platform metrics, billing, and AI operations.</p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {stats.map(([label, value], i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass rounded-2xl p-6"
          >
            <p className="text-sm text-slate-300">{label}</p>
            <p className="mt-2 text-3xl font-semibold">{value}</p>
          </motion.div>
        ))}
      </div>
    </main>
  );
}
