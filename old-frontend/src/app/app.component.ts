import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {environment} from '@env/environment';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import {HomeFacade} from "@pages/home/shared/service/facade/home.facade";

/**
 * Корень приложения
 *
 * @author DSalikhov
 * @export
 */
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less'],
})
export class AppComponent implements OnInit{
    constructor(private translateService: TranslateService, private idle: Idle, private homeFacade: HomeFacade) {
        idle.setIdle(10*60); //если 10 минут ничего не делали, начинаем отсчет
        idle.setTimeout(60); // ждем еще минуту до выхода
        idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
        idle.onTimeout.subscribe(() => {
            this.homeFacade.logout();
        });
    }

    ngOnInit(): void {
        this.translateService.use(environment.defaultLocale);
        this.idle.watch();
    }
}
