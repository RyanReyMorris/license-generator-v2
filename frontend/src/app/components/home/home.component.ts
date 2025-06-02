import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {
  TuiAlertService,
  TuiBrightness,
  TuiButtonModule,
  TuiLabelModule,
  TuiModeModule,
  TuiSvgModule
} from "@taiga-ui/core";
import {TuiAppBarModule} from "@taiga-ui/addon-mobile";
import {
  TUI_TOGGLE_DEFAULT_OPTIONS,
  TUI_TOGGLE_OPTIONS, TuiAvatarModule,
  TuiTabsModule,
  TuiToggleModule,
  TuiToggleOptions
} from "@taiga-ui/kit";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TuiThemeNightService} from "@taiga-ui/addon-doc";
import {AsyncPipe, NgIf, NgOptimizedImage} from "@angular/common";
import {TableComponent} from "../table/table.component";
import {UserService} from "../../shared/services/user.service";
import {BehaviorSubject, Observable} from "rxjs";
import {User} from "../../shared/models/user.model";

// Значки переключателя темной темы
const options: Partial<TuiToggleOptions> = {
  icons: {
    toggleOff: ({$implicit}) => ($implicit === 'm' ? 'tuiIconMoon' : 'tuiIconMoon'),
    toggleOn: ({$implicit}) => ($implicit === 'm' ? 'tuiIconSun' : 'tuiIconSun'),
  },
};

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    TuiAppBarModule,
    TuiButtonModule,
    TuiLabelModule,
    TuiSvgModule,
    TuiTabsModule,
    TuiModeModule,
    FormsModule,
    TuiToggleModule,
    ReactiveFormsModule,
    TuiAvatarModule,
    NgOptimizedImage,
    TableComponent,
    AsyncPipe,
    NgIf,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{provide: TUI_TOGGLE_OPTIONS, useValue: {...TUI_TOGGLE_DEFAULT_OPTIONS, ...options}}],
})
export class HomeComponent {

  activeItemIndex = 0;
  user$: Observable<User | null>;

  constructor(@Inject(TuiAlertService) private readonly alerts: TuiAlertService, @Inject(TuiThemeNightService) readonly night: TuiThemeNightService, private userService:UserService) {
    this.user$ = this.userService.getCurrentUser();
  }

  public toggle() {
    this.night.toggle();
  }

  onClick(item: string): void {
    // this.alerts.open(item).subscribe();
  }

  toggleForm = new FormGroup({
    nightThemeToggle: new FormControl(!this.night.value)
  });

  logout() {
    this.userService.logOutUser();
  }
}
