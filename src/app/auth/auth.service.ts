import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BehaviorSubject, firstValueFrom, Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly loading$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  private readonly loginError$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

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

  public toggleLoadingState(): void {
    this.loading$.next(!this.loading$.getValue());
  }

  public setLoginError(value: boolean): void {
    this.loginError$.next(value);
  }

  public submit(formGroup: FormGroup): void {
    formGroup.get('formType')?.value == 'login'
      ? this.login(formGroup)
      : this.register();
  }

  public register(): void {}

  public login(formGroup: FormGroup) {
    this.toggleLoadingState();
    let loginAttempt = firstValueFrom(
      this.http.get('assets/mock/login.json').pipe(
        map((response: any) => {
          return (
            response.matchingCredentials.email.trim() ===
              formGroup.get('email')?.value &&
            response.matchingCredentials.password.trim() ===
              formGroup.get('password')?.value
          );
        })
      )
    );
    loginAttempt.then((success: boolean) => {
      setTimeout(() => {
        this.toggleLoadingState();
        if (!success) {
          this.messageService.add({
            severity: 'error',
            summary: 'Invalid Credentials!',
            detail: 'Please try again',
          });
        } else {
          this.router.navigate(['home']);
        }
      }, 2000);
    });
  }
}
