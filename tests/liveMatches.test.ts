import { describe, expect, it } from 'vitest';
import type { MatchListItem } from '../types/tennis';
import { buildMockLiveMatches, promoteToLive, uniqueByMatchup } from '../lib/liveMatches';

function createMatch(
  id: string,
  p1: string,
  p2: string,
  status: MatchListItem['status'] = 'COMPLETED',
): MatchListItem {
  return {
    id,
    tournament: 'Australian Open',
    surface: 'Hard',
    round: "Men's Semi-Final",
    court: 'Rod Laver Arena',
    status,
    startTime: '2026-01-27T08:00:00Z',
    players: [
      { name: p1, country: 'SRB', sets: [6, 3], currentGame: '' },
      { name: p2, country: 'ESP', sets: [4, 4], currentGame: '' },
    ],
  };
}

describe('live match helpers', () => {
  it('deduplicates same matchup even with different name formats', () => {
    const matches = [
      createMatch('1', 'Novak Djokovic', 'Carlos Alcaraz', 'LIVE'),
      createMatch('2', 'N. Djokovic', 'C. Alcaraz', 'LIVE'),
      createMatch('3', 'Jannik Sinner', 'Alexander Zverev', 'LIVE'),
    ];

    const unique = uniqueByMatchup(matches);
    expect(unique).toHaveLength(2);
  });

  it('promotes non-live matches into live cards with current game values', () => {
    const promoted = promoteToLive(createMatch('4', 'Taylor Fritz', 'Tommy Paul'), 0);
    expect(promoted.status).toBe('LIVE');
    expect(promoted.id).toContain('-live-0');
    expect(promoted.players[0].currentGame).toBe('0');
    expect(promoted.players[1].currentGame).toBe('0');
  });

  it('builds mocked live cards up to target count when needed', () => {
    const seed = [
      createMatch('a', 'Novak Djokovic', 'Carlos Alcaraz'),
      createMatch('b', 'Jannik Sinner', 'Alexander Zverev'),
      createMatch('c', 'Taylor Fritz', 'Frances Tiafoe'),
      createMatch('d', 'Casper Ruud', 'Ben Shelton'),
    ];

    const mocked = buildMockLiveMatches(seed, 4);
    expect(mocked.length).toBeGreaterThanOrEqual(4);
    expect(mocked.every((match) => match.status === 'LIVE')).toBe(true);
  });
});
