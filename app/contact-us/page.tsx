'use client';

import { useMemo, useState } from 'react';
import emailjs from '@emailjs/browser';
import { Pill, Section } from '../about/Section';
import { siteData } from '../about/data';

type Status = { type: 'idle'|'sending'|'success'|'error'; message?: string };

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

      // Fallback: API route (you can wire it to SMTP/Resend/etc.)
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
        message:
          err?.message ||
          'Could not send message. Set EmailJS env vars or configure /api/contact.',
      });
    }
  }

  return (
    <Section title="Get in Touch">
      <div className="grid gap-8 md:grid-cols-[1fr,1.2fr]">
        <div className="space-y-4">
          {c.info.map((i) => (
            <div key={i.label} className="flex items-center justify-between gap-3 border-l border-stroke pl-4">
              <Pill>{i.label}</Pill>
              {i.label == "Email" ? <a href="mailto:support@devfolio.net" className="text-sm text-text/80">{i.value}</a>: ''}
              {i.label == "Phone" ? <a href="tel:+201030505992" className="text-sm text-text/80">{i.value}</a>: ''}
              {i.label != "Phone" && i.label != "Email" ? <span className="text-sm text-text/80">{i.value}</span> : ""}
            </div>
          ))}
          <a href="tel:+"></a>

          {/* <div className="mt-6 rounded-2xl border border-stroke bg-white/0 p-5 text-xs text-text/60">
            <div className="font-bold text-text/80">Email sending</div>
            <div className="mt-2">
              Recommended: set <code className="rounded bg-black/30 px-1.5 py-0.5">NEXT_PUBLIC_EMAILJS_*</code> in <code className="rounded bg-black/30 px-1.5 py-0.5">.env.local</code>.
              Otherwise the form uses <code className="rounded bg-black/30 px-1.5 py-0.5">/api/contact</code>.
            </div>
          </div> */}
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-stroke bg-white/0 p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <input
              className="w-full rounded-xl border border-stroke bg-black/5 px-4 py-3 text-sm text-text outline-none ring-0 placeholder:text-text/40 focus:border-accent/50 dark:bg-black/20"
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
            />
            <input
              className="w-full rounded-xl border border-stroke bg-black/5 px-4 py-3 text-sm text-text outline-none ring-0 placeholder:text-text/40 focus:border-accent/50 dark:bg-black/20"
              placeholder="Email Address"
              value={form.email}
              onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
            />
          </div>

          <input
            className="mt-4 w-full rounded-xl border border-stroke bg-black/5 px-4 py-3 text-sm text-text outline-none ring-0 placeholder:text-text/40 focus:border-accent/50 dark:bg-black/20"
            placeholder="Subject"
            value={form.subject}
            onChange={(e) => setForm((s) => ({ ...s, subject: e.target.value }))}
          />

          <textarea
            className="mt-4 h-36 w-full resize-none rounded-xl border border-stroke bg-black/5 px-4 py-3 text-sm text-text outline-none ring-0 placeholder:text-text/40 focus:border-accent/50 dark:bg-black/20"
            placeholder="Your Message"
            value={form.message}
            onChange={(e) => setForm((s) => ({ ...s, message: e.target.value }))}
          />

          <div className="mt-5 flex items-center gap-3">
            <button
              type="submit"
              disabled={status.type === 'sending'}
              className="rounded-xl border border-accent/30 bg-green-800 px-5 py-2.5 text-sm font-bold text-accent transition hover:bg-green-500 disabled:opacity-60"
            >
              {status.type === 'sending' ? 'Sending…' : 'Send Message'}
            </button>

            {status.type !== 'idle' ? (
              <span className={status.type === 'error' ? 'text-sm text-red-400' : 'text-sm text-accent'}>
                {status.message}
              </span>
            ) : null}
          </div>
        </form>
      </div>
    </Section>
  );
}
