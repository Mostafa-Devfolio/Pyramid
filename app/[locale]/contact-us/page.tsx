'use client';

import { useMemo, useState } from 'react';
import emailjs from '@emailjs/browser';
import { Pill, Section } from '../about/Section';
import { siteData } from '../about/data';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';

type Status = { type: 'idle' | 'sending' | 'success' | 'error'; message?: string };

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export default function ContactSection() {
  const c = siteData.contact;
  const [status, setStatus] = useState<Status>({ type: 'idle' });
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const canSend = useMemo(() => {
    return form.name.trim().length > 1 && isEmail(form.email) && form.message.trim().length > 5;
  }, [form]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSend) {
      setStatus({ type: 'error', message: 'Please fill your name, a valid email, and a longer message.' });
      return;
    }
    setStatus({ type: 'sending' });

    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

    try {
      if (serviceId && templateId && publicKey) {
        await emailjs.send(
          serviceId,
          templateId,
          {
            from_name: form.name,
            reply_to: form.email,
            subject: form.subject || 'Website contact form',
            message: form.message,
          },
          { publicKey }
        );
        setStatus({ type: 'success', message: 'Message sent successfully.' });
        setForm({ name: '', email: '', subject: '', message: '' });
        return;
      }

      // Fallback: API route
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || 'Failed to send message.');
      setStatus({ type: 'success', message: 'Message sent successfully.' });
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      setStatus({
        type: 'error',
        message: err?.message || 'Could not send message. Set EmailJS env vars or configure /api/contact.',
      });
    }
  }

  return (
    <Section title="Get in Touch" subtitle="Have a project in mind? Let's build something great together.">
      <div className="mt-8 grid items-start gap-12 lg:grid-cols-12">
        {/* Left Column: Contact Info Cards */}
        <div className="animate-in fade-in slide-in-from-left-8 space-y-4 duration-500 lg:col-span-5">
          {c.info.map((i) => (
            <div
              key={i.label}
              className="flex flex-col justify-between gap-4 rounded-3xl border border-slate-100 bg-slate-50 p-6 transition-colors hover:border-blue-100 hover:bg-blue-50/50 sm:flex-row sm:items-center"
            >
              <Pill>{i.label}</Pill>
              <div className="text-right font-black text-slate-900 sm:text-left">
                {i.label === 'Email' ? (
                  <a href={`mailto:${i.value}`} className="transition-colors hover:text-blue-600">
                    {i.value}
                  </a>
                ) : i.label === 'Phone' ? (
                  <a href={`tel:${i.value}`} className="transition-colors hover:text-blue-600">
                    {i.value}
                  </a>
                ) : (
                  <span>{i.value}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Contact Form */}
        <form
          onSubmit={handleSubmit}
          className="animate-in fade-in slide-in-from-bottom-8 rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-2xl shadow-slate-200/40 duration-700 sm:p-10 lg:col-span-7"
        >
          <div className="mb-6 grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="px-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">Full Name</label>
              <input
                className="w-full rounded-2xl border border-slate-100 bg-slate-50 p-4 font-bold text-slate-900 transition-all outline-none placeholder:font-medium placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-600"
                placeholder="John Doe"
                value={form.name}
                onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <label className="px-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                Email Address
              </label>
              <input
                className="w-full rounded-2xl border border-slate-100 bg-slate-50 p-4 font-bold text-slate-900 transition-all outline-none placeholder:font-medium placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-600"
                placeholder="john@example.com"
                value={form.email}
                onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
              />
            </div>
          </div>

          <div className="mb-6 space-y-2">
            <label className="px-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">Subject</label>
            <input
              className="w-full rounded-2xl border border-slate-100 bg-slate-50 p-4 font-bold text-slate-900 transition-all outline-none placeholder:font-medium placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-600"
              placeholder="How can I help you?"
              value={form.subject}
              onChange={(e) => setForm((s) => ({ ...s, subject: e.target.value }))}
            />
          </div>

          <div className="mb-8 space-y-2">
            <label className="px-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">Message</label>
            <textarea
              className="h-40 w-full resize-none rounded-3xl border border-slate-100 bg-slate-50 p-6 font-medium text-slate-900 transition-all outline-none placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-600"
              placeholder="Tell me about your project..."
              value={form.message}
              onChange={(e) => setForm((s) => ({ ...s, message: e.target.value }))}
            />
          </div>

          <div className="flex flex-col justify-between gap-6 pt-2 sm:flex-row sm:items-center">
            <button
              type="submit"
              disabled={status.type === 'sending'}
              className="flex items-center justify-center gap-2 rounded-full bg-black px-8 py-4 text-sm font-black text-white shadow-xl shadow-black/20 transition-all hover:scale-[1.02] active:scale-95 disabled:scale-100 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {status.type === 'sending' ? (
                'Sending...'
              ) : (
                <>
                  Send Message <Send size={16} />
                </>
              )}
            </button>

            {/* Status Feedback */}
            {status.type !== 'idle' && (
              <div
                className={`flex items-center gap-2 text-sm font-bold ${status.type === 'error' ? 'text-red-500' : 'text-emerald-600'}`}
              >
                {status.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
                <span className="max-w-62.5 leading-tight">{status.message}</span>
              </div>
            )}
          </div>
        </form>
      </div>
    </Section>
  );
}
