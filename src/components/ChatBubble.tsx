'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import clsx from 'clsx';

interface ChatBubbleProps {
  sender: 'agent' | 'user';
  children: ReactNode;
}

const bubbleVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 }
};

export function ChatBubble({ sender, children }: ChatBubbleProps) {
  return (
    <motion.div
      variants={bubbleVariants}
      initial="initial"
      animate="animate"
      transition={{ duration: 0.25 }}
      className={clsx('max-w-xl rounded-3xl px-5 py-4 text-sm leading-relaxed shadow-lg', {
        'self-start bg-slate-900/70 text-slate-100 backdrop-blur': sender === 'agent',
        'self-end bg-brand-accent text-slate-900': sender === 'user'
      })}
    >
      {children}
    </motion.div>
  );
}
