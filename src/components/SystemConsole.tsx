import React, { useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { useGameState, BetLog } from '@/hooks/useGameState';

interface Props {
  open: boolean;
  onClose: () => void;
}

const SystemConsole: React.FC<Props> = ({ open, onClose }) => {
  const { history, balance } = useGameState();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [history.length]);

  if (!open) return null;

  const formatTime = (ts: number) => new Date(ts).toLocaleTimeString('en-IN', { hour12: false });

  return (
    <div className="fixed bottom-24 right-6 z-40 w-96 max-h-[60vh] glass-elevated rounded-xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-4 fade-in duration-200">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/30">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse-neon" />
          <span className="font-mono text-xs text-accent font-semibold tracking-wider">SYSTEM CONSOLE</span>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground click-glow rounded p-1">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="px-4 py-2 border-b border-border/20 font-mono text-xs text-muted-foreground">
        <span>SYS.BALANCE = </span>
        <span className="neon-text-gold">₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
        <span> | LOGS: {history.length}</span>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-1 max-h-80">
        {history.length === 0 && (
          <p className="font-mono text-xs text-muted-foreground text-center py-8">No activity logged yet. Place a bet to begin.</p>
        )}
        {history.map((log: BetLog) => (
          <div key={log.id} className="font-mono text-[11px] leading-relaxed flex gap-2">
            <span className="text-muted-foreground shrink-0">[{formatTime(log.timestamp)}]</span>
            <span className={log.result === 'win' ? 'text-accent' : 'text-destructive'}>
              {log.result === 'win' ? '✓ WIN' : '✗ LOSS'}
            </span>
            <span className="text-secondary-foreground">
              {log.game} | ₹{log.amount} × {log.multiplier.toFixed(2)}x
              {log.result === 'win' && <span className="text-accent"> → ₹{log.payout.toFixed(0)}</span>}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SystemConsole;
