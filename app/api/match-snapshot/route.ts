import { NextResponse } from 'next/server';
import type { MatchSnapshot } from '@/types/tennis';
import { getMatchSnapshot } from '@/lib/dataCache';

export async function GET(): Promise<NextResponse<MatchSnapshot | { error: string }>> {
    try {
        const data = await getMatchSnapshot();
        return NextResponse.json(data);
    } catch (err) {
        console.error('[match-snapshot]', err);
        return NextResponse.json({ error: 'Failed to load match data' }, { status: 500 });
    }
}
