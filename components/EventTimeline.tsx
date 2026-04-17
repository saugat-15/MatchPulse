import type { MatchEvent } from '@/types/tennis';

function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  } catch {
    return iso;
  }
}

function eventDot(description: string): string {
  const lower = description.toLowerCase();
  if (lower.includes('ace')) return 'bg-blue-500';
  if (lower.includes('winner')) return 'bg-green-500';
  if (lower.includes('double fault') || lower.includes('double-fault')) return 'bg-red-500';
  if (lower.includes('break')) return 'bg-yellow-500';
  return 'bg-zinc-500';
}

export function EventTimeline({ events }: { events: MatchEvent[] }) {
  const sorted = [...events].reverse().slice(0, 12);

  if (sorted.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
        <h3 className="text-sm font-semibold text-zinc-300 mb-3">Match Events</h3>
        <p className="text-xs text-zinc-600">No events yet.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
      <h3 className="text-sm font-semibold text-zinc-300 mb-4">Match Events</h3>
      <ol className="relative border-l border-zinc-800 space-y-4 ml-2">
        {sorted.map((event) => (
          <li key={event.id} className="pl-5 relative">
            <span
              className={`absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full ${eventDot(event.description)}`}
            />
            <p className="text-xs text-zinc-400 leading-snug">{event.description}</p>
            <time className="text-[10px] text-zinc-600 font-mono">{formatTime(event.timestamp)}</time>
          </li>
        ))}
      </ol>
    </div>
  );
}
