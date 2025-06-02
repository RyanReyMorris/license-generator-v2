import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

type ModalData = {
    title: string,
    message: string
};

/**
 * Компонент модалки для подтверждения
 *
 * @author DSalikhov
 * @export
 */
@Component({
    selector: 'app-confirmation-modal',
    templateUrl: './confirmation-modal.component.html',
    styleUrls: ['./confirmation-modal.component.less']
})
export class ConfirmationModalComponent {

    constructor(
        public dialogRef: MatDialogRef<ConfirmationModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ModalData
    ) {
    }

    yesClicked() {
        this.dialogRef.close(true);
    }

    noClicked() {
        this.dialogRef.close(false);
    }
}
