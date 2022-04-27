import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MessageService } from 'primeng/api';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { ChipModule } from 'primeng/chip';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { MultiSelectModule } from 'primeng/multiselect';
import { PanelMenuModule } from 'primeng/panelmenu';
import { PasswordModule } from 'primeng/password';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectButtonModule } from 'primeng/selectbutton';
import { StyleClassModule } from 'primeng/styleclass';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthFormComponent } from './auth/auth-form/auth-form.component';
import { AddMovieFormComponent } from './components/add-movie-form/add-movie-form.component';
import { HomeComponent } from './home/home.component';
import { MovieDetailComponent } from './home/movies/movie-detail/movie-detail.component';
import { MoviesComponent } from './home/movies/movies.component';
import { SearchComponent } from './home/sidebar/search/search.component';
import { SidebarComponent } from './home/sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { UserDropdownComponent } from './navbar/user-dropdown/user-dropdown.component';

const PrimeNgModules = [
  MenubarModule,
  AutoCompleteModule,
  AvatarModule,
  MenuModule,
  CheckboxModule,
  ButtonModule,
  StyleClassModule,
  InputTextModule,
  PasswordModule,
  DividerModule,
  MessagesModule,
  MessageModule,
  CardModule,
  PanelMenuModule,
  InputTextareaModule,
  DropdownModule,
  TooltipModule,
  DialogModule,
  MultiSelectModule,
  ChipModule,
  CalendarModule,
  ToastModule,
  ProgressSpinnerModule,
  SelectButtonModule,
];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SearchComponent,
    UserDropdownComponent,
    HomeComponent,
    AuthFormComponent,
    MoviesComponent,
    SidebarComponent,
    AddMovieFormComponent,
    MovieDetailComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    ...PrimeNgModules,
  ],
  providers: [MessageService],
  bootstrap: [AppComponent],
})
export class AppModule {}
