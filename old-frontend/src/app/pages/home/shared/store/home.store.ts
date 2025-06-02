import { BehaviorSubject, Observable } from 'rxjs';

import { Injectable } from '@angular/core';
import { LicenseGenerationParams } from '@api/license/license-generation-params';
import { LicenseType } from '@api/license/enums/license-type';
import { Page } from '@api/license/page';

/**
 * Store главной страницы
 * Хранит стянутые лицензии, выбранную лицензию, версии лицензий и статус обновления
 */
@Injectable({
    providedIn: 'any',
})
export class HomeStore {
    private updating$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    private licenses$: BehaviorSubject<Page<LicenseGenerationParams>> =
        new BehaviorSubject(new Page());
    private selectedLicense$: BehaviorSubject<LicenseType> =
        new BehaviorSubject<LicenseType>(null);
    private licenseVersions$: BehaviorSubject<Map<LicenseType, String>> =
        new BehaviorSubject<Map<LicenseType, String>>(null);

    get selectedLicenseValue$() {
        return this.selectedLicense$.value;
    }

    isUpdating$(): Observable<boolean> {
        return this.updating$.asObservable();
    }

    setUpdating(isUpdating: boolean): void {
        this.updating$.next(isUpdating);
    }

    getLicenses$(): Observable<Page<LicenseGenerationParams>> {
        return this.licenses$.asObservable();
    }

    setLicenses(keys: Page<LicenseGenerationParams>): void {
        this.licenses$.next(keys);
    }

    getLicenseVersions(): Map<LicenseType, String> {
        return this.licenseVersions$.value;
    }

    setLicensesVersions(versions: Map<LicenseType, String>): void {
        this.licenseVersions$.next(versions);
    }

    getSelectedLicense$() {
        return this.selectedLicense$.asObservable();
    }

    setSelectedLicense(license: LicenseType): void {
        this.selectedLicense$.next(license);
    }

    clear() {
        this.licenses$.next(new Page());
        this.selectedLicense$.next(null);
        this.licenseVersions$.next(null);
    }
}
