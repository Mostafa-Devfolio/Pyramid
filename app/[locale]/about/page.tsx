import React from 'react';
import { Pill, Section } from './Section';
import { siteData } from './data';
import { Code2, Server, Smartphone, BookOpen } from 'lucide-react';

export default function About() {
  const a = siteData.about;

  return (
    <Section title={a.introTitle || 'About Me'}>
      <div className="grid items-start gap-12 lg:grid-cols-12">
        {/* Intro Text */}
        <div className="animate-in fade-in slide-in-from-bottom-4 space-y-6 duration-500 lg:col-span-7">
          <h3 className="text-3xl leading-tight font-black text-slate-900">
            Hello! I’m <span className="text-blue-600">Mostafa Sherif</span>.
          </h3>
          <p className="text-lg leading-relaxed font-medium text-slate-600">{a.intro}</p>
        </div>

        {/* Personal Info Card */}
        <div className="animate-in fade-in slide-in-from-right-8 rounded-[2rem] border border-slate-100 bg-slate-50 p-8 shadow-inner duration-700 lg:col-span-5">
          <div className="space-y-5">
            {a.info.map((i) => (
              <div
                key={i.label}
                className="flex items-center justify-between gap-4 border-b border-slate-200/60 pb-5 last:border-0 last:pb-0"
              >
                <Pill>{i.label}</Pill>
                <div className="text-right text-sm font-black text-slate-900">
                  {i.label === 'Phone' ? (
                    <a className="transition-colors hover:text-blue-600" href={`tel:${i.value}`}>
                      {i.value}
                    </a>
                  ) : i.label === 'Email' ? (
                    <a className="transition-colors hover:text-blue-600" href={`mailto:${i.value}`}>
                      {i.value}
                    </a>
                  ) : (
                    <span>{i.value}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Services / What I Do */}
      <div className="mt-16 border-t border-slate-100 pt-16">
        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg">
            <BookOpen size={24} />
          </div>
          <h3 className="text-2xl font-black tracking-tight text-slate-900">What I Do</h3>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {a.services.map((s, index) => {
            const Icon = index === 0 ? Code2 : index === 1 ? Server : Smartphone;

            return (
              <div
                key={s.title}
                className="group flex flex-col rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-900/10"
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-inner transition-colors duration-300 group-hover:bg-blue-600 group-hover:text-white">
                  <Icon size={32} strokeWidth={2.5} />
                </div>
                <h4 className="mb-3 text-xl font-black text-slate-900">{s.title}</h4>
                <p className="mt-auto text-sm leading-relaxed font-medium text-slate-500">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
