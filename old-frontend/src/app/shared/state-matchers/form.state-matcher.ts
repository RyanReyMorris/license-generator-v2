import {ErrorStateMatcher} from '@angular/material/core';
import {FormControl, FormGroupDirective, NgForm} from '@angular/forms';

/**
 * Дефолтный валидатор для всех форм
 *
 * @author DSalikhov
 * @export
 */
export class FormStateMatcher implements ErrorStateMatcher {
    isErrorState(
        control: FormControl | null,
        form: FormGroupDirective | NgForm | null
    ): boolean {
        return !!(
            control &&
            control.invalid
        );
    }
}
