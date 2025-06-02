import {TuiDay} from "@taiga-ui/cdk";
import {FileType, LicenseType} from "./license-type.model";

/**
 * Метаданные ключа, служит так и для генерации
 */
export class LicenseMeta {

    /**
     * Идентификатор
     */
    private _id: string | null;

    /**
     * Тип лицензии
     */
    private _licenseType: LicenseType;

    /**
     * Предыдущий Идентификатор лицензии
     */
    private _previousLicense: string | null;

    /**
     * Дата выпуска(формат дат yyyy-MM-dd)
     */
    private _dateOfIssue: Date;

    /**
     * Срок действия
     */
    private _dateOfExpiry: Date;

    /**
     * Дополнительные параметры
     */
    private _properties: Map<Property, any> | null;

    /**
     * Файлы лицензии
     */
    private _files: Record<FileType, number>;

    public static fullLicenseMeta(id: string | null, licenseType: LicenseType, previousLicense: string | null, dateOfIssue: Date, dateOfExpiry: Date, properties: Map<Property, any> | null) {
        const licenseMeta: LicenseMeta = new LicenseMeta();
        licenseMeta.id = id
        licenseMeta.licenseType = licenseType;
        licenseMeta.previousLicense = previousLicense;
        licenseMeta.dateOfIssue = dateOfIssue;
        licenseMeta.dateOfExpiry = dateOfExpiry;
        licenseMeta.properties = properties;
        return licenseMeta;
    }

    public static updateLicenseMeta(id: string, dateOfExpiry: Date): LicenseMeta {
        const licenseMeta: LicenseMeta = new LicenseMeta();
        licenseMeta.id = id
        licenseMeta.dateOfExpiry = dateOfExpiry;
        return licenseMeta;
    }

    get id(): string | null {
        return this._id;
    }

    set id(value: string | null) {
        this._id = value;
    }

    get previousLicense(): string | null {
        return this._previousLicense;
    }

    set previousLicense(value: string | null) {
        this._previousLicense = value;
    }

    get dateOfIssue(): Date {
        return this._dateOfIssue;
    }

    set dateOfIssue(value: Date) {
        this._dateOfIssue = value;
    }

    get dateOfExpiry(): Date {
        return this._dateOfExpiry;
    }

    set dateOfExpiry(value: Date) {
        this._dateOfExpiry = value;
    }

    get properties(): Map<Property, any> | null {
        return this._properties;
    }

    set properties(value: Map<Property, any> | null) {
        this._properties = value;
    }

    get licenseType(): LicenseType {
        return this._licenseType;
    }

    set licenseType(value: LicenseType) {
        this._licenseType = value;
    }

    get files(): Record<FileType, any> {
        return this._files;
    }

    set files(value: Record<FileType, any>) {
        this._files = value;
    }

    convertMapToObject(metricArguments: Map<Property, any>): Record<string, any> {
        let newObject: Record<string, any> = {}
        if (metricArguments) {
            for (let [key, value] of metricArguments) {
                newObject[key] = value;
            }
        }
        return newObject;
    }

    toJSON() {
        return {
            id: this._id,
            previousLicense: this._previousLicense,
            dateOfIssue: this._dateOfIssue,
            dateOfExpiry: this._dateOfExpiry,
            properties: this.convertMapToObject(this._properties!)
        }
    }
}

export enum Property {
    organizationsList = "organizationsList",
    comment = "comment",
    version = "version",
    testLicense = "testLicense",
    licenseNumber = "licenseNumber",
    issuedBy = "issuedBy",
    issuedTo = "issuedTo",
}

export class License {
    private _id: string
    private _previousLicense: string
    private _dateOfIssue: TuiDay
    private _dateOfExpiry: TuiDay
    private _licenseNumber: number
    private _licenseType: LicenseType
    private _organizationsList: OrgInfo[]
    private _comment: string
    private _version: string
    private _isTest: boolean
    private _issuedTo: string
    private _issuedBy: string
    private _files: Record<FileType, any>;

    private _licenseSignature: string
    private _signatureDigest: string

    private testLicense: string
    private actions: string

    static castToLicense(licenseMeta: LicenseMeta): License {
        let license: License = new License();
        const properties: Map<any, any> = new Map(Object.entries(licenseMeta.properties as Object))
        license.id = licenseMeta.id!;
        license.previousLicense = licenseMeta.previousLicense!
        license.dateOfIssue = TuiDay.fromUtcNativeDate(new Date(licenseMeta.dateOfIssue as unknown as string));
        license.dateOfExpiry = TuiDay.fromUtcNativeDate(new Date(licenseMeta.dateOfExpiry as unknown as string));
        license.licenseNumber = properties.get(Property.licenseNumber);
        license.licenseType = licenseMeta.licenseType;
        license.organizationsList = (properties.get(Property.organizationsList) as string).split(";").map(orgInfo => {
            const innKpp: string[] = orgInfo.split(":");
            return {inn: +innKpp[0], kpp: +innKpp[1]};
        })
        license.comment = properties.get(Property.comment);
        license.version = properties.get(Property.version);
        license.isTest = false;
        const testProperty: string = properties.get(Property.testLicense);
        if (testProperty && testProperty === 'true') {
            license.isTest = true;
        }
        license.issuedTo = properties.get(Property.issuedTo);
        license.issuedBy = properties.get(Property.issuedBy);
        license.files = licenseMeta.files
        return license;
    }

