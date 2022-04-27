export interface Movie {
  id: string;
  name: string;
  genres: Genre[];
  releaseDate: Date;
  upVotes: number;
  downVotes: number;
  reviews: string[];
}

export interface Genre {
  id: number;
  genre: string;
}
