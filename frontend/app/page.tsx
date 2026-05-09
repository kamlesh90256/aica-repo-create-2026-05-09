"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles, BrainCircuit, ShieldCheck, Gauge } from "lucide-react";
import { ThemeToggle } from "../src/components/theme-toggle";

export default function Home() {
  return (
    <main className="relative overflow-hidden px-6 pb-20 pt-6 md:px-10">
      <header className="mx-auto flex max-w-7xl items-center justify-between">
        <h1 className="text-lg font-semibold">NovaMind AI</h1>
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="rounded-xl border border-white/20 px-3 py-2 text-sm hover:bg-white/10">Dashboard</Link>
          <ThemeToggle />
        </div>
      </header>

      <section className="mx-auto mt-16 max-w-7xl">
        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl text-5xl font-bold leading-tight md:text-7xl"
        >
          The <span className="gradient-text">Ultra-Modern</span> AI Workspace for Teams and Creators
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-6 max-w-2xl text-lg text-slate-300"
        >
          Chat, memory, document intelligence, coding assistant, and analytics inside one premium SaaS platform.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 flex flex-wrap gap-3"
        >
          <Link href="/chat" className="animated-border rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-6 py-3 font-medium text-white">Launch NovaMind</Link>
          <Link href="/auth" className="rounded-xl border border-white/20 px-6 py-3 font-medium hover:bg-white/10">Start Free</Link>
        </motion.div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {[
            { icon: Sparkles, title: "Realtime AI Streaming", text: "Low-latency token streaming with polished chat UX." },
            { icon: BrainCircuit, title: "Memory + RAG", text: "Context retention and document-grounded answers." },
            { icon: ShieldCheck, title: "SaaS Security", text: "Rate limiting, validation, and secure API surfaces." },
            { icon: Gauge, title: "Usage Analytics", text: "Track tokens, active users, and business KPIs." }
          ].map((feature) => (
            <article key={feature.title} className="glass float rounded-2xl p-5">
              <feature.icon className="text-sky-300" size={18} />
              <h3 className="mt-3 text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-slate-300">{feature.text}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
