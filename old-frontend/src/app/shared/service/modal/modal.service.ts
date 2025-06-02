import { ConfirmationModalComponent } from '@components/modals/confirmation-modal/confirmation-modal.component';
import { ErrorModalComponent } from '@components/modals/error-modal/error-modal.component';
import { GenerateComponent } from '@pages/home/licenses/components/modals/generate/generate.component';
import { Injectable } from '@angular/core';
import { LicenseGenerationParams } from '@api/license/license-generation-params';
import { LicenseType } from '@api/license/enums/license-type';
import { MatDialog } from '@angular/material/dialog';
import { UpdateLicenseComponent } from '@pages/home/licenses/components/modals/update-license/update-license.component';
import { UploadLicenseComponent } from '@pages/home/licenses/components/modals/upload-license/upload-license.component';

@Injectable({
    providedIn: 'root',
})
export class ModalService {
    defaultModalOptions = {
        maxHeight: '850px',
        maxWidth: '600px',
        panelClass: 'custom-mat-dialog-container',
    };

    constructor(public dialog: MatDialog) {}

    openErrorModal(message: string) {
        const dialogRef = this.dialog.open(ErrorModalComponent, {
            ...this.defaultModalOptions,
            data: {
                message,
            },
        });
    }

    openConfirmationModal(message: string, title?: string) {
        const dialogRef = this.dialog.open(ConfirmationModalComponent, {
            ...this.defaultModalOptions,
            closeOnNavigation: false,
            disableClose: true,
            data: {
                message,
                title,
            },
        });
        return dialogRef;
    }

    openNewLicenseModal(
        generate,
        licenseVersions: Map<LicenseType, String>,
        licenseTypeByDefault?: LicenseType,
        licenseGenerationParams?: LicenseGenerationParams
    ) {
        const dialogRef = this.dialog.open(GenerateComponent, {
            ...this.defaultModalOptions,
            data: {
                licenseGenerationParams,
                licenseTypeByDefault,
                licenseVersions,
            },
        });
        dialogRef.componentInstance.onGenerate.subscribe(($event) =>
            generate($event)
        );
        return dialogRef;
    }

    checkLicense(
        upload: (
            licenseFile: File,
            publicKeyFile,
            licenseType: LicenseType
        ) => void
    ) {
        const dialogRef = this.dialog.open(UploadLicenseComponent, {
            ...this.defaultModalOptions,
            data: null,
        });
        dialogRef.componentInstance.upload.subscribe((data) =>
            upload(data.licenseFile, data.publicKeyFile, data.licenseType)
        );
        return dialogRef;
    }

    updateLicense(
        updateLicense,
        license: LicenseGenerationParams,
        licenseType: LicenseType
    ) {
        const dialogRef = this.dialog.open(UpdateLicenseComponent, {
            ...this.defaultModalOptions,
            data: {
                license,
                licenseType,
            },
        });
        dialogRef.componentInstance.updateLicense.subscribe((date) =>
            updateLicense(date)
        );
        return dialogRef;
    }
}
