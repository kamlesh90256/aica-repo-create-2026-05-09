"use client";

import { motion } from "framer-motion";
import { Activity, Bot, CreditCard, Users } from "lucide-react";

const cards = [
  { label: "AI Requests", value: "124,392", delta: "+12.4%", icon: Bot },
  { label: "Active Users", value: "8,240", delta: "+8.2%", icon: Users },
  { label: "MRR", value: "$28,900", delta: "+19.1%", icon: CreditCard },
  { label: "Tokens Used", value: "92M", delta: "+6.8%", icon: Activity }
];

const timeline = [42, 58, 54, 71, 66, 84, 79, 95, 87, 104, 98, 120];

function buildPolyline(values: number[]) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const width = 560;
  const height = 240;
  const padding = 18;
  const range = Math.max(1, max - min);

  return values
    .map((value, index) => {
      const x = padding + (index * (width - padding * 2)) / (values.length - 1);
      const y = height - padding - ((value - min) / range) * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(" ");
}

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
          <div className="mt-5 overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-cyan-500/10 via-sky-500/10 to-indigo-500/10 p-4">
            <svg viewBox="0 0 560 240" className="h-64 w-full" role="img" aria-label="Token usage trend line chart">
              <defs>
                <linearGradient id="timelineFill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="rgba(56, 189, 248, 0.45)" />
                  <stop offset="100%" stopColor="rgba(56, 189, 248, 0.02)" />
                </linearGradient>
              </defs>
              <rect x="0" y="0" width="560" height="240" rx="20" fill="rgba(3, 7, 18, 0.45)" />
              <path d={`M 18 222 ${buildPolyline(timeline)}`} fill="none" stroke="url(#timelineFill)" strokeWidth="4" strokeLinecap="round" />
              <polygon
                points={`18,222 ${buildPolyline(timeline)} 542,222`}
                fill="url(#timelineFill)"
                opacity="0.55"
              />
              {timeline.map((value, index) => {
                const x = 18 + (index * (560 - 36)) / (timeline.length - 1);
                const max = Math.max(...timeline);
                const min = Math.min(...timeline);
                const range = Math.max(1, max - min);
                const y = 222 - ((value - min) / range) * 186;
                return <circle key={`${index}-${value}`} cx={x} cy={y} r="3.5" fill="rgba(125, 211, 252, 0.95)" />;
              })}
            </svg>
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
