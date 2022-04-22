import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  from,
  map,
  mergeMap,
  of,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { randDarkColor } from 'src/app/utils/color-generator';
import { environment } from 'src/environments/environment';
import { Movie } from './movie.model';

const BASE_URL = environment.BASE_URL;

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  constructor(private http: HttpClient) {}

  movies$: BehaviorSubject<Movie[]> = new BehaviorSubject<Movie[]>([]);
  randomColor$ = of('').pipe(map(res => randDarkColor()));
  genres$ = this.http.get(`assets/mock/genres.json`).pipe(
    map((res: any) => res.genres),
    map((res: any) => {
      return res.map((res: any, idx: any) => {
        return {
          name: res,
          code: idx,
        };
      });
    }),
    tap(console.log)
  );

  getMovies(): Observable<Movie[]> {
    return this.http
      .get<Movie[]>('assets/mock/movies.json')
      .pipe(
        map(res => res.sort(() => Math.random() - Math.random()).slice(0, 20))
      );
  }
}
