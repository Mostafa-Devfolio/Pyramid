import React from 'react';
import { Pill, Section } from './Section';
import { siteData } from './data';

export default function About() {
  const a = siteData.about;
  return (
    <Section title="About Me">
      <div className="grid gap-8 sm:grid-cols-2">
        <div className="text-text/75 text-sm leading-7">
          <div className="text-text font-semibold"><span className='font-bold'>Hello! </span> I’m <span className='font-bold'>Mostafa Sherif</span>.</div>
          <div className="mt-2">{a.intro}</div>
        </div>

        <div className="text-text/75 grid gap-3 text-sm">
          {a.info.map((i) => (
            <div key={i.label} className="border-stroke flex items-center justify-between gap-3 border-l pl-4">
              <Pill className='text-white'>{i.label}</Pill>
              {i.label == 'Phone' ? (
                <a className="text-text/80 font-bold" href="tel:+201030505992">
                  {i.value}
                </a>
              ) : (
                ''
              )}
              {i.label == 'Email' ? (
                <a className="text-text/80 font-bold" href="mail:support@devfolio.net">
                  {i.value}
                </a>
              ) : (
                ''
              )}
              {i.label != 'Phone' && i.label != 'Email' ? (
                <span className="text-text/80 font-bold">{i.value}</span>
              ) : (
                ''
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10">
        <div className="flex items-center gap-3">
          <span className="bg-black text-accent inline-flex h-8 w-8 items-center justify-center rounded-full">
            L
          </span>
          <div className="text-text text-lg font-extrabold">Learnt Languages</div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {a.services.map((s) => (
            <div
              key={s.title}
              className="border-stroke rounded-2xl border bg-white/0 p-6 transition hover:bg-white/[0.03]"
            >
              <div className="text-text text-base font-bold">{s.title}</div>
              <div className="text-text/70 mt-2 text-sm leading-6">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* <div className="mt-12 grid gap-6 md:grid-cols-2">
        {a.pricing.map((p) => (
          <div key={p.title} className="rounded-2xl border border-stroke bg-white/0 p-6">
            <div className="flex items-start justify-between">
              <div className="text-lg font-extrabold text-text">{p.title}</div>
              <div className="text-text/75">
                <span className="text-2xl font-extrabold text-text">${p.price}</span>
                <span className="ml-1 text-xs text-text/60">/ {p.period}</span>
              </div>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-text/70">
              {p.features.map((f: string) => (
                <li key={f} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent/70" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div> */}

      {/* <div className="mt-12 grid gap-4 md:grid-cols-3">
        {a.testimonials.map((t) => (
          <div key={t.name} className="rounded-2xl border border-stroke bg-white/0 p-6">
            <div className="text-sm italic leading-6 text-text/70">“{t.text}”</div>
            <div className="mt-4 text-sm font-bold text-text">{t.name}</div>
            <div className="text-xs text-text/60">{t.company}</div>
          </div>
        ))}
      </div> */}

      {/* <div className="mt-12 grid gap-4 md:grid-cols-4">
        {a.facts.map((f) => (
          <div key={f.name} className="rounded-2xl border border-stroke bg-white/0 p-5 text-center">
            <div className="text-sm font-bold text-text">{f.name}</div>
          </div>
        ))}
      </div> */}
    </Section>
  );
}
