export type MomentumPoint = {
  point: number;
  value: number;
};

export type MatchEvent = {
  id: string;
  timestamp: string;
  description: string;
};

export type PlayerStats = {
  aces: number;
  winners: number;
  unforcedErrors: number;
  firstServePct: number;
  breakPointsWon: string;
  doubleFaults: number;
  firstServePointsWon: number;
  secondServePointsWon: number;
  returnPointsWon: number;
  netPointsWon: string;
  avgServeSpeed: number;
  maxServeSpeed: number;
  totalPointsWon: number;
};

export type Player = {
  id: string;
  name: string;
  country: string;
  score: {
    sets: number[];
    currentGame: string;
  };
  stats: PlayerStats;
};

export type MatchInfo = {
  id: string;
  tournament: string;
  court: string;
  status: string;
  currentSet: number;
  elapsedTime: string;
  surface: string;
  round: string;
  h2h: { p1Wins: number; p2Wins: number };
};

export type MatchSnapshot = {
  match: MatchInfo;
  players: [Player, Player];
  momentum: MomentumPoint[];
  events: MatchEvent[];
};

export type MatchListPlayer = {
  name: string;
  country: string;
  seed?: number;
  sets: number[];
  currentGame?: string;
};

export type MatchListItem = {
  id: string;
  tournament: string;
  surface: string;
  round: string;
  court: string;
  status: 'LIVE' | 'UPCOMING' | 'COMPLETED';
  startTime: string;
  players: [MatchListPlayer, MatchListPlayer];
};
