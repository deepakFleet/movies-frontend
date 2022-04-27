import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MovieService } from 'src/app/home/movies/movie.service';

@Component({
  selector: 'app-add-movie-form',
  templateUrl: './add-movie-form.component.html',
  styleUrls: ['./add-movie-form.component.scss'],
})
export class AddMovieFormComponent {
  addMovieForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    genres: new FormControl(null, Validators.required),
    releaseDate: new FormControl(null, Validators.required),
  });
  genres$ = this.movieService.genres$;

  constructor(private movieService: MovieService) {}

  onListenerTriggered() {
    this.movieService.addMovie(this.addMovieForm);
  }
}
