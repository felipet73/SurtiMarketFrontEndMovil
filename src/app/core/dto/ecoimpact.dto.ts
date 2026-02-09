export type Dimension = 'waste' | 'transport' | 'energy' | 'water' | 'consumption';

export interface Radar5 {
  waste: number;
  transport: number;
  energy: number;
  water: number;
  consumption: number;
}

export interface EcoImpactAiMessage {
  title: string;
  text: string;
  cta: string;
  dimension: Dimension;
}

export interface EcoImpactMeDto {
  weekKey: string;
  groupId: string;
  focusDimension: Dimension;
  baselineRadar: Radar5;
  currentRadar: Radar5;
  targetRadar: Radar5;
  progressPercent?: number;
  ai: {
    summary: string;
    messages: EcoImpactAiMessage[];
  };
}

export interface EcoImpactLeaderboardLeader {
  rank: number;
  groupId: string;
  name: string;
  score: number;
  deltaRank: number;
}

export interface EcoImpactLeaderboardDto {
  weekKey: string;
  updatedAt: string;
  myGroup: { rank: number; score: number; groupId?: string };
  leaders: EcoImpactLeaderboardLeader[];
}

export interface EcoImpactProgressPoint {
  dateKey: string;
  score: number;
}

export interface EcoImpactProgressRankPoint {
  dateKey: string;
  rank: number;
}

export interface EcoImpactProgressDto {
  weekKey: string;
  pointsSeries: EcoImpactProgressPoint[];
  rankSeries?: EcoImpactProgressRankPoint[];
}
