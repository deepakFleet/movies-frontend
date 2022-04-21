import { Component, OnInit } from '@angular/core';
import { of } from 'rxjs';
import { MovieService } from './movie.service';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss'],
})
export class MoviesComponent implements OnInit {
  constructor(public movieService: MovieService) {}
  movies$ = this.movieService.getMovies();
  ngOnInit(): void {}
}
