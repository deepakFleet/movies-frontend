import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  firstValueFrom,
  map,
  Observable,
  of,
  switchMap,
  tap
} from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { randDarkColor } from 'src/app/utils/color-generator';
import { environment } from 'src/environments/environment';
import { Genre, Movie } from './movie.model';

const BASE_URL = environment.BASE_URL;

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  randomColor$ = of('').pipe(map(res => randDarkColor()));
  genres$ = this.http
    .get(`${BASE_URL}/api/public/genres`)
    .pipe(map((res: any) => res));
  sortBy$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(
    'id'
  );
  sortOrder$: BehaviorSubject<string | null> = new BehaviorSubject<
    string | null
  >('desc');

  filteredGenre$: BehaviorSubject<Genre | null> =
    new BehaviorSubject<Genre | null>(null);
  movieSearchTerm$: BehaviorSubject<string | null> = new BehaviorSubject<
    string | null
  >(null);
  refreshMovies$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  movies$ = combineLatest([
    this.movieSearchTerm$,
    this.sortBy$,
    this.sortOrder$,
    this.filteredGenre$,
    this.refreshMovies$,
  ]).pipe(
    debounceTime(500),
    switchMap(([searchTerm, sortBy, sortOrder, filteredGenre]) => {
      let composedSearchString = `${BASE_URL}/api/public/movies?page=0&size=100`;
      if (searchTerm?.length) {
        composedSearchString += `&movieName=${searchTerm}`;
      }
      if (sortBy?.length && sortOrder?.length) {
        composedSearchString += `&sort=${sortBy},${sortOrder}`;
      }
      if (filteredGenre?.id) {
        composedSearchString += `&genre=${filteredGenre.id}`;
      }
      return this.http.get(`${composedSearchString}`).pipe(
        map((res: any) => {
          return res.content;
        })
      );
    })
  );

  getFavouriteGenres() {
    return firstValueFrom(
      this.http
        .get(`${BASE_URL}/api/user?userId=${this.authService.userId}`, {
          headers: new HttpHeaders({
            Authorization:
              'Bearer ' +
              JSON.parse(localStorage.getItem('user')!)?.accessToken,
          }),
        })
        .pipe(map((res: any) => res.favouriteGenre))
    );
  }

  getMovies(): Observable<Movie[]> {
    return this.http
      .get<Movie[]>(`${BASE_URL}/api/public/movies?page=0&size=100`)
      .pipe(map((res: any) => res.content));
  }

  voteMovie(movie: Movie, vote: boolean) {
    firstValueFrom(
      this.http.post(
        `${BASE_URL}/api/vote`,
        {
          movieId: movie.id,
          userId: this.authService.userId,
          upvote: vote,
        },
        {
          headers: new HttpHeaders({
            Authorization:
              'Bearer ' +
              JSON.parse(localStorage.getItem('user')!)?.accessToken,
          }),
        }
      )
    ).then(res => {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: `${vote ? 'Upvoted' : 'Downvoted'} movie successfully`,
      });
      this.refreshMovies$.next(true);
    });
  }

  addMovie(form: FormGroup) {
    firstValueFrom(
      this.http.post(
        `${BASE_URL}/api/movie`,
        {
          genres: form.get('genres')?.value,
          releaseDate: form
            .get('releaseDate')
            ?.value.toISOString()
            .split('T')[0],
          name: form.get('name')?.value,
        },
        {
          headers: new HttpHeaders({
            Authorization:
              'Bearer ' +
              JSON.parse(localStorage.getItem('user')!)?.accessToken,
          }),
        }
      )
    ).then(res => {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Added Movie successfully',
      });
      this.refreshMovies$.next(true);
    });
  }

  addFavouriteGenre(genres: Genre[]) {
    firstValueFrom(
      this.http.post(
        `${BASE_URL}/api/user/${this.authService.userId}/favoritegenre`,
        {
          favouriteGenre: genres,
        },
        {
          headers: new HttpHeaders({
            Authorization:
              'Bearer ' +
              JSON.parse(localStorage.getItem('user')!)?.accessToken,
          }),
        }
      )
    ).then(res => {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Marked favourite(s) successfully',
      });
    });
  }

  getRecommendedMovies() {
    return firstValueFrom(
      this.http.get(
        `${BASE_URL}/api/movie/user/favGenre?userId=${this.authService.userId}&page=0&size=10`,
        {
          headers: new HttpHeaders({
            Authorization:
              'Bearer ' +
              JSON.parse(localStorage.getItem('user')!)?.accessToken,
          }),
        }
      )
    );
  }

  getMovieById(id: number) {
    return this.http
      .get(`${BASE_URL}/api/public/movie?id=${id}`)
      .pipe(tap(console.log));
  }

  addReview(movie: any, review: string) {
    firstValueFrom(
      this.http.post(
        `${BASE_URL}/api/review`,
        {
          movieId: movie.id,
          userId: this.authService.userId,
          review,
        },
        {
          headers: new HttpHeaders({
            Authorization:
              'Bearer ' +
              JSON.parse(localStorage.getItem('user')!)?.accessToken,
          }),
        }
      )
    ).then(res => {
      this.refreshMovies$.next(true);
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Added review successfully',
      });
    });
  }
}
