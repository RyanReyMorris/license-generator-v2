import {ErrorHandler, Injectable} from '@angular/core';
import {environment} from '@env/environment';

/**
 * Сервис логгирования
 *
 * @author DSalikhov
 * @export
 */
@Injectable({
    providedIn: 'root'
})
export class LoggerService {

    constructor(private errorHandler: ErrorHandler) {
    }

    /**
     * Обычных лог, работает только при дебаге
     */
    log(value: any, ...rest: any[]): void {
        if (!environment.production) {
            console.log(value, ...rest);
        }
    }

    error(error: Error): void {
        this.errorHandler.handleError(error);
    }

    warn(value: any, ...rest: any[]): void {
        console.warn(value, ...rest);
    }
}
