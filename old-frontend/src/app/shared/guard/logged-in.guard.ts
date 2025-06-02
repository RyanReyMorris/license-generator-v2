import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot} from '@angular/router';
import {AuthStore} from '../store/auth.store';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

/**
 *  LoggedInGuard служит для запрета входа на защищенные станицы,
 *  если пользователь не залогинен
 *
 * @author DSalikhov
 * @export
 */
@Injectable({
    providedIn: 'root',
})
export class LoggedInGuard implements CanActivateChild, CanActivate {
    constructor(private authStore: AuthStore, private router: Router) {
    }

    /**
     *  Логика для защиты детей роута
     *
     *  Проверят наличие статус пользователя,
     *  если вход в систему произведен, то пропускает,
     *  иначе кидает на страницу логина
     */
    canActivateChild(
        childRoute: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> {
        return this.authStore.getCurrentUser().pipe(
            map(user => {
                if (user) {
                    return true;
                } else {
                    this.router.navigate(['/auth/login'], {queryParams: {returnUrl: state.url}});
                    return false;
                }
            }),
        );
    }

    /**
     *  Логика для защиты корневого роута
     *
     *  Проверят наличие статус пользователя,
     *  если вход в систему произведен, то пропускает,
     *  иначе кидает на страницу логина
     */
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> {
        return this.authStore.getCurrentUser().pipe(
            map(user => {
                if (user) {
                    return true;
                } else {
                    this.router.navigate(['/auth/login'], {queryParams: {returnUrl: state.url}});
                    return false;
                }
            }),
        );
    }
}
