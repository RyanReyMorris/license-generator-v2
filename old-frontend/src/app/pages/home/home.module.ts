import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialFileInputModule} from 'ngx-material-file-input';
import {AgGridModule} from 'ag-grid-angular';
import {NgxMaskModule} from 'ngx-mask';
import {HomeComponent} from './home.component';
import {HomeRoutingModule} from './home-routing.module';
import {AngularMaterialModule} from '../../angular-material/angular-material.module';
import {SystemLicenseComponent} from '@pages/home/licenses/components/modals/generate/components/system-license/system-license.component';
import {LicensesComponent} from './licenses/licenses.component';
import {GenerateComponent} from './licenses/components/modals/generate/generate.component';
import {PaginationToolbarComponent} from './licenses/components/pagination-toolbar/pagination-toolbar.component';
import {DropdownMenuComponent} from './licenses/components/dropdown-menu/dropdown-menu.component';
import {UploadLicenseComponent} from './licenses/components/modals/upload-license/upload-license.component';
import {DragDropDirective} from './licenses/components/modals/upload-license/components/drag-drop.directive';
import {UpdateLicenseComponent} from './licenses/components/modals/update-license/update-license.component';
import {TranslateModule} from '@ngx-translate/core';
import {PerfectScrollbarModule} from "ngx-perfect-scrollbar";

@NgModule({
    declarations: [
        HomeComponent,
        LicensesComponent,
        GenerateComponent,
        SystemLicenseComponent,
        PaginationToolbarComponent,
        DropdownMenuComponent,
        UploadLicenseComponent,
        DragDropDirective,
        UpdateLicenseComponent,
    ],
    imports: [
        CommonModule,
        HomeRoutingModule,
        AngularMaterialModule,
        ReactiveFormsModule,
        MaterialFileInputModule,
        FormsModule,
        AgGridModule.forRoot(),
        NgxMaskModule.forRoot(),
        TranslateModule.forChild(),
        PerfectScrollbarModule,
    ]
})
export class HomeModule {
}
