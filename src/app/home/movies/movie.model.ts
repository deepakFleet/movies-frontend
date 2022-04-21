export interface Movie {
  id: string;
  name: string;
  genres: string[];
  releaseDate: Date;
  upvotes: number;
  downvotes: number;
  reviews: string[];
}
