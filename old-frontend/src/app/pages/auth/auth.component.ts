import {Component} from '@angular/core';
import {Observable} from 'rxjs';
import {AuthFacade} from './shared/services/auth.facade';
import {RouterOutlet} from "@angular/router";
import {animate, group, query, style, transition, trigger} from "@angular/animations";

/**
 * Корневой компонент для безопасности
 *
 * @author DSalikhov
 * @export
 */
@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.less'],
    animations: [
        trigger('animRight', [
            transition('Login => Register', [
                query(':enter, :leave',
                    style({position: 'fixed', width: '100%'}), {
                        optional: true
                    }),
                group([
                    query(':enter', [
                        style({transform: 'translateX(100%)'}),
                        animate('.3s ease-out',
                            style({transform: 'translateX(0%)'})
                        )
                    ], {
                        optional: true,
                    }),
                    query(':leave', [
                        style({transform: 'translateX(0%)'}),
                        animate('.3s ease-out',
                            style({transform: 'translateX(-100%)'})
                        )
                    ], {
                        optional: true,
                    }),
                ]),
            ]),
            transition('Register => Login', [
                query(':enter, :leave', style({position: 'fixed', width: '100%'}), {optional: true}),
                group([
                    query(':enter', [style({transform: 'translateX(-100%)'}), animate('.3s ease-out', style({transform: 'translateX(0%)'}))], {
                        optional: true,
                    }),
                    query(':leave', [style({transform: 'translateX(0%)'}), animate('.3s ease-out', style({transform: 'translateX(100%)'}))], {
                        optional: true,
                    }),
                ]),
            ])
        ])
    ],

})
export class AuthComponent {


    /**
     * boolean для спинера загрузки
     */
    isUpdating$: Observable<boolean>;

    constructor(private authFacade: AuthFacade) {
        this.isUpdating$ = authFacade.isUpdating$();
    }

    prepareRoute(outlet: RouterOutlet) {
        return outlet && outlet.activatedRouteData &&
            outlet.activatedRouteData.animationState;
    }
}
