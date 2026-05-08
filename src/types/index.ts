export interface Place {
  id: string;
  name: string;
  emoji: string;
  category: string;
  description: string;
}

export interface PlaceRating {
  placeId: string;
  score: number;
}

export interface SubmitData {
  ratings: PlaceRating[];
  topPlaces: RankedPlace[];
  submittedAt: string;
}

export interface RankedPlace extends Place {
  score: number;
  rank: number;
}

export type AppStep = "landing" | "rating" | "results";
