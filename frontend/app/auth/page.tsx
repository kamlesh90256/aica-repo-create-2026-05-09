"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [mode, setMode] = useState<'login'|'register'>('login');
  const [feedback, setFeedback] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const url = `http://localhost:4000/api/auth/${mode}`;
    const body: any = { email, password };
    if (mode === 'register') body.name = name;
    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const data = await res.json();
    if (data.token) localStorage.setItem('aica_token', data.token);
    setFeedback(data.error ? `Error: ${data.error}` : 'Success. Session token stored locally.');
    console.log(data);
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-7xl items-center justify-center p-6">
      <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="glass w-full max-w-md rounded-3xl p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
          <Link href="/" className="text-sm text-sky-300 hover:underline">Home</Link>
        </div>
        <form onSubmit={submit} className="flex flex-col gap-3">
        {mode === 'register' && (
          <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="rounded-xl border border-white/20 bg-white/5 p-3 outline-none" />
        )}
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-xl border border-white/20 bg-white/5 p-3 outline-none" />
        <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="rounded-xl border border-white/20 bg-white/5 p-3 outline-none" />
        <div className="flex gap-2">
          <button type="submit" className="rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-2 text-white">{mode === 'login' ? 'Login' : 'Register'}</button>
          <button type="button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="rounded-xl border border-white/20 px-4 py-2">Switch</button>
        </div>
        </form>
        {feedback && <p className="mt-4 text-sm text-slate-300">{feedback}</p>}
      </motion.section>
    </main>
  );
}
