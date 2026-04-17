import { NextResponse } from 'next/server';
import type { MatchListItem, MatchSnapshot } from '@/types/tennis';
import { MATCH_LIST } from '@/lib/matchList';
import { getMatchSnapshot } from '@/lib/dataCache';

const MIN_LIVE_MATCHES = 4;

function normalizeName(name: string): string {
    return name
        .replace(/[^a-zA-Z\s]/g, '')
        .trim()
        .toLowerCase();
}

function lastName(name: string): string {
    const cleaned = normalizeName(name);
    const parts = cleaned.split(/\s+/).filter(Boolean);
    return parts[parts.length - 1] ?? cleaned;
}

function matchupKey(match: MatchListItem): string {
    const p1 = lastName(match.players[0].name);
    const p2 = lastName(match.players[1].name);
    return [p1, p2].sort().join('-');
}

function uniqueByMatchup(matches: MatchListItem[]): MatchListItem[] {
    const seen = new Set<string>();
    const output: MatchListItem[] = [];
    for (const match of matches) {
        const key = matchupKey(match);
        if (seen.has(key)) continue;
        seen.add(key);
        output.push(match);
    }
    return output;
}

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

function promoteToLive(match: MatchListItem, index: number): MatchListItem {
    return {
        ...match,
        id: `${match.id}-live-${index}`,
        status: 'LIVE',
        startTime: new Date().toISOString(),
        players: match.players.map((player) => ({
            ...player,
            currentGame: player.currentGame && player.currentGame.length > 0 ? player.currentGame : '0',
        })) as MatchListItem['players'],
    };
}

function buildMockLiveMatches(seed: MatchListItem[], targetCount: number): MatchListItem[] {
    const playerPool = seed.flatMap((match) =>
        match.players.map((player) => ({
            name: player.name,
            country: player.country,
            seed: player.seed,
        }))
    );

    const synthetic: MatchListItem[] = [];
    let cursor = 0;
    while (synthetic.length < targetCount && playerPool.length >= 2) {
        const p1 = playerPool[cursor % playerPool.length];
        const p2 = playerPool[(cursor + 3) % playerPool.length];
        cursor += 1;
        if (!p1 || !p2 || p1.name === p2.name) continue;

        synthetic.push({
            id: `mock-live-${cursor}`,
            tournament: 'Australian Open',
            surface: 'Hard',
            round: 'Live Court Feed',
            court: `Court ${((cursor - 1) % 8) + 1}`,
            status: 'LIVE',
            startTime: new Date().toISOString(),
            players: [
                { ...p1, sets: [Math.floor(Math.random() * 7), Math.floor(Math.random() * 7)], currentGame: '30' },
                { ...p2, sets: [Math.floor(Math.random() * 7), Math.floor(Math.random() * 7)], currentGame: '15' },
            ],
        });
    }
    return uniqueByMatchup(synthetic);
}

export async function GET(): Promise<NextResponse<MatchListItem[]>> {
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
}
