import type { MatchSnapshot } from '@/types/tennis';
import mockData from '@/lib/match.json';

type ApiFixture = {
    id: number;
    tournament: { name: string; surface?: string };
    league: { name: string; round?: string };
    status: { short: string; elapsed?: number | null };
    venue?: { name?: string };
    teams: {
        home: { id: number; name: string };
        away: { id: number; name: string };
    };
    scores: {
        home: { current?: string | null; games: number[] };
        away: { current?: string | null; games: number[] };
    };
    h2h?: { home?: number; away?: number };
};

function formatElapsed(minutes: number | null | undefined): string {
    if (!minutes) return '00:00:00';
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`;
}

function mapFixtureToSnapshot(fixture: ApiFixture): MatchSnapshot {
    return {
        match: {
            id: String(fixture.id),
            tournament: fixture.tournament.name,
            court: fixture.venue?.name ?? 'Centre Court',
            status: fixture.status.short,
            currentSet: fixture.scores.home.games.length,
            elapsedTime: formatElapsed(fixture.status.elapsed),
            surface: fixture.tournament.surface ?? 'Hard',
            round: fixture.league.round ?? 'Round',
            h2h: {
                p1Wins: fixture.h2h?.home ?? 0,
                p2Wins: fixture.h2h?.away ?? 0,
            },
        },
        players: [
            {
                id: String(fixture.teams.home.id),
                name: fixture.teams.home.name,
                country: '',
                score: {
                    sets: fixture.scores.home.games,
                    currentGame: fixture.scores.home.current ?? '0',
                },
                // In-match stats not available at API-Sports free tier — use mock values
                stats: mockData.players[0]!.stats,
            },
            {
                id: String(fixture.teams.away.id),
                name: fixture.teams.away.name,
                country: '',
                score: {
                    sets: fixture.scores.away.games,
                    currentGame: fixture.scores.away.current ?? '0',
                },
                stats: mockData.players[1]!.stats,
            },
        ],
        momentum: mockData.momentum,
        events: mockData.events,
    };
}

// Module-level cache — persists for the lifetime of the Node.js process.
// In dev this means one fetch per server restart; in production one fetch per instance.
let cached: { data: MatchSnapshot; fetchedAt: number } | null = null;
const TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export async function getMatchSnapshot(): Promise<MatchSnapshot> {
    if (cached && Date.now() - cached.fetchedAt < TTL_MS) {
        return cached.data;
    }

    const apiKey = process.env.TENNIS_API_KEY;
    if (apiKey) {
        try {
            const res = await fetch('https://v1.tennis.api-sports.io/fixtures?live=all', {
                headers: { 'x-apisports-key': apiKey },
                cache: 'no-store',
            });
            if (res.ok) {
                const body = (await res.json()) as { response: ApiFixture[] };
                const fixture = body.response[0];
                if (fixture) {
                    const data = mapFixtureToSnapshot(fixture);
                    cached = { data, fetchedAt: Date.now() };
                    return data;
                }
            }
        } catch {
            // fall through to mock
        }
    }

    // No API key, no live match, or fetch failed — return mock
    return mockData as unknown as MatchSnapshot;
}
