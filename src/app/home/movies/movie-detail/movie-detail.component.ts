import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { MovieService } from '../movie.service';

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.scss'],
})
export class MovieDetailComponent {
  movie$ = this.route.params.pipe(
    switchMap(params => {
      return this.movieServie.getMovieById(parseInt(params['id']));
    })
  );

  constructor(
    private route: ActivatedRoute,
    private movieServie: MovieService
  ) {}
}
