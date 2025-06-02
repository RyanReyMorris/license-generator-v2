import {HttpClient} from '@angular/common/http';
import {inject, Inject, Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, NavigationExtras, Router, RouterStateSnapshot} from '@angular/router';
import {TuiAlertService} from "@taiga-ui/core";
import {BehaviorSubject, catchError, map, Observable, tap, throwError} from "rxjs";
import {AppConstant} from "../utils/app.constants";
import {User} from "../models/user.model";
import {MessageResponse} from "../models/message-response.model";

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private currentUser$: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);

    constructor(private router: Router, private http: HttpClient, @Inject(TuiAlertService) private readonly alerts: TuiAlertService) {
    }

    getCurrentUser() {
        return this.currentUser$.asObservable();
    }

    setCurrentUser(user: User | null) {
        this.currentUser$.next(user);
    }

    public logOutUser(): void {
        this.logout().subscribe({
            next: data => {
                this.setCurrentUser(null);
                this.router.navigate(['/login']).then()
            },
            error: err => {
                this.alerts.open(err.error.description, {
                    autoClose: 4000,
                    status: "error",
                    label: err.error.message
                }).subscribe();
            }
        });
    }

    public logInUser(username: string, password: string, returnUrl: string): void {
        this.login(username, password).subscribe({
            next: user => {
                this.updateUserInfo().subscribe({
                  next: user => {
                    this.router.navigate([returnUrl]).then()
                  },
                });
            },
            error: err => {
                this.alerts.open(err.error.description, {
                    autoClose: 4000,
                    status: "error",
                    label: err.error.message
                }).subscribe();
            }
        });
    }

    registerUser(login: string, password: string, s: string) {
        this.register(login, password).subscribe({
            next: data => {
                this.setCurrentUser(null);
                this.router.navigate(['/login']).then()
            },
            error: err => {
                this.alerts.open(err.error.description, {
                    autoClose: 4000,
                    status: "error",
                    label: err.error.message
                }).subscribe();
            }
        });
    }

    public login(username: string, password: string): Observable<MessageResponse> {
        return this.http
            .post<MessageResponse>(AppConstant.AUTH_API + "/login", {username, password})
            .pipe(catchError(this.handleError));
    }

    public logout() {
        return this.http
            .post<any>(AppConstant.AUTH_API + "/logout", {})
            .pipe(catchError(this.handleError));
    }

    /**
     * Запрашивает текущий статус пользователя
     */
    public updateUserInfo(): Observable<User> {
        return this.http.get<User>(`${AppConstant.AUTH_API}/currentUser`).pipe(
            tap((user) => {
                this.setCurrentUser(user);
            })
        );
    }

    /**
     * Регистрация
     */
    register(username: string, password: string): Observable<MessageResponse> {
        return this.http
            .post<MessageResponse>(AppConstant.AUTH_API + "/registration", {username, password})
            .pipe(catchError(this.handleError));
    }

    private handleError(error: any) {
        return throwError(() => {
            return error;
        });
    }

    public canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.getCurrentUser().pipe(
            map(user => {
                if (user) {
                    return true;
                } else {
                    const navigationExtras: NavigationExtras = {state: {returnUrl: state.url}};
                    this.router.navigate(['/login'], navigationExtras);
                    return false;
                }
            }),
        );
    }
}

//Guard для проверки того, что пользователь авторизовался
export const authGuard = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    return inject(UserService).canActivate(route, state);
};
