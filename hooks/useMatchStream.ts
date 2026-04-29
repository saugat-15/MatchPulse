'use client';

import { useEffect, useRef, useState } from 'react';
import type { MatchSnapshot } from '@/types/tennis';

type StreamStatus = 'connecting' | 'live' | 'reconnecting';

const MAX_RETRIES = 10;
const BASE_RETRY_MS = 1000;
const SLOW_LOAD_THRESHOLD_MS = 5000;

export function useMatchStream() {
  const [data, setData] = useState<MatchSnapshot | null>(null);
  const [status, setStatus] = useState<StreamStatus>('connecting');
  const [isSlowLoading, setIsSlowLoading] = useState(false);
  const retryTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const retryCount = useRef(0);

  useEffect(() => {
    let es: EventSource;
    let isMounted = true;
    const slowLoadTimer = setTimeout(() => {
      if (isMounted) setIsSlowLoading(true);
    }, SLOW_LOAD_THRESHOLD_MS);

    async function loadInitialSnapshot() {
      try {
        const response = await fetch('/api/match-snapshot');
        if (!response.ok) return;
        const snapshot = (await response.json()) as MatchSnapshot;
        if (isMounted) {
          setData(snapshot);
          setIsSlowLoading(false);
        }
      } catch {
        // Keep silent; SSE stream will still attempt to connect.
      }
    }

    function connect() {
      es = new EventSource('/api/stream');

      es.onopen = () => {
        retryCount.current = 0;
        setStatus('live');
      };

      es.onmessage = (event) => {
        setData(JSON.parse(event.data) as MatchSnapshot);
        setIsSlowLoading(false);
        setStatus('live');
      };

      es.onerror = () => {
        es.close();
        if (retryCount.current >= MAX_RETRIES) return;
        setStatus('reconnecting');
        const delay = Math.min(BASE_RETRY_MS * 2 ** retryCount.current, 30000);
        retryCount.current += 1;
        retryTimeout.current = setTimeout(connect, delay);
      };
    }

    loadInitialSnapshot();
    connect();

    return () => {
      isMounted = false;
      es?.close();
      if (retryTimeout.current) clearTimeout(retryTimeout.current);
      clearTimeout(slowLoadTimer);
    };
  }, []);

  return { data, status, isSlowLoading };
}
