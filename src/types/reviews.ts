export interface Review {
  quote: string;
  author: string;
  role?: string;
}

export type Reviews = Record<string, Review>;
