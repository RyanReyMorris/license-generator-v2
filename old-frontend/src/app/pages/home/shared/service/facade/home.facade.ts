import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { exhaustMap, take } from 'rxjs/operators';

import { AuthService } from '@shared/service/auth/auth.service';
import { AuthStore } from '@shared/store/auth.store';
import { FormDataType } from '@api/license/form-data-type';
import { HomeStore } from '../../store/home.store';
import { Injectable } from '@angular/core';
import { LicenseGenerationParams } from '@api/license/license-generation-params';
import { LicenseService } from '../license/license.service';
import { LicenseType } from '@api/license/enums/license-type';
import LicenseUtils from '../../utils/licenseUtils';
import { LoggerService } from '@shared/service/logger/logger.service';
import { ModalService } from '@shared/service/modal/modal.service';
import { Observable } from 'rxjs';
import { Page } from '@api/license/page';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';

@Injectable({
    providedIn: 'any',
})
export class HomeFacade {
    constructor(
        private authService: AuthService,
        private licenseService: LicenseService,
        private homeStore: HomeStore,
        private authStore: AuthStore,
        private logger: LoggerService,
        private router: Router,
        private modalService: ModalService
    ) {
        licenseService
            .getLicenseVersions()
            .pipe(take(1))
            .subscribe((v) => homeStore.setLicensesVersions(v));
    }

    isUpdating$(): Observable<boolean> {
        return this.homeStore.isUpdating$();
    }

    getLicenses(): Observable<Page<LicenseGenerationParams>> {
        return this.homeStore.getLicenses$();
    }

    getSelectedLicense(): Observable<LicenseType> {
        return this.homeStore.getSelectedLicense$();
    }

    get selectedLicenseValue(): LicenseType {
        return this.homeStore.selectedLicenseValue$;
    }

    setSelectedLicense(license: LicenseType): void {
        this.homeStore.setSelectedLicense(license);
    }

    /**
     * Производит создание нового ключа основывая на данных из формы
     *
     * @param $event - данные с формы
     */
    generate($event: FormDataType): Observable<LicenseGenerationParams> {
        this.homeStore.setUpdating(true);

        const formData = new FormData();
        formData.append(
            'licenseMeta',
            new Blob([JSON.stringify($event.licenseMeta)], {
                type: 'application/json',
            })
        );
        for (const [license, value] of Object.entries($event.files)) {
            if (value !== null) {
                formData.append('files', value, license);
            }
        }

        const observable = this.licenseService.createNewLicense(
            formData,
            $event.licenseType
        );
        observable.subscribe(
            (message) => {
                this.logger.log(message);

                this.homeStore.setUpdating(false);
                this.refreshData();
            },
            (err: HttpErrorResponse) => {
                this.homeStore.setUpdating(false);
                this.modalService.openErrorModal(err.error.message);
            },
            () => {
                this.homeStore.setUpdating(false);
            }
        );

        return observable;
    }

    openNewLicenseModal(
        licenseGenerationParams?: LicenseGenerationParams,
        licenseTypeByDefault?: LicenseType
    ): void {
        const dialogRef = this.modalService.openNewLicenseModal(
            async (data: FormDataType) => {
                if (
                    data.licenseMeta?.dateOfExpiry &&
                    data.licenseMeta.dateOfExpiry.getTime() <
                        new Date().getTime()
                ) {
                    let result = await this.modalService
                        .openConfirmationModal(
                            'Вы уверены, что хотите создать просроченную лицензию'
                        )
                        .afterClosed()
                        .toPromise();
                    if (!result) {
                        return;
                    }
                }

                const unsub = this.generate(data).subscribe((value) => {
                    dialogRef.componentInstance.licenseGenerationParams.next(
                        value
                    );
                    unsub.unsubscribe();
                });
            },
            this.homeStore.getLicenseVersions(),
            licenseTypeByDefault ?? LicenseType.SYSTEM,
            licenseGenerationParams ?? null
        );
    }

