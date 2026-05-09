"use client";

import { motion } from "framer-motion";
import { Activity, Bot, CreditCard, Users } from "lucide-react";

const cards = [
  { label: "AI Requests", value: "124,392", delta: "+12.4%", icon: Bot },
  { label: "Active Users", value: "8,240", delta: "+8.2%", icon: Users },
  { label: "MRR", value: "$28,900", delta: "+19.1%", icon: CreditCard },
  { label: "Tokens Used", value: "92M", delta: "+6.8%", icon: Activity }
];

export default function DashboardPage() {
  return (
    <main className="mx-auto max-w-7xl p-6 md:p-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">NovaMind Analytics</h1>
          <p className="text-sm text-slate-300">Real-time usage, growth, and platform insights.</p>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card, idx) => (
          <motion.article
            key={card.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.06 }}
            className="glass animated-border relative overflow-hidden rounded-2xl p-5"
          >
            <card.icon className="mb-4 text-sky-300" />
            <p className="text-sm text-slate-300">{card.label}</p>
            <h2 className="mt-1 text-2xl font-semibold">{card.value}</h2>
            <p className="mt-2 text-sm text-emerald-300">{card.delta}</p>
          </motion.article>
        ))}
      </section>

      <section className="mt-6 grid gap-4 xl:grid-cols-3">
        <article className="glass col-span-2 rounded-2xl p-6">
          <h3 className="text-lg font-semibold">Usage Timeline</h3>
          <div className="mt-5 h-64 rounded-xl border border-white/10 bg-gradient-to-br from-purple-500/10 to-blue-500/10 p-4">
            <div className="h-full rounded-lg border border-white/10 bg-black/20 p-4 text-sm text-slate-300">
              Recharts area graph placeholder for token usage and requests.
            </div>
          </div>
        </article>

        <article className="glass rounded-2xl p-6">
          <h3 className="text-lg font-semibold">Activity Feed</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-300">
            <li>New Pro subscription activated</li>
            <li>Resume analyzer executed for 312 users</li>
            <li>Interview coach model updated</li>
            <li>Stripe webhook sync successful</li>
          </ul>
        </article>
      </section>
    </main>
  );
}
