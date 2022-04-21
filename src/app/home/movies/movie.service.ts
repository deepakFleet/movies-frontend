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
import { Movie } from './movie.model';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  movies$: BehaviorSubject<Movie[]> = new BehaviorSubject<Movie[]>([]);
  randomColor$ = of('').pipe(map(res => randDarkColor()));

  constructor(private http: HttpClient) {}

  getMovies(): Observable<Movie[]> {
    return this.http
      .get<Movie[]>('assets/mock/movies.json')
      .pipe(
        map(res => res.sort(() => Math.random() - Math.random()).slice(0, 20))
      );
  }
}
