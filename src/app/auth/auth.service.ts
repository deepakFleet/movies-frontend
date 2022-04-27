import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BehaviorSubject, firstValueFrom, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { LoginResponse } from '../models/api-response';
import { User } from '../models/user.model';
import { LoginForm, SignUpForm } from './auth.model';

const BASE_URL = environment.BASE_URL;
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly loading$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  private readonly loginError$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  private readonly user$: BehaviorSubject<User | undefined> =
    new BehaviorSubject<User | undefined>(undefined);
  private readonly isLoggedIn$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  constructor(
    private messageService: MessageService,
    private http: HttpClient,
    private router: Router
  ) {
    let userFromLS = JSON.parse(localStorage.getItem('user')!);
    if (userFromLS) {
      this.setUser(userFromLS);
    }
  }

  get loadingState() {
    return this.loading$.asObservable();
  }

  get loginError() {
    return this.loginError$.asObservable();
  }

  get user() {
    return this.user$.asObservable();
  }

  get userId() {
    return this.user$.getValue()?.id;
  }

  get isLoggedIn() {
    return this.isLoggedIn$.asObservable();
  }

  public setUser(user: User | undefined) {
    this.user$.next(user);
  }

  public toggleLoadingState(): void {
    this.loading$.next(!this.loading$.getValue());
  }

  public setLoginError(value: boolean): void {
    this.loginError$.next(value);
  }

  public submit(formGroup: FormGroup): void {
    formGroup.get('formType')?.value == 'login'
      ? this.login(formGroup)
      : this.register(formGroup);
  }

  public register(formGroup: FormGroup): void {
    this.toggleLoadingState();
    firstValueFrom(
      this.http.post(
        `${BASE_URL}/api/auth/signup`,
        this.getRegisterForm(formGroup)
      )
    ).then((response: any) => {
      if (response.message == 'User registered successfully!') {
        this.login(
          new FormGroup({
            email: new FormControl(formGroup.get('email')?.value),
            password: new FormControl(formGroup.get('password')?.value),
          })
        );
      }
    });
  }

  public getRegisterForm(formGroup: FormGroup) {
    return {
      email: formGroup.get('email')?.value,
      password: formGroup.get('password')?.value,
      firstName: formGroup.get('firstName')?.value,
      lastName: formGroup.get('lastName')?.value,
    } as SignUpForm;
  }

  public login(formGroup: FormGroup): void {
    this.toggleLoadingState();
    firstValueFrom(
      this.http
        .post<LoginResponse>(
          `${BASE_URL}/api/auth/signin
      `,
          {
            username: formGroup.get('email')?.value,
            password: formGroup.get('password')?.value,
          } as LoginForm
        )
        .pipe(catchError(res => of(res)))
    ).then((response: LoginResponse) => {
      this.toggleLoadingState();
      if (response.status == 0) {
        this.noInternetAccessMessage();
        return;
      }
      if (response.status == 500 || response.status == 401) {
        this.setInvalidCredentialMessage();
      } else {
        this.setUser(response);
        localStorage.setItem('user', JSON.stringify(response));
        this.router.navigate(['home']);
      }
    });
  }

  public noInternetAccessMessage(): void {
    this.messageService.add({
      severity: 'warn',
      summary: 'Cannot reach servers!',
      detail: 'Please try again',
    });
  }

  public setInvalidCredentialMessage(): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Invalid Credentials!',
      detail: 'Please try again',
    });
  }

  public logoutUser() {
    localStorage.removeItem('user');
    this.setUser(undefined);
  }
}
