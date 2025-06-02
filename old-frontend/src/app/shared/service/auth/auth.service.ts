import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {User} from '@api/auth/user';
import {LoggerService} from '../logger/logger.service';
import {MessageResponse} from '@api/response/messageResponse';
import {BaseAuth} from '@api/auth/base-auth';
import {GlobalConst} from '@shared/utils/global-const';

/**
 * Сервис для работы с безопасностью
 *
 * @author DSalikhov
 * @export
 */
@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor(private http: HttpClient, private logger: LoggerService) {
    }

    /**
     * Логин с обновление статуса
     *
     * @param data LoginRequest - сущность с данными для логина
     */
    login(data: BaseAuth) {
        return this.http.post<MessageResponse>(`${GlobalConst.authApi}/login`, data).pipe(
            tap((message) => this.logger.log(`AuthService.login: ${message.message}`)),
        );
    }

    /**
     * Регистрация
     *
     * @param data Register - сущность с данными для регистрации
     */
    registration(data: BaseAuth): Observable<MessageResponse> {
        return this.http.post<MessageResponse>(`${GlobalConst.authApi}/registration`, data).pipe(
            tap((message) => this.logger.log(`AuthService.registration: ${message.message}`)),
        );
    }

    /**
     * Выход с обновление статуса
     *
     * @author DSalikhov
     */
    logout(): Observable<void> {
        return this.http.get<void>(`${GlobalConst.authApi}/logout`).pipe(
            tap(() => this.logger.log('AuthService.registration: Выход прошел успешно')),
        );
    }

    /**
     * Запрашивает текущий статус пользователя
     */
    updateUserStatus(): Observable<User> {
        return this.http.get<User>(`${GlobalConst.authApi}/currentUser`).pipe(
            tap((user) => this.logger.log(`AuthService.userStatus:`, user)),
        );
    }
}
