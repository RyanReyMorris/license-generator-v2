import {LicenseType} from "./license-type.model";
import {HttpParams} from "@angular/common/http";

/**
 * Поиск лицензий
 */
export class LicenseSearch {

    private _licenseType: LicenseType;
    private _isReal: boolean;
    private _isActive: boolean;
    private _page: number;
    private _size: number;
    private _sort: string;

    public constructor(page: number, size: number, sort: string, licenseType: LicenseType, isReal: boolean, isActive: boolean) {
        this._page = page;
        this._size = size;
        this._sort = sort;
        this._licenseType = licenseType;
        this._isReal = isReal;
        this._isActive = isActive;
    }

    public getParams(): HttpParams {
        return new HttpParams()
            .set('page', this._page)
            .set('size', this._size)
            .set('sort', this._sort)
            .set('licenseType', this._licenseType)
            .set('real', this._isReal)
            .set('active', this._isActive)
    }

    get page(): number {
        return this._page;
    }

    set page(value: number) {
        this._page = value;
    }

    get size(): number {
        return this._size;
    }

    set size(value: number) {
        this._size = value;
    }

    get sort(): string {
        return this._sort;
    }

    set sort(value: string) {
        this._sort = value;
    }


    get licenseType(): LicenseType {
        return this._licenseType;
    }

    set licenseType(value: LicenseType) {
        this._licenseType = value;
    }

    get isReal(): boolean {
        return this._isReal;
    }

    set isReal(value: boolean) {
        this._isReal = value;
    }

    get isActive(): boolean {
        return this._isActive;
    }

    set isActive(value: boolean) {
        this._isActive = value;
    }
}
