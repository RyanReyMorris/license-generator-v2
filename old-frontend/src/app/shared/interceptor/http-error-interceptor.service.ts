import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {AuthService} from '../service/auth/auth.service';
import {LoggerService} from '../service/logger/logger.service';
import {Router} from '@angular/router';
import {StatusCodes} from 'http-status-codes/build/es';

/**
 * HttpErrorInterceptor служит для обработки ошибок, логгирования в дебаге
 * и редирека при определенных статусах
 *
 * @author DSalikhov
 * @export
 */
@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService, private logger: LoggerService, private router: Router) {
    }

    /**
     *  Логгируте ошибку в дебаге,
     *  Редиректит на страницу логина при StatusCodes.UNAUTHORIZED,
     *  Редиректит на страницу 403 при StatusCodes.FORBIDDEN,
     */
    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.error instanceof ErrorEvent) {
                    this.logger.error(error);
                } else {
                    this.logger.log(`Error status: ${error.status} ${error.statusText}`);

                    switch (error.status) {
                        case StatusCodes.UNAUTHORIZED: {
                            this.router.navigate(['/auth/login']);
                            break;
                        }
                    }
                }
                return throwError(error);
            })
        );
    }
}
