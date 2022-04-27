import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Observable, filter, map } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-user-dropdown',
  templateUrl: './user-dropdown.component.html',
  styleUrls: ['./user-dropdown.component.scss'],
})
export class UserDropdownComponent implements OnInit {
  items: MenuItem[] = [];

  get user$(): Observable<User | undefined> {
    return this.authService.user;
  }

  getUserAvatarInitials$ = this.user$.pipe(
    filter(user => Boolean(user)),
    map((user: User | undefined) => {
      return `${user?.firstName[0].toUpperCase()}${user?.lastName[0].toUpperCase()}`;
    })
  );

  items$: Observable<MenuItem[]> = this.user$.pipe(
    map((user: User | undefined) => {
      return [
        {
          label: user ? 'Logout' : 'Login',
          icon: 'pi pi-external-link',
          url: '/login',
          command: () => {
            user ? this.authService.logoutUser() : null;
          },
        },
      ];
    })
  );

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.items = [];
  }
}
