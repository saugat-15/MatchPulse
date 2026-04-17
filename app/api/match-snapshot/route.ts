import { NextResponse } from 'next/server';
import type { MatchSnapshot } from '@/types/tennis';
import { getMatchSnapshot } from '@/lib/dataCache';

export async function GET(): Promise<NextResponse<MatchSnapshot>> {
    const data = await getMatchSnapshot();
    return NextResponse.json(data);
}
