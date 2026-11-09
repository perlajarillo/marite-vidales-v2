export interface Review {
  quote: string;
  author: string;
  role?: string;
  index: number;
}

export type Reviews = Record<string, Review>;

export interface ReviewsData {
  reviews: Reviews;
  photo: {
    pictureUrl: string;
  };
}