    static prepareLicenseFromDecryption(license: License): License {
        let preparedLicense: License = new License();
        preparedLicense.id = license.id!;
        preparedLicense.previousLicense = license.previousLicense!
        preparedLicense.dateOfIssue = TuiDay.fromUtcNativeDate(new Date(license.dateOfIssue as unknown as string));
        preparedLicense.dateOfExpiry = TuiDay.fromUtcNativeDate(new Date(license.dateOfExpiry as unknown as string));
        preparedLicense.licenseNumber = license.licenseNumber;
        preparedLicense.licenseType = license.licenseType;
        preparedLicense.organizationsList = (license.organizationsList as unknown as string).split(";").map(orgInfo => {
            const innKpp: string[] = orgInfo.split(":");
            return {inn: +innKpp[0], kpp: +innKpp[1]};
        })
        preparedLicense.isTest = false;
        const testProperty: string = license.testLicense;
        if (testProperty === 'true') {
            preparedLicense.isTest = true;
        }
        preparedLicense.comment = license.comment;
        preparedLicense.version = license.version;
        preparedLicense.issuedTo = license.issuedTo;
        preparedLicense.issuedBy = license.issuedBy;
        preparedLicense.licenseSignature = license.licenseSignature;
        preparedLicense.signatureDigest = license._signatureDigest;
        return preparedLicense;
    }

    get id(): string {
        return this._id;
    }

    set id(value: string) {
        this._id = value;
    }

    get previousLicense(): string {
        return this._previousLicense;
    }

    set previousLicense(value: string) {
        this._previousLicense = value;
    }

    get dateOfIssue(): TuiDay {
        return this._dateOfIssue;
    }

    set dateOfIssue(value: TuiDay) {
        this._dateOfIssue = value;
    }

    get dateOfExpiry(): TuiDay {
        return this._dateOfExpiry;
    }

    set dateOfExpiry(value: TuiDay) {
        this._dateOfExpiry = value;
    }

    get licenseNumber(): number {
        return this._licenseNumber;
    }

    set licenseNumber(value: number) {
        this._licenseNumber = value;
    }

    get licenseType(): LicenseType {
        return this._licenseType;
    }

    set licenseType(value: LicenseType) {
        this._licenseType = value;
    }

    get organizations(): OrgInfo[] {
        return this._organizationsList;
    }

    set organizations(value: OrgInfo[]) {
        this._organizationsList = value;
    }

    get comment(): string {
        return this._comment;
    }

    set comment(value: string) {
        this._comment = value;
    }

    get version(): string {
        return this._version;
    }

    set version(value: string) {
        this._version = value;
    }

    get isTest(): boolean {
        return this._isTest;
    }

    set isTest(value: boolean) {
        this._isTest = value;
    }

    get issuedTo(): string {
        return this._issuedTo;
    }

    set issuedTo(value: string) {
        this._issuedTo = value;
    }

    get issuedBy(): string {
        return this._issuedBy;
    }

    set issuedBy(value: string) {
        this._issuedBy = value;
    }

    get organizationsList(): OrgInfo[] {
        return this._organizationsList;
    }

    set organizationsList(value: OrgInfo[]) {
        this._organizationsList = value;
    }

    get files(): Record<FileType, any> {
        return this._files;
    }

    set files(value: Record<FileType, any>) {
        this._files = value;
    }


    get licenseSignature(): string {
        return this._licenseSignature;
    }

    set licenseSignature(value: string) {
        this._licenseSignature = value;
    }

    get signatureDigest(): string {
        return this._signatureDigest;
    }

    set signatureDigest(value: string) {
        this._signatureDigest = value;
    }
}

export interface OrgInfo {
    inn: number | null
    kpp: number | null
}


export class DecryptedLicense {

    private _decryptedLicense: License
    private _licenseStatus: LicenseStatus

    constructor(decryptedLicense: License, licenseStatus: LicenseStatus) {
        this._decryptedLicense = decryptedLicense;
        this._licenseStatus = licenseStatus;
    }

    get decryptedLicense(): License {
        return this._decryptedLicense;
    }

    set decryptedLicense(value: License) {
        this._decryptedLicense = value;
    }

    get licenseStatus(): LicenseStatus {
        return this._licenseStatus;
    }

    set licenseStatus(value: LicenseStatus) {
        this._licenseStatus = value;
    }
}

export class LicenseStatus {

    private _message: string
    private _status: boolean

    constructor(message: string, status: boolean) {
        this._message = message;
        this._status = status;
    }

    get message(): string {
        return this._message;
    }

    set message(value: string) {
        this._message = value;
    }

    get status(): boolean {
        return this._status;
    }

    set status(value: boolean) {
        this._status = value;
    }
}
