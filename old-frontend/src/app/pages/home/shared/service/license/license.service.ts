import { HttpClient, HttpResponse } from '@angular/common/http';
import { share, tap } from 'rxjs/operators';

import { GlobalConst } from '@shared/utils/global-const';
import { Injectable } from '@angular/core';
import { LicenseGenerationParams } from '@api/license/license-generation-params';
import { LicenseType } from '@api/license/enums/license-type';
import { LoggerService } from '@shared/service/logger/logger.service';
import { Observable } from 'rxjs';
import { Page } from '@api/license/page';
import { PageSettings } from '@api/license/pageSettings';

/**
 * Сервис для работы с лицензиями
 *
 * @author DSalikhov
 * @export
 */
@Injectable({
    providedIn: 'any',
})
export class LicenseService {
    constructor(private http: HttpClient, private logger: LoggerService) {}

    getLicenseVersions(): Observable<Map<LicenseType, String>> {
        return this.http.get<Map<LicenseType, String>>(
            `${GlobalConst.licenseApi}/version`
        );
    }

    /**
     * Возращает все ключи
     */
    getLicenses(
        licenseType: LicenseType
    ): Observable<Page<LicenseGenerationParams>> {
        if (licenseType === null) {
            return this.http
                .get<Page<LicenseGenerationParams>>(
                    `${GlobalConst.licenseApi}`,
                    {
                        params: {
                            page: PageSettings.page.toString(),
                            size: PageSettings.size.toString(),
                        },
                    }
                )
                .pipe(tap((_) => this.logger.log('Стягиваем ключи')));
        } else {
            return this.http
                .get<Page<LicenseGenerationParams>>(
                    `${GlobalConst.licenseApi}`,
                    {
                        params: {
                            licenseType,
                            page: PageSettings.page.toString(),
                            size: PageSettings.size.toString(),
                        },
                    }
                )
                .pipe(tap((_) => this.logger.log('Стягиваем ключи')));
        }
    }

    /**
     * Создает ключ основывая на введенных метаданных
     *
     * @param formData
     * @param licenseType
     */
    createNewLicense(
        formData: FormData,
        licenseType: LicenseType
    ): Observable<LicenseGenerationParams> {
        return this.http
            .post<LicenseGenerationParams>(
                `${GlobalConst.licenseApi}/create`,
                formData,
                {
                    params: {
                        licenseType,
                    },
                }
            )
            .pipe(
                share(),
                tap((_) => this.logger.log('Создаем новый ключ'))
            );
    }

    /**
     * Скачивает файл ключа
     *
     * @param licenseFileId - id файла
     * @param licenseType - тип лицензии
     */
    downloadLicense(
        licenseFileId: number,
        licenseType: LicenseType
    ): Observable<HttpResponse<Blob>> {
        return this.http.get(
            `${GlobalConst.licenseApi}/download/${licenseFileId}`,
            {
                params: {
                    licenseType,
                },
                headers: {
                    Accept: ['*/*'],
                },
                responseType: 'blob',
                observe: 'response',
            }
        );
    }

    /**
     *
     */
    decryptAndCheck(formData: FormData, licenseType: LicenseType) {
        return this.http
            .post<Map<string, Map<string, string>>>(
                `${GlobalConst.licenseApi}/decryptAndCheck`,
                formData,
                {
                    params: {
                        licenseType,
                    },
                }
            )
            .pipe(
                share(),
                tap((LicenseString) => this.logger.log(LicenseString))
            );
    }

    update(formData: FormData, licenseType: LicenseType) {
        return this.http
            .post<LicenseGenerationParams>(
                `${GlobalConst.licenseApi}/update`,
                formData,
                {
                    params: {
                        licenseType,
                    },
                }
            )
            .pipe(
                share(),
                tap((LicenseString) => this.logger.log(LicenseString))
            );
    }

    deleteById(id: string, licenseType: LicenseType): Observable<void> {
        return this.http
            .get<void>(`${GlobalConst.licenseApi}/delete/${id}`, {
                params: {
                    licenseType,
                },
            })
            .pipe(tap((_) => this.logger.log('Стягиваем ключи')));
    }

    getSortedIssuers(): Observable<String[]> {
        return this.http.get<String[]>(
            `${GlobalConst.licenseApi}/issuers`
        );
    }
}
