import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {LicenseGenerationParams} from '@api/license/license-generation-params';
import {LicenseType} from '@api/license/enums/license-type';

interface DialogData {
    license: LicenseGenerationParams;
    licenseType: LicenseType;
}

type FormData = {
    licenseMeta: {
        id: string,
        dateOfExpiry: Date
    },
    files: {
        privateKey: any
    }
}

@Component({
    selector: 'app-update-license',
    templateUrl: './update-license.component.html',
    styleUrls: ['./update-license.component.less']
})
export class UpdateLicenseComponent implements OnInit {

    @Output() updateLicense: EventEmitter<FormData> = new EventEmitter<FormData>();
    /**
     * Форма
     */
    form: FormGroup;
    /**
     * Минимальная дата для продления лицензии
     */
    minDate: Date;

    constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData,
                private formBuilder: FormBuilder,
                public dialogRef: MatDialogRef<UpdateLicenseComponent>) {
        this.minDate = new Date(data?.license?.dateOfExpiry ?? data.license.dateOfIssue);
    }

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            licenseMeta: this.formBuilder.group({
                dateOfExpiry: [null, Validators.required],
            }),
            files: this.formBuilder.group({
                privateKey: [null, Validators.required],
            })
        });

        this.minDate.setDate(this.minDate.getDate() + 1);
    }

    onSubmit(form: FormData) {
        let temp = form;
        temp.licenseMeta.id = this.data.license.id;
        temp.files.privateKey = temp.files?.privateKey?._files[0];

        this.dialogRef.close();
        this.updateLicense.emit(temp);
    }
}
