import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MenubarModule } from 'primeng/menubar';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { StyleClassModule } from 'primeng/styleclass';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { CardModule } from 'primeng/card';
import { PanelMenuModule } from 'primeng/panelmenu';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { UserDropdownComponent } from './navbar/user-dropdown/user-dropdown.component';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './home/home.component';
import { AuthFormComponent } from './auth/auth-form/auth-form.component';
import { MessageService } from 'primeng/api';
import { MoviesComponent } from './home/movies/movies.component';
import { SidebarComponent } from './home/sidebar/sidebar.component';
import { SearchComponent } from './home/sidebar/search/search.component';

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
];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SearchComponent,
    UserDropdownComponent,
    LoginComponent,
    HomeComponent,
    AuthFormComponent,
    MoviesComponent,
    SidebarComponent,
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
