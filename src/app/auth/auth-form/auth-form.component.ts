import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { map, Observable, tap } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-auth-form',
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthFormComponent {
  mode$: Observable<'login' | 'register'> = this.route.data.pipe(
    map(response => response['mode']),
    tap(mode => this.buildForm(mode))
  );
  password: string | undefined;
  authForm: FormGroup = new FormGroup({});

  get loading() {
    return this.authService.loadingState;
  }

  get formControls() {
    return this.authForm.controls;
  }

  get loginError() {
    return this.authService.loginError;
  }

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    public authService: AuthService
  ) {}

  private buildForm(mode: 'login' | 'register'): void {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      formType: [mode],
    });
    if (mode === 'login') {
      this.authForm.removeControl('firstName');
      this.authForm.removeControl('lastName');
    }
  }

  public submit(): void {
    this.authService.submit(this.authForm);
  }
}
