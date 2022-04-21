import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BehaviorSubject, firstValueFrom, Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { LoginResponse } from '../models/api-response';
import { User } from '../models/user.model';

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

  constructor(
    private messageService: MessageService,
    private http: HttpClient,
    private router: Router
  ) {}

  get loadingState() {
    return this.loading$.asObservable();
  }

  get loginError() {
    return this.loginError$.asObservable();
  }

  get user() {
    return this.user$.asObservable();
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
      this.http.post(`${BASE_URL}/auth/signup`, {
        email: formGroup.get('email')?.value,
        password: formGroup.get('password')?.value,
        firstName: formGroup.get('firstName')?.value,
        lastName: formGroup.get('lastName')?.value,
      })
    ).then((response) => {
      this.router.navigate(['login']);
    });
  }

  public login(formGroup: FormGroup): void {
    this.toggleLoadingState();
    firstValueFrom(
      this.http
        .post<LoginResponse>(
          `${BASE_URL}/auth/signin
      `,
          {
            username: formGroup.get('email')?.value,
            password: formGroup.get('password')?.value,
          }
        )
        .pipe(catchError((res) => of(res)))
    ).then((response: LoginResponse) => {
      this.toggleLoadingState();
      if (response.status == 500 || response.status == 401) {
        this.setInvalidCredentialMessage();
      } else {
        this.setUser(response);
        this.router.navigate(['home']);
      }
    });
  }

  public setInvalidCredentialMessage(): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Invalid Credentials!',
      detail: 'Please try again',
    });
  }
}
