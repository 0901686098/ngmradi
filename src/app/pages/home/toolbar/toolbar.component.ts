import { Component, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { APP_NAME, IS_MEDIUM } from '../../../app.constants';
import { WindowObserverService } from '../../../core/services/utilities/windows-obsever.service';
import {
  ThemeMode,
  ThemeService,
} from '../../../core/services/utilities/theme.service';
import { StateServiceService } from '../../../core/services/utilities/state-service.service';
import { AuthService } from '../../../core/services/firebase/auth.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-toolbar',
  imports: [
    MatToolbarModule,
    MatTooltipModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatDividerModule,
    AsyncPipe,
  ],
  template: `
    <mat-toolbar>
      <div class="right-container">
        @if (viewPoint() <= isMedium) {
        <button mat-icon-button matTooltip="Menu" (click)="toggleDrawer()">
          <mat-icon>menu</mat-icon>
        </button>
        }

        <h2>
          <b>{{ appName }}</b>
        </h2>
      </div>

      <div class="avatar-container">
        <button mat-icon-button matTooltip="Notifications">
          <mat-icon>notifications</mat-icon>
        </button>

        <img
          matTooltip="Profile"
          [matMenuTriggerFor]="menu"
          width="32"
          height="32"
          [src]="(user$ | async)?.photoURL ?? 'assets/avatar.png'"
          alt="Profil"
        />
      </div>

      <mat-menu #menu="matMenu">
        <button mat-menu-item [matMenuTriggerFor]="themeMenu">
          <mat-icon>dark_mode</mat-icon>
          <span>Theme</span>
        </button>

        <button mat-menu-item (click)="logOut()">
          <mat-icon>logout</mat-icon>
          <span>Déconnexion</span>
        </button>
      </mat-menu>

      <mat-menu #themeMenu="matMenu">
        <button mat-menu-item (click)="switchTheme('device-theme')">
          Appareil
        </button>
        <button mat-menu-item (click)="switchTheme('light-theme')">
          Claire
        </button>
        <button mat-menu-item (click)="switchTheme('dark-theme')">
          Sombre
        </button>
      </mat-menu>
    </mat-toolbar>
    <mat-divider />
  `,
  styles: `
  mat-toolbar {
    display: flex; 
    justify-content: space-between;
    align-items: center;

    .right-container, .avatar-container {
      display: flex;
      align-items: center;
      gap:0.5rem
    }

    img {
      border-radius: 50%;
      background: lightgray;
      cursor: pointer;
      transition: 250ms;

      &:hover {
        transform: scale(0.98);
      }
    }
  }`,
})
export class ToolbarComponent {
  appName = APP_NAME;
  isMedium = IS_MEDIUM;
  private ts = inject(ThemeService);
  state = inject(StateServiceService);
  auth = inject(AuthService);
  user$ = this.auth.user;
  viewPoint = inject(WindowObserverService).width;
  toggleDrawer = () => this.state.isToggleDrawer.update((value) => !value);
  switchTheme = (theme: ThemeMode) => this.ts.setTheme(theme);
  router = inject(Router);
  async logOut() {
    await this.auth.logout();
    this.router.navigate(['/login']);
  }
}
