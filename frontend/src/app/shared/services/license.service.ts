import {Inject, Injectable} from '@angular/core';
import {catchError, map, Observable, throwError} from "rxjs";
import {AppConstant} from "../utils/app.constants";
import {Router} from "@angular/router";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {TuiAlertService} from "@taiga-ui/core";
import {LicenseType} from "../models/license-type.model";
import {Page} from "./page.modal";
import {DecryptedLicense, License, LicenseMeta} from "../models/license-params";
import {LicenseSearch} from "../models/search-params.model";

@Injectable({providedIn: 'root'})
export class LicenseService {

  constructor(private router: Router, private http: HttpClient, @Inject(TuiAlertService) private readonly alerts: TuiAlertService) {
  }

  public getLicenseVersions(): Observable<Map<LicenseType, String>> {
    return this.http
      .get<Map<LicenseType, String>>(`${AppConstant.LICENSE_API}/version`)
      .pipe(catchError(this.handleError));
  }

  public getLicenses(searchParams: LicenseSearch): Observable<Page<LicenseMeta>> {
    return this.http
      .get<Page<LicenseMeta>>(`${AppConstant.LICENSE_API}/list`, {params: searchParams.getParams()})
      .pipe(catchError(this.handleError));
  }

  /**
   * Создает ключ основывая на введенных метаданных
   */
  public createLicense(licenseMeta: LicenseMeta, files: File[], licenseType: LicenseType): Observable<LicenseMeta> {
    const formData = new FormData();
    formData.append('licenseMeta', new Blob([JSON.stringify(licenseMeta)], {type: 'application/json'}));
    for (const file of files) {
      formData.append('files', file, file.name.split('.')[0] + 'Key');
    }
    return this.http
      .post<LicenseMeta>(`${AppConstant.LICENSE_API}/create`, formData, {params: {licenseType}})
      .pipe(catchError(this.handleError));
  }

  /**
   * Скачивает файл ключа
   *
   * @param licenseFileId - id файла
   * @param licenseType - тип лицензии
   */
  public downloadLicense(licenseFileId: number, licenseType: LicenseType): Observable<HttpResponse<Blob>> {
    return this.http
      .get(`${AppConstant.LICENSE_API}/download/${licenseFileId}`,
        {
          params: {licenseType},
          headers: {Accept: ['*/*']},
          responseType: 'blob',
          observe: 'response'
        })
      .pipe(catchError(this.handleError));
  }

  /**
   * Расшифровать и проверить лицензию
   */
  public decryptAndCheck(licenseFile: File, publicKeyFile: File, licenseType: LicenseType): Observable<DecryptedLicense> {
    const formData = new FormData();
    formData.append('files', licenseFile, 'licenseFile');
    formData.append('files', publicKeyFile, 'publicKeyFile');
    return this.http
      .post<DecryptedLicense>(`${AppConstant.LICENSE_API}/decryptAndCheck`, formData, {params: {licenseType}})
      .pipe(
          catchError(this.handleError),
          map((license) => {
            license.decryptedLicense = License.prepareLicenseFromDecryption(license.decryptedLicense)
            return license;
          })
      );
  }

  public update(licenseMeta: LicenseMeta, files: File[], licenseType: LicenseType): Observable<LicenseMeta> {
    const formData = new FormData();
    formData.append('licenseMeta', new Blob([JSON.stringify(licenseMeta)], {type: 'application/json'})
    );
    for (const file of files) {
      formData.append('files', file, file.name.split('.')[0] + 'Key');
    }
    return this.http
      .post<LicenseMeta>(`${AppConstant.LICENSE_API}/update`, formData, {params: {licenseType}})
      .pipe(catchError(this.handleError));
  }

  public deleteById(id: string, licenseType: LicenseType): Observable<void> {
    return this.http
      .get<void>(`${AppConstant.LICENSE_API}/delete/${id}`, {params: {licenseType}})
      .pipe(catchError(this.handleError));
  }

  public getSortedIssuers(): Observable<String[]> {
    return this.http.get<String[]>(`${AppConstant.LICENSE_API}/issuers`);
  }

  private handleError(error: any) {
    return throwError(() => {
      return error;
    });
  }
}
