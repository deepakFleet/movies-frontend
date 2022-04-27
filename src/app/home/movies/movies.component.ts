import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, firstValueFrom, of, switchMap } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { AddMovieFormComponent } from 'src/app/components/add-movie-form/add-movie-form.component';
import { Genre, Movie } from './movie.model';
import { MovieService } from './movie.service';

export interface DropDownOption {
  name: string;
  code: string;
}

const SORT_BY_OPTIONS: Array<DropDownOption> = [
  {
    name: 'Upvotes',
    code: 'upVotes',
  },
  {
    name: 'Downvotes',
    code: 'downVotes',
  },
  {
    name: 'Release Date',
    code: 'releaseDate',
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
export class MoviesComponent implements OnInit {
  constructor(
    public movieService: MovieService,
    public authService: AuthService,
    public route: ActivatedRoute,
    public elRef: ElementRef,
    public router: Router
  ) {}

  @ViewChild(AddMovieFormComponent, { static: false })
  ADD_MOVIE_FORM!: AddMovieFormComponent;
  dialogCtaDispatcher$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  movies$ = this.movieService.movies$;
  genres$ = this.movieService.genres$;
  favouriteGenres$: BehaviorSubject<any> = new BehaviorSubject([]);
  showAddMovieModalBinding: boolean = false;
  user$ = this.authService.user;
  genreSelected: Genre | null = null;
  sortByOptions: Array<DropDownOption> = SORT_BY_OPTIONS;
  sortOrderOptions: Array<DropDownOption> = SORT_ORDER_OPTIONS;
  sortedBy: DropDownOption | null = null;
  sortedOrder: DropDownOption | null = null;
  viewMode: DropDownOption | undefined = [...VIEW_OPTIONS].find(
    res => res.code === 'all'
  );
  viewOptions: Array<DropDownOption> = VIEW_OPTIONS;
  searchTerm: string = '';
  showWriteReviewModal = false;
  movieReview: string = '';
  selectedMovieForReview = null;
  groupedGenres$ = this.genres$.pipe(
    switchMap((genres: Genre[]) =>
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
                  (genre: Genre) =>
                    !favourites.find(
                      (favourite: Genre) => favourite.id == genre.id
                    )
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
  recommendedMovies: Array<any> = [];

  onFavouriteClick(event: any, genre: Genre) {
    event.stopPropagation();
    let currentVal = this.favouriteGenres$.getValue();
    if (currentVal.indexOf(genre) == -1) {
      this.favouriteGenres$.next([...currentVal, genre]);
    } else {
      currentVal.splice(currentVal.indexOf(genre), 1);
      this.favouriteGenres$.next(currentVal);
    }
    this.movieService.addFavouriteGenre(this.favouriteGenres$.value);
  }

  showAddMovieModal() {
    this.showAddMovieModalBinding = true;
  }

  dispatchCtaAction() {
    this.ADD_MOVIE_FORM.onListenerTriggered();
    this.showAddMovieModalBinding = false;
  }

  getFormattedMovieGenres(genres: Genre[]) {
    return genres.map((genre: Genre) => genre.genre).join(',');
  }

  onSortByChange(value: DropDownOption) {
    this.movieService.sortBy$.next(value.code);
  }

  onSortOrderChange(value: DropDownOption) {
    this.movieService.sortOrder$.next(value.code);
  }

  onFilteredGenreChange(value: Genre) {
    this.movieService.filteredGenre$.next(value);
  }

  onSearchInputChange() {
    this.movieService.movieSearchTerm$.next(this.searchTerm);
  }

  voteMovie(movie: Movie, vote: boolean) {
    this.movieService.voteMovie(movie, vote);
  }

  viewModeChange() {
    if (this.viewMode?.code == 'recommended') {
      this.movieService.getRecommendedMovies().then((res: any) => {
        this.recommendedMovies = res.content;
      });
    }
  }

  ngOnInit(): void {
    let favouriteGenres = this.movieService.getFavouriteGenres();
    favouriteGenres.then(res => {
      this.favouriteGenres$.next(res);
    });
  }

  openFavDropdown() {
    setTimeout(() => {
      const yourDropdown =
        this.elRef.nativeElement.querySelector('.genre-dropdown');
      if (yourDropdown) {
        yourDropdown.click();
      }

      setTimeout(() => {
        const tooltipToFocus =
          this.elRef.nativeElement.querySelector('.star-btn');
        tooltipToFocus.dispatchEvent(new Event('mouseenter'));
      }, 100);
    }, 100);
  }

  showAddFavourites() {
    this.viewMode = [...VIEW_OPTIONS].find(res => res.code === 'all');
    this.openFavDropdown();
  }

  writeReview() {
    this.movieService.addReview(this.selectedMovieForReview, this.movieReview);
    this.movieReview = '';
    this.showWriteReviewModal = false;
  }
}
