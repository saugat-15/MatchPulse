'use client';

import { useEffect, useRef, useState } from 'react';
import type { MatchSnapshot } from '@/types/tennis';

type StreamStatus = 'connecting' | 'live' | 'reconnecting';

export function useMatchStream() {
  const [data, setData] = useState<MatchSnapshot | null>(null);
  const [status, setStatus] = useState<StreamStatus>('connecting');
  const retryTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let es: EventSource;
    let isMounted = true;

    async function loadInitialSnapshot() {
      try {
        const response = await fetch('/api/match-snapshot');
        if (!response.ok) return;
        const snapshot = (await response.json()) as MatchSnapshot;
        if (isMounted) {
          setData(snapshot);
        }
      } catch {
        // Keep silent; SSE stream will still attempt to connect.
      }
    }

    function connect() {
      es = new EventSource('/api/stream');

      es.onopen = () => {
        setStatus('live');
      };

      es.onmessage = (event) => {
        setData(JSON.parse(event.data) as MatchSnapshot);
        setStatus('live');
      };

      es.onerror = () => {
        es.close();
        setStatus('reconnecting');
        retryTimeout.current = setTimeout(() => {
          connect();
        }, 3000);
      };
    }

    loadInitialSnapshot();
    connect();

    return () => {
      isMounted = false;
      es?.close();
      if (retryTimeout.current) clearTimeout(retryTimeout.current);
    };
  }, []);

  return { data, status };
}