    openCheckLicense() {
        const dialogRef = this.modalService.checkLicense(
            (licenseFile, publicKeyFile, licenseType) => {
                const formData = new FormData();
                formData.append('files', licenseFile, 'licenseFile');
                formData.append('files', publicKeyFile, 'publicKeyFile');

                const unsub = this.licenseService
                    .decryptAndCheck(formData, licenseType)
                    .subscribe(
                        (data) => {
                            dialogRef.componentInstance.data.next(data);
                        },
                        (error: HttpErrorResponse) => {
                            this.modalService.openErrorModal(
                                error.error.message
                            );
                        },
                        () => unsub.unsubscribe()
                    );
            }
        );
    }

    openUpdateLicense(
        license: LicenseGenerationParams,
        licenseType: LicenseType
    ) {
        const dialogRef = this.modalService.updateLicense(
            async (data) => {
                if (
                    data.licenseMeta?.dateOfExpiry &&
                    data.licenseMeta.dateOfExpiry.getTime() <
                        new Date().getTime()
                ) {
                    let result = await this.modalService
                        .openConfirmationModal(
                            'Вы уверены, что хотите создать просроченную лицензию'
                        )
                        .afterClosed()
                        .toPromise();
                    if (!result) {
                        return;
                    }
                }

                const unsub = this.update(data, licenseType).subscribe(
                    (lic) => {
                        this.openNewLicenseModal(lic, licenseType);
                        this.refreshData();
                        unsub.unsubscribe();
                    }
                );
            },
            license,
            licenseType
        );
    }

    deleteLicenseById(licenseId: string, licenseType: LicenseType): void {
        const dialogRef = this.modalService.openConfirmationModal(
            'Вы уверены, что хотите удалить лицензию?'
        );

        const dialogSub = dialogRef.afterClosed().subscribe(
            (result: boolean) => {
                if (!result) {
                    return;
                }

                const unsub = this.licenseService
                    .deleteById(licenseId, licenseType)
                    .subscribe(
                        () => this.refreshData(),
                        () => {},
                        () => unsub.unsubscribe()
                    );
            },
            () => {},
            () => dialogSub.unsubscribe()
        );
    }

    /**
     * Обновляет данные о ключах
     */
    refreshData(): void {
        this.homeStore.setUpdating(true);

        const unsub = this.licenseService
            .getLicenses(this.homeStore.selectedLicenseValue$)
            .subscribe(
                (res) => this.homeStore.setLicenses(res),
                () => this.homeStore.setUpdating(false),
                () => {
                    unsub.unsubscribe();
                    this.homeStore.setUpdating(false);
                }
            );
    }

    /**
     * Скачивает ключ
     *
     * @param licenseFileId - id ключа
     * @param licenseType - тип лицензии
     */
    downloadLicense(licenseFileId: number, licenseType: LicenseType): void {
        const unsub = this.licenseService
            .downloadLicense(licenseFileId, licenseType)
            .subscribe((res: HttpResponse<Blob>) => {
                const fileName = LicenseUtils.getFileNameFromResponse(res);
                this.logger.log(fileName);
                saveAs(res.body, fileName);
                unsub.unsubscribe();
            });
    }

    /**
     *
     */
    update(
        form: {
            licenseMeta: { id: string; dateOfExpiry: Date };
            files: { privateKey: File };
        },
        licenseType: LicenseType
    ): Observable<LicenseGenerationParams> {
        const formData = new FormData();
        formData.append(
            'licenseMeta',
            new Blob([JSON.stringify(form.licenseMeta)], {
                type: 'application/json',
            })
        );
        for (const [license, value] of Object.entries(form.files)) {
            if (value !== null) {
                formData.append('files', value, license);
            }
        }

        return this.licenseService.update(formData, licenseType);
    }

    /**
     * Выход с сайта
     * При ошибка показывает модалку с ошибкой
     */
    logout(): void {
        const unsub = this.authService.logout().subscribe(
            () => {
                this.authStore.setCurrentUser(null);
                this.router.navigate(['/auth/login']);
            },
            (err) => {
                this.modalService.openErrorModal(err);
            },
            () => {
                this.homeStore.clear();
                unsub.unsubscribe()
            }
        );
    }
}
