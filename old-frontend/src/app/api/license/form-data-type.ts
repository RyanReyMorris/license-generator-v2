import {LicenseGenerationParams} from '@api/license/license-generation-params';
import {LicenseType} from '@api/license/enums/license-type';

/**
 * DTO служащая для отправки запроса на создание новой лицензии
 * с прикрепленными файлами
 */
export class FormDataType {
    licenseMeta: LicenseGenerationParams;
    files: File[];
    licenseType: LicenseType;

    constructor(formData: any) {
        this.licenseMeta = new LicenseGenerationParams(formData.licenseMeta);
        this.files = formData.files;
        this.licenseType = formData.licenseType;
    }
}
