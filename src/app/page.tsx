'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AgentContext,
  EstimateDetails,
  createWelcomeMessages,
  generateAgentResponse,
  initialContext,
  summarizeEstimate,
  summarizeUpdateRequest
} from '@/lib/agent';
import { ChatBubble } from '@/components/ChatBubble';
import { QuickReplyButton } from '@/components/QuickReplyButton';
import { EstimateForm } from '@/components/EstimateForm';
import { UpdateForm } from '@/components/UpdateForm';

interface ChatMessage {
  id: string;
  sender: 'agent' | 'user';
  text?: string;
  form?: 'estimate' | 'update';
}

const uuid = () => globalThis.crypto.randomUUID();

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    createWelcomeMessages().map((text) => ({ id: uuid(), sender: 'agent' as const, text }))
  );
  const [context, setContext] = useState<AgentContext>(initialContext);
  const [input, setInput] = useState('');
  const [quickReplies, setQuickReplies] = useState<string[]>([
    'Request an estimate',
    'Check repair status',
    'Maintenance tips',
    'Insurance claims support'
  ]);
  const scrollAnchorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const hasEstimateForm = useMemo(
    () => messages.some((message) => message.form === 'estimate'),
    [messages]
  );

  const hasUpdateForm = useMemo(() => messages.some((message) => message.form === 'update'), [messages]);

  function pushMessage(message: ChatMessage) {
    setMessages((prev) => [...prev, message]);
  }

  function handleSend(content: string) {
    const trimmed = content.trim();
    if (!trimmed) return;

    pushMessage({ id: uuid(), sender: 'user', text: trimmed });
    setInput('');

    const response = generateAgentResponse(trimmed, context);
    setContext(response.context);

    response.replies.forEach((text) => {
      pushMessage({ id: uuid(), sender: 'agent', text });
    });

    setQuickReplies(response.quickReplies ?? []);

    if (response.triggerEstimateForm && !hasEstimateForm) {
      pushMessage({ id: uuid(), sender: 'agent', form: 'estimate' });
    }

    if (response.triggerUpdateForm && !hasUpdateForm) {
      pushMessage({ id: uuid(), sender: 'agent', form: 'update' });
    }
  }

  function handleEstimateSubmit(details: EstimateDetails) {
    const locale = context.locale;
    setContext((prev) => ({ ...prev, estimate: details, flow: 'idle' }));
    setMessages((prev) => prev.filter((message) => message.form !== 'estimate'));
    pushMessage({ id: uuid(), sender: 'user', text: `${details.carModel ?? ''} - ${details.damageType ?? ''}`.trim() });
    pushMessage({ id: uuid(), sender: 'agent', text: summarizeEstimate(details, locale) });
  }

  function handleUpdateSubmit(jobCard: string, registration: string) {
    const locale = context.locale;
    setMessages((prev) => prev.filter((message) => message.form !== 'update'));
    const joined = [jobCard, registration].filter(Boolean).join(' / ');
    if (joined) {
      pushMessage({ id: uuid(), sender: 'user', text: joined });
    }
    pushMessage({ id: uuid(), sender: 'agent', text: summarizeUpdateRequest(jobCard || registration, locale) });
  }

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-b from-slate-900 to-slate-950">
      <header className="z-10 border-b border-white/5 bg-slate-950/70 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-3 rounded-full border border-brand-accent/40 bg-brand-accent/10 px-4 py-1 text-xs uppercase tracking-[0.32em] text-brand-accent">
              Trusted Since 1989
            </div>
            <h1 className="text-3xl font-semibold text-white md:text-4xl lg:text-5xl">
              De Jongh&apos;s Panelbeating Centre Digital Concierge
            </h1>
            <p className="text-base text-slate-200/80 md:text-lg">
              Professional collision repair, spray painting, dent removal, chassis straightening, rust treatment,
              and insurance support in the Helderberg. Chat with our assistant for quotes, updates, or advice.
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-white/70">
              <div>
                <span className="block text-xs uppercase tracking-wide text-white/40">Workshop</span>
                12 Mynhardt Street, Strand, Western Cape
              </div>
              <div>
                <span className="block text-xs uppercase tracking-wide text-white/40">Phone</span>
                021 853 1234
              </div>
              <div>
                <span className="block text-xs uppercase tracking-wide text-white/40">Email</span>
                bookings@dejonghs-panel.co.za
              </div>
            </div>
          </div>
          <div className="mt-4 flex flex-col items-center gap-3 md:mt-0">
            <div className="rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-white/80">
              <p className="font-semibold">Operating hours</p>
              <p>Mon - Fri: 7:30 - 17:00</p>
              <p>Sat: By appointment</p>
              <p>Sun &amp; Public Holidays: Closed</p>
            </div>
            <div className="rounded-full border border-brand-accent/40 bg-brand-accent/20 px-4 py-2 text-xs uppercase tracking-[0.4em] text-brand-accent">
              English &amp; Afrikaans
            </div>
          </div>
        </div>
      </header>

      <section className="relative flex-1">
        <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-brand-accent/10 via-transparent to-transparent" />
        <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pb-28 pt-10 md:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[1fr,320px]">
            <div className="flex flex-col rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-2xl shadow-black/20">
              <div className="flex items-center gap-3 pb-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-accent font-semibold text-slate-900">
                  DJ
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Lourens (Digital Assistant)</p>
                  <p className="text-xs text-white/60">Here to guide you every step</p>
                </div>
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto pr-1" style={{ maxHeight: '60vh' }}>
                <AnimatePresence initial={false}>
                  {messages.map((message) => (
                    <ChatBubble key={message.id} sender={message.sender}>
                      {message.text ? (
                        <p className="whitespace-pre-line text-[15px] leading-relaxed text-white/90">
                          {message.text}
                        </p>
                      ) : null}
                      {message.form === 'estimate' ? (
                        <EstimateForm locale={context.locale} onSubmit={handleEstimateSubmit} />
                      ) : null}
                      {message.form === 'update' ? (
                        <UpdateForm locale={context.locale} onSubmit={handleUpdateSubmit} />
                      ) : null}
                    </ChatBubble>
                  ))}
                </AnimatePresence>
                <div ref={scrollAnchorRef} />
              </div>

              <div className="mt-6 space-y-4">
                {quickReplies.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {quickReplies.map((reply) => (
                      <QuickReplyButton key={reply} label={reply} onSelect={handleSend} />
                    ))}
                  </div>
                ) : null}

                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    handleSend(input);
                  }}
                  className="flex items-center gap-3 rounded-full border border-white/10 bg-slate-900/70 px-2 py-2"
                >
                  <input
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 rounded-full bg-transparent px-4 text-sm text-white outline-none placeholder:text-white/40"
                  />
                  <button
                    type="submit"
                    className="rounded-full bg-brand-accent px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-900 transition hover:shadow-glow"
                  >
                    Send
                  </button>
                </form>
              </div>
            </div>

            <aside className="flex flex-col gap-4">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900/80 to-slate-900/60 p-6 text-sm text-white/80"
              >
                <h2 className="text-lg font-semibold text-white">Why drivers trust De Jongh&apos;s</h2>
                <ul className="mt-3 list-outside list-disc space-y-2 pl-4">
                  <li>Manufacturer-approved repair techniques and lifetime workmanship guarantees.</li>
                  <li>Insurance-friendly estimates with photo documentation and same-day submission.</li>
                  <li>Courtesy car arrangements and towing partners for major collisions.</li>
                  <li>Colour-matched spray booth finishes baked to OEM durability.</li>
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-3xl border border-brand-accent/40 bg-brand-accent/15 p-6 text-sm text-white"
              >
                <h3 className="text-lg font-semibold text-white">Need help fast?</h3>
                <p className="mt-2 text-white/80">
                  Call 021 853 1234 for emergency towing or after-hours assistance. Leave a voicemail and we will
                  return your call first thing in the morning.
                </p>
                <div className="mt-4 rounded-2xl border border-white/20 bg-white/10 p-3 text-xs text-white/70">
                  <p className="font-semibold text-white">Insurance claims</p>
                  <p>
                    Send your claim number to <span className="font-medium">claims@dejonghs-panel.co.za</span> and
                    our admin team will coordinate directly with assessors.
                  </p>
                </div>
              </motion.div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
