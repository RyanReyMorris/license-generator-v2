import {provideAnimations} from "@angular/platform-browser/animations";
import {TuiRootModule} from "@taiga-ui/core";
import {APP_INITIALIZER, ApplicationConfig, importProvidersFrom} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideHttpClient} from "@angular/common/http";
import {UserService} from "./shared/services/user.service";
import {TUI_LANGUAGE, TUI_RUSSIAN_LANGUAGE} from '@taiga-ui/i18n';
import {APP_BASE_HREF} from "@angular/common";
import {of} from "rxjs";

export const appConfig: ApplicationConfig = {
    providers: [provideAnimations(), provideRouter(routes), importProvidersFrom(TuiRootModule), provideHttpClient(),
        {provide: APP_BASE_HREF, useValue : '/taiga/' },
        {
            provide: APP_INITIALIZER,
            useFactory: initializeApp,
            multi: true,
            deps: [UserService],
        },
        {
            provide: TUI_LANGUAGE,
            useValue: of(TUI_RUSSIAN_LANGUAGE),
        }
    ]
};

export function initializeApp(userService: UserService) {
    return () => userService.updateUserInfo();
}
