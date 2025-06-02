import {Component, EventEmitter, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {LicenseType} from '@api/license/enums/license-type';
import {BehaviorSubject} from 'rxjs';
import {LicenseGenerationParams} from '@api/license/license-generation-params';

type DialogData = { licenseFile: File, publicKeyFile: File, licenseType: LicenseType };

@Component({
    selector: 'app-upload-license',
    templateUrl: './upload-license.component.html',
    styleUrls: ['./upload-license.component.less']
})
export class UploadLicenseComponent implements OnInit {

    licenses = LicenseType;
    keyGenerationParams: BehaviorSubject<LicenseGenerationParams> = new BehaviorSubject<LicenseGenerationParams>(null);
    _selectedLicense: LicenseType = LicenseType.SYSTEM;
    get selectedLicense() {
        return this._selectedLicense;
    }

    set selectedLicense(value) {
        this.data.next(null);
        this._selectedLicense = value;
    }

    upload: EventEmitter<DialogData> = new EventEmitter<DialogData>();
    data: BehaviorSubject<Map<string, Map<string, string>>> = new BehaviorSubject<Map<string, Map<string, string>>>(null);
    licenseFile: File;
    publicKeyFile: File;

    decryptedLicense: Map<string, string>;
    licenseStatus: Map<string, string>;

    constructor(public dialogRef: MatDialogRef<UploadLicenseComponent>) {
    }

    ngOnInit(): void {
    }

    uploadlicenseFile(file: File) {
        this.licenseFile = file;
        this.isAllUploaded();
    }

    uploadpublicKeyFile(file: File) {
        this.publicKeyFile = file;
        this.isAllUploaded();
    }

    isAllUploaded() {
        if (this.licenseFile !== undefined && this.publicKeyFile !== undefined) {
            const data: DialogData = {
                licenseFile: this.licenseFile,
                publicKeyFile: this.publicKeyFile,
                licenseType: this.selectedLicense
            };
            this.licenseFile = null;
            this.publicKeyFile = null;
            this.upload.emit(data);
        }
    }
}
