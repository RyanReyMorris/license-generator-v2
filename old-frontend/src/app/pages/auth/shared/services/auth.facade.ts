import {Injectable} from '@angular/core';
import {AuthService} from '@shared/service/auth/auth.service';
import {Observable} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {AuthStore} from '@shared/store/auth.store';
import {BaseAuth} from '@api/auth/base-auth';
import {HttpErrorResponse} from '@angular/common/http';
import {ModalService} from '@shared/service/modal/modal.service';

@Injectable({
    providedIn: 'root'
})
export class AuthFacade {
    /**
     * По какой ссылки перейти после успешного логина
     */
    returnUrl: string;

    constructor(
        private authService: AuthService,
        private authStore: AuthStore,
        private router: Router,
        private route: ActivatedRoute,
        private modal: MatDialog,
        private modalService: ModalService,
    ) {
        this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';

        this.authStore.getCurrentUser().subscribe(user => {
            if (user !== null) {
                this.router.navigate([this.returnUrl]);
            }
        });
    }

    isUpdating$(): Observable<boolean> {
        return this.authStore.isUpdating$();
    }

    /**
     * Производит логин основывая на данных из формы
     *
     * @param username логин
     * @param password пароль
     */
    login(username: string, password: string): void {
        this.authStore.setUpdating(true);

        this.authService.login(new BaseAuth(username, password)).subscribe(
            (res) => {
                this.authService.updateUserStatus().subscribe((user) => {
                    this.authStore.setCurrentUser(user);
                    this.router.navigate([this.returnUrl]);
                });
            },
            (err) => {
                this.authStore.setUpdating(false);
                this.modalService.openErrorModal(err.error.message);
            },
            () => this.authStore.setUpdating(false)
        );
    }

    /**
     * Производит регистрацию основывая на данных из формы
     *
     * @param username логин
     * @param password пароль
     */
    registration(username: string, password: string): void {
        this.authStore.setUpdating(true);

        this.authService.registration(new BaseAuth(username, password)).subscribe(
            (res) => this.router.navigate(['/auth/login']),
            (err: HttpErrorResponse) => {
                this.authStore.setUpdating(false);
                this.modalService.openErrorModal(err.error.message);
            },
            () => this.authStore.setUpdating(false)
        );
    }
}
