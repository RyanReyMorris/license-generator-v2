import {
  TuiAlertModule,
  TuiBrightness,
  TuiDialogModule,
  TuiModeModule,
  TuiRootModule,
  TuiThemeNightModule
} from "@taiga-ui/core";
import {APP_INITIALIZER, Component, importProvidersFrom, Inject} from '@angular/core';
import {APP_BASE_HREF, CommonModule} from '@angular/common';
import {provideRouter, RouterOutlet} from '@angular/router';
import {TuiThemeNightService} from "@taiga-ui/addon-doc";
import {TuiLetModule} from "@taiga-ui/cdk";
import {ThemeSwitcherComponent} from "./components/theme-switcher/theme-switcher.component";
import {provideAnimations} from "@angular/platform-browser/animations";
import {routes} from "./app.routes";
import {provideHttpClient} from "@angular/common/http";
import {UserService} from "./shared/services/user.service";
import {TUI_LANGUAGE, TUI_RUSSIAN_LANGUAGE} from "@taiga-ui/i18n";
import {of} from "rxjs";
import {initializeApp} from "./app.config";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet,
    TuiRootModule,
    TuiDialogModule,
    TuiAlertModule,
    TuiThemeNightModule,
    TuiModeModule, TuiLetModule, ThemeSwitcherComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less',
  providers: [
    {provide: APP_BASE_HREF, useValue : '/taiga/' },
  ]
})
export class AppComponent {

  constructor(@Inject(TuiThemeNightService) readonly night: TuiThemeNightService) {
  }

  get mode(): TuiBrightness | null {
    return this.night.value ? 'onDark' : null;
  }
}
