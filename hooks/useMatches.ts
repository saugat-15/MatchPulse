'use client';

import { useEffect, useState } from 'react';
import type { MatchListItem } from '@/types/tennis';

export function useMatches() {
  const [matches, setMatches] = useState<MatchListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadMatches() {
      try {
        const response = await fetch('/api/matches');
        if (!response.ok) return;
        const data = (await response.json()) as MatchListItem[];
        if (isMounted) {
          setMatches(data);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadMatches();

    return () => {
      isMounted = false;
    };
  }, []);

  return { matches, loading };
}
