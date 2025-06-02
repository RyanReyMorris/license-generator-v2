import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Page} from '@api/license/page';
import {PageSettings} from '@api/license/pageSettings';

@Component({
    selector: 'app-pagination-toolbar',
    templateUrl: './pagination-toolbar.component.html',
    styleUrls: ['./pagination-toolbar.component.less']
})
export class PaginationToolbarComponent<T> {

    @Input() page: Page<T> = null;
    @Output() refresh: EventEmitter<null> = new EventEmitter<null>();

    firstPage() {
        if (!this.page.first) {
            PageSettings.page = 0;
            this.refresh.emit();
        }
    }

    back() {
        if (!this.page.first) {
            --PageSettings.page;
            this.refresh.emit();
        }
    }

    next() {
        if (!this.page.last) {
            ++PageSettings.page;
            this.refresh.emit();
        }
    }

    lastPage() {
        if (!this.page.last) {
            PageSettings.page = this.page.totalPages - 1;
            this.refresh.emit();
        }
    }
}
