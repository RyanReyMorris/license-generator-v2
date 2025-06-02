import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

type ModalData = {
    message: string
};

/**
 * Компонент модалки с ошибкой
 *
 * @author DSalikhov
 * @export
 */
@Component({
    selector: 'app-error-modal',
    templateUrl: './error-modal.component.html',
    styleUrls: ['./error-modal.component.less']
})
export class ErrorModalComponent {

    /**
     * В data должно быть только поле error
     *
     * @author DSalikhov
     */
    constructor(@Inject(MAT_DIALOG_DATA) public data: ModalData) {
    }
}
