import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUniverse } from '@/lib/UniverseContext';
import { Zap, ShieldCheck, MessageCircle } from 'lucide-react';

// ─── Organic breathing pulse for the live indicator ────────────────────────
const LivePulse: React.FC = () => (
  <span className="relative flex items-center justify-center w-2 h-2" aria-hidden>
    {/* Outer ambient ring — slow, organic fade */}
    <motion.span
      className="absolute inset-0 rounded-full bg-emerald-500"
      animate={{ scale: [1, 2.2, 1], opacity: [0.5, 0, 0.5] }}
      transition={{ duration: 3.2, ease: 'easeInOut', repeat: Infinity, repeatDelay: 0.4 }}
    />
    {/* Inner solid dot */}
    <span className="relative w-1.5 h-1.5 rounded-full bg-emerald-400" />
  </span>
);

// ─── Per-broadcast type config ──────────────────────────────────────────────
const typeConfig = {
  discovery: {
    Icon: Zap,
    color: 'text-[var(--theme-primary)]',
    bg: 'bg-[var(--theme-primary)]/10',
  },
  alert: {
    Icon: ShieldCheck,
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
  },
  message: {
    Icon: MessageCircle,
    color: 'text-[var(--theme-text-secondary)]',
    bg: 'bg-white/5',
  },
} as const;

type BroadcastType = keyof typeof typeConfig;

// ─── Single row ─────────────────────────────────────────────────────────────
interface BroadcastRowProps {
  sender: string;
  message: string;
  timestamp: string | number;
  type: BroadcastType;
  index: number;
}

const BroadcastRow: React.FC<BroadcastRowProps> = ({
  sender,
  message,
  timestamp,
  type,
  index,
}) => {
  const cfg = typeConfig[type] ?? typeConfig.message;
  const { Icon } = cfg;
  const time = new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1], delay: index * 0.06 }}
      className="group flex items-start gap-3 py-3.5
                 border-b border-[var(--theme-border)] last:border-b-0"
    >
      {/* Icon badge — no card, just a soft tinted circle */}
      <div
        className={`mt-0.5 flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center
                    ${cfg.bg} ${cfg.color} transition-opacity`}
      >
        <Icon size={13} strokeWidth={1.75} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Sender + time on one line */}
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <span
            className="text-[11px] font-medium tracking-wide
                       text-[var(--theme-text-secondary)]
                       group-hover:text-[var(--theme-text)] transition-colors duration-200"
          >
            {sender}
          </span>
          <span className="flex-shrink-0 text-[10px] tabular-nums text-[var(--theme-text-tertiary)]">
            {time}
          </span>
        </div>

        {/* Message body */}
        <p
          className="text-[13px] leading-relaxed text-[var(--theme-text-secondary)]
                     group-hover:text-[var(--theme-text)] transition-colors duration-200
                     line-clamp-2"
        >
          {message}
        </p>
      </div>
    </motion.div>
  );
};

// ─── Section header ─────────────────────────────────────────────────────────
const SectionHeader: React.FC<{ count: number }> = ({ count }) => (
  <div className="flex items-center justify-between mb-1">
    <span className="text-[11px] font-medium tracking-widest uppercase text-[var(--theme-text-tertiary)]">
      Crew Broadcast
    </span>

    <span className="flex items-center gap-1.5">
      <LivePulse />
      <span
        className="text-[10px] font-medium text-emerald-400 tabular-nums"
        aria-live="polite"
        aria-label={`${count} live message${count !== 1 ? 's' : ''}`}
      >
        {count > 0 ? `${count} live` : 'live'}
      </span>
    </span>
  </div>
);

// ─── Main component ──────────────────────────────────────────────────────────
export const CrewBroadcast: React.FC = () => {
  const { broadcasts } = useUniverse();

  return (
    <section aria-label="Crew broadcast feed">
      <SectionHeader count={broadcasts.length} />

      {/* Hairline separator between header and feed */}
      <div className="h-px bg-[var(--theme-border)] mb-1" />

      <AnimatePresence initial={false}>
        {broadcasts.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-10 text-center text-[12px] text-[var(--theme-text-tertiary)]"
          >
            No recent transmissions
          </motion.div>
        ) : (
          broadcasts.map((broadcast, i) => (
            <BroadcastRow
              key={broadcast.id}
              sender={broadcast.sender}
              message={broadcast.message}
              timestamp={broadcast.timestamp}
              type={(broadcast.type as BroadcastType) ?? 'message'}
              index={i}
            />
          ))
        )}
      </AnimatePresence>
    </section>
  );
};
