import {Component} from '@angular/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';
import {ICellRendererParams} from 'ag-grid-community';

export type DropdownData = ICellRendererParams & {
    dropdownData: {
        buttonClick: (rowData: ICellRendererParams) => void,
        icon: string,
        label: string
        isFileExists?: (rowData: ICellRendererParams) => boolean
    }[]
};

@Component({
    selector: 'app-dropdown-menu',
    templateUrl: './dropdown-menu.component.html',
    styleUrls: ['./dropdown-menu.component.less']
})
export class DropdownMenuComponent implements ICellRendererAngularComp {

    params: DropdownData;

    agInit(params: DropdownData): void {
        this.params = params;
    }

    refresh(params: any): boolean {
        return true;
    }

    isFileExists(item) {
        if (item?.isFileExists) {
            return item?.isFileExists(this.params.data);
        }
        return true;
    }

    onClick($event, index) {
        this.params.dropdownData[index].buttonClick(this.params.node.data);
    }
}
