import {
    AbstractControl,
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
    ValidatorFn
} from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
    animate,
    state,
    style,
    transition,
    trigger,
} from '@angular/animations';

import { FormDataType } from '@api/license/form-data-type';
import { FormStateMatcher } from '@shared/state-matchers/form.state-matcher';
import { LicenseService } from "@pages/home/shared/service/license/license.service";
import { LicenseGenerationParams } from '@api/license/license-generation-params';
import { LicenseType } from '@api/license/enums/license-type';
import { Observable } from 'rxjs';
import {startWith, map} from "rxjs/operators";
import {MatChipInputEvent} from "@angular/material/chips";




@Component({
    selector: 'app-system-license',
    templateUrl: './system-license.component.html',
    styleUrls: ['./system-license.component.less'],
    animations: [
        trigger('openCloseInnKpp', [
            transition(':enter', [
                style({ height: '10px', opacity: 0 }),
                animate('100ms', style({ height: '*', opacity: 1 })),
            ]),
            transition(':leave', [
                style({ height: '*', opacity: 1 }),
                animate('100ms', style({ height: '10px', opacity: 0 })),
            ]),
        ]),
    ],
})
export class SystemLicenseComponent implements OnInit {
    @Output() valueChanged: EventEmitter<FormDataType> =
        new EventEmitter<FormDataType>();
    @Output() statusChanged: EventEmitter<FormDataType> =
        new EventEmitter<FormDataType>();

    @Input() value: Observable<LicenseGenerationParams>;
    @Input() version: String;

    form: FormGroup;
    innkppForm: FormGroup;
    issuers:String[];
    filteredOptions:Observable<String[]>;
    separatorKeysCodes: number[] = [ENTER];
    organizationsInput:String = '';

    /**
     * Валидатор
     */
    matcher = new FormStateMatcher();

    removable = true;
    addOnBlur = true;
    innkppActive = false;

    constructor(private formBuilder: FormBuilder, public licenseService: LicenseService,) {}

    ngOnInit(): void {
        let self = this;
        let validateOrganisationInput = function(control:AbstractControl) {
            if (self.organizationsInput.trim() !== '') {
                return {notClear:true};
            }
        }

        this.licenseService.getSortedIssuers().subscribe(v=>{
            this.issuers = v;
            let field = this.form.get('licenseMeta.properties.issuedBy');
            if (this.issuers.length > 0 && !field.value) {
                field.setValue(this.issuers[0]);
            }
            this.filteredOptions = field.valueChanges.pipe(
                startWith(''),
                map(value => this.issuers.filter( issuer => issuer.toLowerCase().includes(value.toLowerCase())))
            );
        })

        this.form = this.formBuilder.group({
            licenseMeta: this.formBuilder.group({
                id: [null],
                previousLicense: [null],
                dateOfIssue: [null],
                dateOfExpiry: [null],
                properties: this.formBuilder.group({
                    issuedTo: [null, Validators.required],
                    issuedBy: [null, Validators.required],
                    organizationsList: [[], [Validators.required, validateOrganisationInput]],
                    licenseFileName: ['licenseFileName'],
                    comment: [null],
                    testLicense: [false],
                }),
            }),
            files: this.formBuilder.group({
                privateKey: [null, Validators.required],
                publicKey: [null, Validators.required],
            }),
        });

        this.value.subscribe((licenseGenerationParams) => {
            if (licenseGenerationParams !== null) {
                licenseGenerationParams.dateOfIssue = new Date(
                    licenseGenerationParams.dateOfIssue
                );
                licenseGenerationParams.dateOfExpiry =
                    licenseGenerationParams?.dateOfExpiry
                        ? new Date(licenseGenerationParams.dateOfExpiry)
                        : null;
                if (
                    !Array.isArray(
                        licenseGenerationParams.properties['organizationsList']
                    )
                ) {
                    licenseGenerationParams.properties['organizationsList'] =
                        licenseGenerationParams?.properties[
                            'organizationsList'
                        ].split(';');
                }

                this.version = licenseGenerationParams.properties['version'];

                licenseGenerationParams.properties.testLicense = !!licenseGenerationParams.properties.testLicense === !!'true';

                this.form.controls.licenseMeta.patchValue(
                    licenseGenerationParams
                );
                this.form.disable();
            } else {
                this.form.reset();
                this.form.enable();
            }
        });

        this.form.valueChanges.subscribe((value) => {
            const temp = value;
            if (Array.isArray(temp.licenseMeta.properties.organizationsList)) {
                temp.licenseMeta.properties.organizationsList =
                    temp.licenseMeta.properties?.organizationsList?.join(';');
            }
            if (
                temp.files?.privateKey &&
                Array.isArray(temp.files.privateKey._files)
            ) {
                temp.files.privateKey = temp?.files?.privateKey?._files[0];
            }
            if (
                temp.files?.publicKey &&
                Array.isArray(temp.files.publicKey._files)
            ) {
                temp.files.publicKey = temp?.files?.publicKey?._files[0];
            }
            temp.licenseType = LicenseType.SYSTEM;

            const formDataType = new FormDataType(value);
            this.valueChanged.emit(formDataType);
        });

        this.form.statusChanges.subscribe((value) => {
            this.statusChanged.emit(value);
        });

        this.innkppForm = this.formBuilder.group({
            inn: new FormControl(
                '',
                Validators.compose([
                    Validators.required,
                    Validators.pattern('^\\d{10,12}$'),
                ])
            ),
            kpp: new FormControl(
                '',
                Validators.compose([
                    Validators.required,
                    Validators.pattern('^\\d{9}$'),
                ])
            ),
        });
    }

