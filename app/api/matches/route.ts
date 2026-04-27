import { NextResponse } from 'next/server';
import type { MatchListItem, MatchSnapshot } from '@/types/tennis';
import { MATCH_LIST } from '@/lib/matchList';
import { getMatchSnapshot } from '@/lib/dataCache';
import { uniqueByMatchup, promoteToLive, buildMockLiveMatches, MIN_LIVE_MATCHES } from '@/lib/liveMatches';

function mapSnapshotToLiveListItem(snapshot: MatchSnapshot): MatchListItem {
    const [p1, p2] = snapshot.players;
    return {
        id: `live-${snapshot.match.id}`,
        tournament: snapshot.match.tournament,
        surface: snapshot.match.surface,
        round: snapshot.match.round,
        court: snapshot.match.court,
        status: 'LIVE',
        startTime: new Date().toISOString(),
        players: [
            {
                name: p1.name,
                country: p1.country,
                sets: p1.score.sets,
                currentGame: p1.score.currentGame,
            },
            {
                name: p2.name,
                country: p2.country,
                sets: p2.score.sets,
                currentGame: p2.score.currentGame,
            },
        ],
    };
}

export async function GET(): Promise<NextResponse> {
    try {
        const snapshot = await getMatchSnapshot();
        const snapshotLive = mapSnapshotToLiveListItem(snapshot);

        const base = [...MATCH_LIST];
        const existingLive = base.filter((match) => match.status === 'LIVE');
        const nonLive = base.filter((match) => match.status !== 'LIVE');

        let liveMatches = uniqueByMatchup([snapshotLive, ...existingLive]);

        if (liveMatches.length < MIN_LIVE_MATCHES) {
            const needed = MIN_LIVE_MATCHES - liveMatches.length;
            const promoted = uniqueByMatchup(
                nonLive.map((match, index) => promoteToLive(match, index))
            );
            liveMatches = uniqueByMatchup([...liveMatches, ...promoted]).slice(0, MIN_LIVE_MATCHES);

            if (liveMatches.length < MIN_LIVE_MATCHES) {
                const mocked = buildMockLiveMatches(base, needed);
                liveMatches = uniqueByMatchup([...liveMatches, ...mocked]).slice(0, MIN_LIVE_MATCHES);
            }
        }

        const liveIds = new Set(liveMatches.map((match) => match.id.replace(/-live-\d+$/, '')));
        const remaining = base.filter((match) => !liveIds.has(match.id));

        return NextResponse.json([...liveMatches, ...remaining]);
    } catch (err) {
        console.error('[matches]', err);
        return NextResponse.json({ error: 'Failed to load matches' }, { status: 500 });
    }
}
