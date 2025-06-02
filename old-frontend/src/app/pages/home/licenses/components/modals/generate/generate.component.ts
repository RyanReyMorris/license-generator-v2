import { Component, EventEmitter, Inject } from '@angular/core';
import { LicenseType } from '@api/license/enums/license-type';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormDataType } from '@api/license/form-data-type';
import { BehaviorSubject, Observable } from 'rxjs';
import { LicenseGenerationParams } from '@api/license/license-generation-params';
import { HomeStore } from '@pages/home/shared/store/home.store';

interface DialogData {
    licenseGenerationParams: LicenseGenerationParams;
    licenseTypeByDefault: LicenseType;
    licenseVersions: Map<LicenseType, String>;
}

type ValidStates = 'INVALID' | 'VALID';

@Component({
    selector: 'app-generate',
    templateUrl: './generate.component.html',
    styleUrls: ['./generate.component.less'],
})
export class GenerateComponent {
    licenses = LicenseType;
    selectedLicense: LicenseType;
    onGenerate: EventEmitter<FormDataType> = new EventEmitter<FormDataType>();
    licenseGenerationParams: BehaviorSubject<LicenseGenerationParams> =
        new BehaviorSubject<LicenseGenerationParams>(null);
    licenseVersions: Map<LicenseType, String>;
    formData: FormDataType;
    formStatus: ValidStates = 'INVALID';

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        public store: HomeStore
    ) {
        this.licenseGenerationParams.next(data?.licenseGenerationParams);
        this.selectedLicense = data?.licenseTypeByDefault ?? null;
        this.licenseVersions = data?.licenseVersions ?? null;
    }

    getVersion() {
        return this.licenseVersions?.[this.selectedLicense] ?? "Неизвестно";
    }

    generate(): void {
        this.onGenerate.emit(this.formData);
    }

    formStatusChanged(value): void {
        this.formStatus = value;
    }

    formValueChanged(value): void {
        this.formData = value;
    }

    clearForm(): void {
        this.licenseGenerationParams.next(null);
    }
}
