import { getMatchSnapshot } from '@/lib/dataCache';
import type { MatchSnapshot } from '@/types/tennis';

function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomGameScore(): string {
    const scores = ['0', '15', '30', '40', 'AD'] as const;
    return scores[randomInt(0, scores.length - 1)] ?? '0';
}

function randomizeSnapshot(base: MatchSnapshot): MatchSnapshot {
    return {
        ...base,
        match: {
            ...base.match,
            currentSet: randomInt(1, 5),
            elapsedTime: `${String(randomInt(0, 2)).padStart(2, '0')}:${String(randomInt(0, 59)).padStart(2, '0')}:${String(randomInt(0, 59)).padStart(2, '0')}`,
        },
        players: base.players.map((player) => ({
            ...player,
            score: {
                sets: player.score.sets.map(() => randomInt(0, 6)),
                currentGame: randomGameScore(),
            },
            stats: {
                ...player.stats,
                aces: randomInt(0, 20),
                winners: randomInt(8, 35),
                unforcedErrors: randomInt(4, 22),
                firstServePct: randomInt(52, 82),
                breakPointsWon: `${randomInt(0, 4)}/${randomInt(1, 6)}`,
                doubleFaults: randomInt(0, 6),
                firstServePointsWon: randomInt(60, 82),
                secondServePointsWon: randomInt(42, 65),
                returnPointsWon: randomInt(35, 55),
                netPointsWon: `${randomInt(3, 12)}/${randomInt(10, 18)}`,
                avgServeSpeed: randomInt(175, 198),
                maxServeSpeed: randomInt(205, 228),
                totalPointsWon: randomInt(40, 85),
            },
        })) as MatchSnapshot['players'],
        momentum: base.momentum.map((m) => ({
            ...m,
            value: randomInt(-6, 6),
        })),
    };
}

export async function GET(request: Request) {
    let base: MatchSnapshot;
    try {
        base = await getMatchSnapshot();
    } catch (err) {
        console.error('[stream] failed to load snapshot', err);
        return new Response('Failed to initialize stream', { status: 500 });
    }

    const headers = {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
    };
    const encoder = new TextEncoder();
    let seq = 0;

    const stream = new ReadableStream({
        start(controller) {
            const send = (payload: MatchSnapshot) => {
                seq += 1;
                controller.enqueue(
                    encoder.encode(`id: ${seq}\ndata: ${JSON.stringify(payload)}\n\n`)
                );
            };
            const tick = () => send(randomizeSnapshot(base));
            tick();
            const intervalId = setInterval(tick, 3000);
            request.signal.addEventListener('abort', () => {
                clearInterval(intervalId);
                try { controller.close(); } catch { /* already closed */ }
            });
        },
    });

    return new Response(stream, { headers, status: 200 });
}
