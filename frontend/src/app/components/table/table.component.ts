import {
    TUI_DEFAULT_MATCHER,
    TuiActiveZoneModule,
    tuiControlValue,
    TuiDay,
    tuiDefaultSort,
    tuiIsFalsy,
    tuiIsPresent,
    TuiLetModule,
    TuiObscuredModule
} from "@taiga-ui/cdk";
import {TuiReorderModule, TuiTableModule, TuiTablePaginationModule} from "@taiga-ui/addon-table";
import {ChangeDetectionStrategy, Component, Inject} from "@angular/core";
import {PolymorpheusContent} from '@tinkoff/ng-polymorpheus';
import {
    TuiAlertService,
    TuiButtonModule,
    TuiDataListModule,
    TuiDialogContext,
    TuiDialogModule,
    TuiDialogService,
    TuiDropdownModule,
    TuiErrorModule,
    TuiGroupModule,
    TuiHostedDropdownModule,
    TuiLoaderModule,
    TuiScrollbarModule,
    TuiSvgModule,
    TuiTextfieldControllerModule
} from "@taiga-ui/core";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {
    TUI_ARROW,
    TUI_PROMPT,
    TuiActionModule,
    TuiBadgeModule,
    TuiComboBoxModule,
    TuiDataListDropdownManagerModule,
    TuiFieldErrorPipeModule,
    TuiFileLike,
    TuiFilterByInputPipeModule,
    TuiFilterModule,
    TuiInputCountModule,
    TuiInputDateModule,
    TuiInputFilesModule,
    TuiInputModule,
    TuiIslandModule,
    TuiLineClampModule,
    TuiMarkerIconModule,
    TuiPromptData,
    TuiRadioBlockModule,
    TuiTagModule,
    TuiTextareaModule
} from "@taiga-ui/kit";
import {AsyncPipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {TuiAppBarModule} from "@taiga-ui/addon-mobile";
import {
    BehaviorSubject,
    catchError,
    combineLatest,
    debounceTime,
    filter,
    finalize,
    map,
    Observable,
    of,
    share,
    startWith,
    Subject,
    switchMap,
    throwError,
    timer
} from "rxjs";
import {TuiMoneyModule} from "@taiga-ui/addon-commerce";
import {LicenseService} from "../../shared/services/license.service";
import {DecryptedLicense, License, LicenseMeta, Property} from "../../shared/models/license-params";
import {LicenseType} from "../../shared/models/license-type.model";
import {LicenseSearch} from "../../shared/models/search-params.model";
import {LicenseUtils} from "../../shared/utils/license.utils";
import {TuiBlockStatusModule} from "@taiga-ui/layout";


interface OrgInfo {
    inn: number | null
    kpp: number | null
}

type ColumnName = 'Номер' | 'Дата выпуска' | 'Срок действия' | 'Автор' | 'Получатель' | 'Признак' | 'actions';
type ColumnCode =
    'licenseNumber'
    | 'dateOfIssue'
    | 'dateOfExpiry'
    | 'licenseType'
    | 'isTest'
    | 'issuedTo'
    | 'issuedBy'
    | 'actions';
const columns: Map<ColumnName, ColumnCode> = new Map<ColumnName, ColumnCode>([
    ['Номер', 'licenseNumber'],
    ['Дата выпуска', 'dateOfIssue'],
    ['Срок действия', 'dateOfExpiry'],
    ['Автор', 'issuedBy'],
    ['Получатель', 'issuedTo'],
    ['Признак', 'isTest'],
    ['actions', 'actions']
]);

@Component({
    selector: 'app-table',
    standalone: true,
    imports: [
        TuiLoaderModule,
        TuiTablePaginationModule,
        TuiTableModule,
        TuiTextfieldControllerModule,
        FormsModule,
        TuiInputModule,
        TuiInputCountModule,
        ReactiveFormsModule,
        TuiHostedDropdownModule,
        TuiReorderModule,
        TuiLoaderModule,
        TuiButtonModule,
        AsyncPipe,
        NgIf,
        NgForOf,
        TuiLetModule,
        TuiAppBarModule,
        TuiFilterModule,
        TuiSvgModule,
        NgClass,
        TuiDataListModule,
        TuiDropdownModule,
        TuiActiveZoneModule,
        TuiObscuredModule,
        TuiDataListDropdownManagerModule,
        TuiDialogModule,
        TuiMoneyModule,
        TuiInputDateModule,
        TuiMarkerIconModule,
        TuiActionModule,
        TuiBadgeModule,
        TuiErrorModule,
        TuiFieldErrorPipeModule,
        TuiInputFilesModule,
        TuiComboBoxModule,
        TuiFilterByInputPipeModule,
        TuiTagModule,
        TuiTextareaModule,
        TuiGroupModule,
        TuiRadioBlockModule,
        TuiLineClampModule,
        TuiIslandModule,
        TuiScrollbarModule,
        TuiBlockStatusModule,
    ],
    templateUrl: './table.component.html',
    styleUrl: './table.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [],
})
export class TableComponent {
    constructor(@Inject(TuiDialogService) private readonly dialogs: TuiDialogService,
                @Inject(TuiAlertService) private readonly alerts: TuiAlertService,
                private licenseService: LicenseService) {
    }

    loadingError$ = new BehaviorSubject(false);
    readonly arrow = TUI_ARROW;
    readonly TODAY: TuiDay = TuiDay.currentLocal();
    readonly TOMORROW: TuiDay = this.TODAY.append({year: 0, month: 0, day: 1})
    readonly licenseTypes = [
        {name: 'ЮЗ ЭДО', code: LicenseType.SYSTEM, disabled: false},
        {name: 'Платформа', code: LicenseType.PLATFORM, disabled: true},
        {name: 'КЭДО', code: LicenseType.KEDO, disabled: true},
        {name: 'СЭД', code: LicenseType.SED, disabled: true}
    ];
    currentLicense: License | null = null;
    initial: ColumnName[] = ['Номер', 'Дата выпуска', 'Срок действия', 'Автор', 'Получатель', 'Признак'];
    enabled: ColumnName[] = this.initial;
    columns: ColumnCode[] = Array.from(columns.values());
    search: string = '';
    activeItems = ['Активная'];
    realItems = ['Боевая'];
    form = new FormGroup({
        active: new FormControl([]),
        real: new FormControl([]),
    });
    refreshData$ = new BehaviorSubject(true);
    size$ = new BehaviorSubject(10);
    page$ = new BehaviorSubject(0);
    direction$ = new BehaviorSubject<-1 | 1>(-1);
    sorter$ = new BehaviorSubject<ColumnCode>('dateOfIssue');
    request$ = combineLatest([this.sorter$, this.direction$, this.page$, this.size$, this.refreshData$,
        tuiControlValue<string[]>(this.form.controls.active), tuiControlValue<string[]>(this.form.controls.real)]).pipe(
        debounceTime(0), switchMap(query => this.loadLicense(...query).pipe(startWith(null))), share()
    );
    loading$: Observable<boolean> = this.request$.pipe(map(tuiIsFalsy));
    total$: Observable<number> = this.request$.pipe(filter(tuiIsPresent), map(({length}) => length), startWith(1));
    data$: Observable<readonly License[]> = this.request$.pipe(filter(tuiIsPresent), map(licenses => licenses.filter(tuiIsPresent)), startWith([]),);

    onEnabled(enabled: ColumnName[]): void {
        this.enabled = enabled;
        this.columns = this.initial.filter(column => enabled.includes(column)).map(column => columns.get(column)!);
        this.columns[this.columns.length] = 'actions'
    }

    onSize(size: number): void {
        this.size$.next(size);
    }

    onPage(page: number): void {
        this.page$.next(page);
    }

    isMatch(value: unknown): boolean {
        return !!this.search && TUI_DEFAULT_MATCHER(value, this.search);
    }

    private loadLicense(sortColumn: ColumnCode, direction: -1 | 1, page: number, size: number, refresh: boolean, active: string[], real: string[]): Observable<License[]> {
        const isActive: boolean = active[0] === 'Активная';
        const isReal: boolean = real[0] === 'Боевая';
        const sort = 'dateOfIssue,desc';
        const searchParams: LicenseSearch = new LicenseSearch(page, size, sort, LicenseType.SYSTEM, isReal, isActive);
        return this.licenseService.getLicenses(searchParams).pipe(
            catchError(err => this.handleError(err)),
            map((page) => page.content.map(licenseMeta => License.castToLicense(licenseMeta))),
            map(results => results.sort((a, b) => direction * tuiDefaultSort(a[sortColumn], b[sortColumn])))
        )
    }

    private handleError(error: any) {
        this.loadingError$.next(true);
        let header:string;
        let message:string;
        if(error.error.error) {
            message= error.error.error
            header = `Статус ${error.error.status}`
        } else {
            message= error.error.message
            header = `Статус ${error.status}`
        }
        this.alerts.open(message, {
            autoClose: 4000,
            status: "error",
            label: header
        }).subscribe();
        return throwError(() => {
            return error;
        });
    }

    createLicense(content: PolymorpheusContent<TuiDialogContext>) {
        this.createLicenseForm.controls.licenseType.setValue(this.licenseTypes[0]);
        this.createLicenseForm.controls.expireDate.setValue(this.TOMORROW);
        this.createLicenseForm.controls.isTestLicense.setValue('test');
        this.dialogs.open(content, {
            label: 'Создать лицензию',
            size: 's'
        }).subscribe({
            complete: () => {
                this.tags = [];
                this.createLicenseForm.reset();
            },
        });
    }

    readonly stringifyLicenseType = (licenseType: { name: string; code: string }): string => `${licenseType.name}`;
    readonly stringifyTag = (orgInfo: OrgInfo): string => `ИНН:${orgInfo.inn}, КПП:${orgInfo.kpp}`;
    protected tags: OrgInfo[] = [];

    handleTagEdited(currentIndex: number): void {
        this.tags.splice(currentIndex, 1);
    }

    readonly innKppGroup = new FormGroup({
        inn: new FormControl(null, [Validators.required, Validators.pattern("[0-9]{12}")]),
        kpp: new FormControl(null, [Validators.required, Validators.pattern("^(\\d{10}|\\d{12})$")
        ]),
    });

    addOrgInfoToNewLicense() {
        const orgInfo: OrgInfo = {inn: this.innKppGroup.controls.inn.value, kpp: this.innKppGroup.controls.kpp.value};
        let isOrgExistAlready = false
        this.tags.forEach((e) => {
            if (JSON.stringify(orgInfo) === JSON.stringify(e)) isOrgExistAlready = true;
        });
        if (!isOrgExistAlready) {
            this.tags.push(orgInfo);
            this.createLicenseForm.controls.orgInfo.setValue(this.tags);
        }
        this.innKppGroup.reset()
    }

    protected createLicenseForm = new FormGroup({
        licenseType: new FormControl(this.licenseTypes[0], Validators.required),
        expireDate: new FormControl(this.TOMORROW, Validators.required),
        issuedTo: new FormControl('', Validators.required),
        issuedBy: new FormControl('', Validators.required),
        isTestLicense: new FormControl('test'),
        privateKey: new FormControl<any>(null, Validators.required),
        publicKey: new FormControl<any>(null, Validators.required),
        orgInfo: new FormControl(this.tags, Validators.required),
        comment: new FormControl(''),
    })
    protected readonly loadingCreatePrivateKey = new Subject<TuiFileLike | null>();
    protected readonly loadedCreatePrivateKey = this.createLicenseForm.controls.privateKey.valueChanges.pipe(
        switchMap(file => (file ? this.fakeRequest(file, this.loadingCreatePrivateKey) : of(null))),
    );
    protected readonly loadingCreatePublicKey = new Subject<TuiFileLike | null>();
    protected readonly loadedCreatePublicKey = this.createLicenseForm.controls.publicKey.valueChanges.pipe(
        switchMap(file => (file ? this.fakeRequest(file, this.loadingCreatePublicKey) : of(null))),
    );

    createNewLicense() {
        const licenseMeta: LicenseMeta = this.createLicenseMeta();
        const files: File[] = [this.createLicenseForm.controls.privateKey.value, this.createLicenseForm.controls.publicKey.value];
        this.licenseService.createLicense(licenseMeta, files, LicenseType.SYSTEM)
            .subscribe({
                next: data => {
                    this.alerts.open('Лицензия успешно создана!', {
                        status: 'success',
                        autoClose: 1500,
                        hasCloseButton: false,
                    }).subscribe();
                },
                error: err => {
                    this.alerts.open(err.error.description, {
                        autoClose: 4000,
                        status: "error",
                        label: err.error.message
                    }).subscribe();
                },
                complete: () => {
                    this.refreshData$.next(true);
                }
            });
    }

    createLicenseMeta(): LicenseMeta {
        let properties: Map<Property, any> = new Map<Property, any>();
        const organizationList: string | undefined = this.createLicenseForm.controls.orgInfo.value?.map(orgInfo => `${orgInfo.inn}:${orgInfo.kpp}`).join(";");
        const isTestLicense: boolean = this.createLicenseForm.controls.isTestLicense.value == 'test';
        const issuedTo: string | null = this.createLicenseForm.controls.issuedTo.value;
        const issuedBy: string | null = this.createLicenseForm.controls.issuedBy.value;
        const comment: string | null = this.createLicenseForm.controls.comment.value;
        if (isTestLicense) {
            properties.set(Property.testLicense, true)
        }
        properties.set(Property.organizationsList, organizationList);
        properties.set(Property.version, "V2");
        properties.set(Property.issuedTo, issuedTo);
        properties.set(Property.issuedBy, issuedBy);
        properties.set(Property.comment, comment);
        return LicenseMeta.fullLicenseMeta(null, LicenseType.SYSTEM, null, this.TODAY.toUtcNativeDate(), this.createLicenseForm.controls.expireDate.value!.toUtcNativeDate(), properties)
    }

    protected updateLicenseForm = new FormGroup({
        newExpireDate: new FormControl(this.TOMORROW, Validators.required),
        newPrivateKey: new FormControl<null | TuiFileLike>(null, Validators.required)
    });
    protected readonly loadingUpdatePrivateKey = new Subject<TuiFileLike | null>();
    protected readonly loadedUpdatePrivateKey = this.updateLicenseForm.controls.newPrivateKey.valueChanges.pipe(
        switchMap(file => (file ? this.fakeRequest(file, this.loadingUpdatePrivateKey) : of(null))),
    );

    removeFile(fileToRemove: FormControl<TuiFileLike | null>): void {
        fileToRemove.setValue(null);
    }

    fakeRequest(file: TuiFileLike, loading: Subject<TuiFileLike | null>): Observable<TuiFileLike | null> {
        loading.next(file);
        return timer(1000).pipe(
            map(() => file),
            finalize(() => loading.next(null)),
        );
    }

    updateLicenseSubmit() {
        this.alerts
            .open('Обновление лицензии...', {autoClose: 1500, hasCloseButton: false,})
            .subscribe();
        let licenseMeta: LicenseMeta = LicenseMeta.updateLicenseMeta(this.currentLicense!.id, this.updateLicenseForm.controls.newExpireDate.value!.toUtcNativeDate())
        this.licenseService.update(licenseMeta, [this.updateLicenseForm.controls.newPrivateKey.value as unknown as File], this.currentLicense!.licenseType)
            .subscribe({
                next: data => {
                },
                error: err => {
                    this.alerts.open(err.error.description, {
                        autoClose: 4000,
                        status: "error",
                        label: err.error.message
                    }).subscribe();
                },
                complete: () => {
                    this.refreshData$.next(true);
                }
            });
        this.currentLicense = null;
    }

    updateLicense(content: PolymorpheusContent<TuiDialogContext>, license: License) {
        this.currentLicense = license;
        this.updateLicenseForm.controls.newExpireDate.setValue(this.TOMORROW);
        this.dialogs.open(content, {
            label: 'Обновление лицензии',
            size: 's'
        }).subscribe({
            complete: () => {
                this.updateLicenseForm.reset();
            },
        });
    }

    checkLicense(content: PolymorpheusContent<TuiDialogContext>) {
        this.checkLicenseForm.controls.licenseType.setValue(this.licenseTypes[0]);
        this.dialogs.open(content, {
            label: 'Проверить лицензию',
            size: 's'
        }).subscribe({
            complete: () => {
                this.checkLicenseForm.reset();
            }
        });
    }

    protected checkLicenseForm = new FormGroup({
        licenseType: new FormControl(this.licenseTypes[0], Validators.required),
        licenseFile: new FormControl<null | TuiFileLike>(null, Validators.required),
        publicKey: new FormControl<null | TuiFileLike>(null, Validators.required)
    });
    protected readonly loadingCheckLicense = new Subject<TuiFileLike | null>();
    protected readonly loadedCheckLicense = this.checkLicenseForm.controls.licenseFile.valueChanges.pipe(
        switchMap(file => (file ? this.fakeRequest(file, this.loadingCheckLicense) : of(null))),
    );
    protected readonly loadingCheckPublicKey = new Subject<TuiFileLike | null>();
    protected readonly loadedCheckPublicKey = this.checkLicenseForm.controls.publicKey.valueChanges.pipe(
        switchMap(file => (file ? this.fakeRequest(file, this.loadingCheckPublicKey) : of(null))),
    );
    decryptedLicense: DecryptedLicense | null = null;

    checkLicenseSubmit(checkLicenseTemplate: PolymorpheusContent<TuiDialogContext>) {
        this.alerts
            .open('Проверка лицензии...', {autoClose: 1500, hasCloseButton: false})
            .subscribe();
        this.licenseService.decryptAndCheck(
            this.checkLicenseForm.controls.licenseFile.value as unknown as File,
            this.checkLicenseForm.controls.publicKey.value as unknown as File,
            this.checkLicenseForm.controls.licenseType.value!.code
        ).subscribe({
            next: data => {
                this.decryptedLicense = data;
                this.dialogs.open(checkLicenseTemplate, {
                    label: 'Проверка лицензии',
                    size: 's'
                }).subscribe({
                    complete: () => {
                        this.decryptedLicense = null;
                    }
                });
            },
            error: err => {
                this.alerts.open(err.error.description, {
                    autoClose: 4000,
                    status: "error",
                    label: err.error.message
                }).subscribe();
            },
            complete: () => {
                this.refreshData$.next(true);
            }
        });
        this.currentLicense = null;
    }

    getMoreInfo(content: PolymorpheusContent<TuiDialogContext>, license: License): void {
        this.currentLicense = license;
        this.dialogs.open(content, {
            label: 'Информация о ключе',
            size: 's'
        }).subscribe({
            complete: () => {
                this.currentLicense = null;
            }
        });
    }

    delete(license: License): void {
        const data: TuiPromptData = {
            content: `Вы уверены, что хотите удалить лицензию c номером: ${license.licenseNumber}?`,
            yes: 'Удалить',
            no: 'Отмена'
        };
        this.dialogs.open<boolean>(TUI_PROMPT, {
            label: 'Подтверждение удаления',
            size: 's',
            data,
        }).pipe(switchMap(response => {
                if (response) {
                    this.alerts.open('Удаление лицензии...', {autoClose: 1500, hasCloseButton: false,}).subscribe();
                    this.licenseService.deleteById(license.id, license.licenseType).subscribe({
                        error: err => {
                            this.alerts.open(err.error.description, {
                                autoClose: 4000,
                                status: "error",
                                label: err.error.message
                            }).subscribe();
                        },
                        complete: () => {
                            this.refreshData$.next(true);
                        }
                    })
                }
                return new Observable()
            }
        )).subscribe();
    }

    downloadOpenedKey(license: License): void {
        this.alerts
            .open('Скачивание открытого ключа...', {autoClose: 1500, hasCloseButton: false,})
            .subscribe();
        this.licenseService.downloadLicense(license.files.PUBLIC_KEY, license.licenseType)
            .subscribe({
                next: data => {
                    const link = document.createElement('a');
                    link.download = LicenseUtils.getFileNameFromResponse(data);
                    link.href = window.URL.createObjectURL(data.body!);
                    link.click();
                    URL.revokeObjectURL(link.href);
                },
                error: err => {
                    this.alerts.open(err.error.description, {
                        autoClose: 4000,
                        status: "error",
                        label: err.error.message
                    }).subscribe();
                }
            });
    }

    downloadLicense(license: License): void {
        this.alerts
            .open('Скачивание лицензии...', {autoClose: 1500, hasCloseButton: false,})
            .subscribe();
        this.licenseService.downloadLicense(license.files.LICENSE_FILE, license.licenseType)
            .subscribe({
                next: data => {
                    const link = document.createElement('a');
                    link.href = window.URL.createObjectURL(data.body!);
                    link.download = LicenseUtils.getFileNameFromResponse(data);
                    link.click();
                    URL.revokeObjectURL(link.href);
                },
                error: err => {
                    this.alerts.open(err.error.description, {
                        autoClose: 4000,
                        status: "error",
                        label: err.error.message
                    }).subscribe();
                }
            });
    }
}
