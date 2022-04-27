import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthFormComponent } from './auth/auth-form/auth-form.component';
import { HomeComponent } from './home/home.component';
import { MovieDetailComponent } from './home/movies/movie-detail/movie-detail.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'movie/:id',
    component: MovieDetailComponent,
  },
  {
    path: 'login',
    component: AuthFormComponent,
    data: {
      mode: 'login',
    },
  },
  {
    path: 'register',
    component: AuthFormComponent,
    data: {
      mode: 'register',
    },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