    get organizationsList(): AbstractControl {
        return this.form.get('licenseMeta.properties.organizationsList');
    }

    addFromInput(event: MatChipInputEvent): void {
        this.tryAddOrg(event.value)
    }

    addFromBuffer(event: ClipboardEvent): void {
        event.preventDefault();
        this.tryAddOrg(event.clipboardData.getData('Text'))
    }

    tryAddOrg(text: String) {
        let digits = text.split(/[\s.,:;]+/);
        let i;
        for (i=0; i + 1 < digits.length; i+=2){
            let inn = digits[i].trim();
            let kpp = digits[i + 1].trim();
            if (inn && kpp && inn.match(/^\d{10,12}$/) && kpp.match(/^\d{9}$/)) {
                if (this.organizationsList.value && this.organizationsList.value.indexOf(`${inn}:${kpp}`) != -1) continue;
                this.organizationsList.setValue([
                    ...(this.organizationsList?.value ?? []),
                    `${inn}:${kpp}`,
                ]);
            } else break;
        }

        if (i < digits.length) {
            this.organizationsInput = digits.slice(i).join(" ");
        } else this.organizationsInput = '';
        this.organizationsList.updateValueAndValidity();
    }

    /**
     * Добавляет чипс в спискок
     */
    addFromForm($event: { inn: number; kpp: number }): void {
        const value = `${$event.inn}:${$event.kpp}`;

        if (
            this.organizationsList.value &&
            this.organizationsList.value.indexOf(value) != -1
        ) {
            this.innkppForm.reset();
            return;
        }

        if (value.indexOf('_') > -1 || this.innkppForm.invalid) {
            return;
        }

        // Добавляет ИНН:КПП
        if ((value || '').trim()) {
            this.organizationsList.setValue([
                ...(this.organizationsList?.value ?? []),
                value.trim(),
            ]);
            this.organizationsList.updateValueAndValidity();
        }

        this.innkppForm.reset();
    }

    /**
     * Удаляет чипс из списка
     */
    remove(innkpp: string): void {
        const index = this.organizationsList.value.indexOf(innkpp);

        if (index >= 0) {
            this.organizationsList.value.splice(index, 1);
            this.organizationsList.updateValueAndValidity();
        }
    }

    getInn(value: string) {
        const innkpp = value.split(':');
        return innkpp[0];
    }

    getKpp(value: string) {
        const innkpp = value.split(':');
        return innkpp[1];
    }
}
