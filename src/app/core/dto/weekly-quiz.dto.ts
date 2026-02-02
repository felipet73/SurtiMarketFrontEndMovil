export type Dimension = 'waste' | 'transport' | 'energy' | 'water' | 'consumption';

export interface WeeklyQuizMeDto {
  focusDimension: Dimension;
  focusScore: number;
  submissionStatus: {
    hasSubmitted: boolean;
    passed: boolean;
    scorePercent: number;
    correctCount: number;
    rewardGranted: boolean;
    ecoCoinsGranted: number;
  };
  instance: {
    id: string;
    weekKey: string;
    templateKey: string;
    focusDimension: Dimension;
    rewardEcoCoins: number;
    cardImage: { mimeType: string; base64: string };
    payload: {
      title: string;
      description: string;
      focusDimension: Dimension;
      ecoCoinsReward: number;
      timeLimitSec: number;
      questions: Array<{
        q: string;
        choices: string[];
        // backend lo manda, pero NO lo uses en front para validar
        answerIndex: number;
        explanation: string;
      }>;
    };
  };
}

export interface WeeklyQuizSubmitResponseDto {
  idempotent: boolean;
  passed: boolean;
  correctCount: number;
  totalQuestions: number;
  scorePercent: number;
  ecoCoinsGranted: number;
  rewardGranted: boolean;
}