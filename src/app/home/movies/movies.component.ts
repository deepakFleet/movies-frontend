import { Component } from '@angular/core';
import { BehaviorSubject, of, switchMap } from 'rxjs';
import { MovieService } from './movie.service';

export interface DropDownOption {
  name: string;
  code: string;
}

const SORT_BY_OPTIONS: Array<DropDownOption> = [
  {
    name: 'Upvotes',
    code: 'UV',
  },
  {
    name: 'Downvotes',
    code: 'DV',
  },
  {
    name: 'Release Date',
    code: 'RD',
  },
];
const SORT_ORDER_OPTIONS: Array<DropDownOption> = [
  {
    name: 'Ascending',
    code: 'asc',
  },
  {
    name: 'Descending',
    code: 'desc',
  },
];

const VIEW_OPTIONS: Array<DropDownOption> = [
  {
    name: 'All',
    code: 'all',
  },
  {
    name: 'Recommended',
    code: 'recommended',
  },
];

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss'],
})
export class MoviesComponent {
  constructor(public movieService: MovieService) {}
  movies$ = this.movieService.getMovies();
  genres$ = this.movieService.genres$;
  favouriteGenres$: BehaviorSubject<any> = new BehaviorSubject([]);
  genreSelected: DropDownOption | null = null;
  sortByOptions: Array<DropDownOption> = SORT_BY_OPTIONS;
  sortOrderOptions: Array<DropDownOption> = SORT_ORDER_OPTIONS;
  sortedBy: DropDownOption | null = null;
  sortedOrder: DropDownOption | null = null;
  viewMode: DropDownOption | undefined = [...VIEW_OPTIONS].find(
    res => res.code === 'all'
  );
  viewOptions: Array<DropDownOption> = VIEW_OPTIONS;

  groupedGenres$ = this.genres$.pipe(
    switchMap((genres: any) =>
      this.favouriteGenres$.pipe(
        switchMap((favourites: any) => {
          if (favourites.length) {
            let grouped: any = [
              {
                label: 'Favourites',
                value: 'fav',
                items: favourites,
              },
              {
                label: 'Other',
                value: 'normal',
                items: genres.filter(
                  (genre: any) => favourites.indexOf(genre) == -1
                ),
              },
            ];
            return of(grouped);
          } else {
            return of(genres);
          }
        })
      )
    )
  );

  onFavouriteClick(event: any, genre: any) {
    event.stopPropagation();
    let currentVal = this.favouriteGenres$.getValue();
    if (currentVal.indexOf(genre) == -1) {
      this.favouriteGenres$.next([...currentVal, genre]);
    } else {
      currentVal.splice(currentVal.indexOf(genre), 1);
      this.favouriteGenres$.next(currentVal);
    }
  }
}
