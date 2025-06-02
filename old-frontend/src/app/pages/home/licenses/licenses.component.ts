import {Component, ViewEncapsulation} from '@angular/core';
import {LoggerService} from '@shared/service/logger/logger.service';
import {HomeFacade} from '../shared/service/facade/home.facade';
import {LicenseType} from '@api/license/enums/license-type';
import {ColDef, GridApi, GridOptions, RowClickedEvent} from 'ag-grid-community';
import {DatePipe} from '@angular/common';
import {PageSettings} from '@api/license/pageSettings';
import {DropdownMenuComponent} from '@pages/home/licenses/components/dropdown-menu/dropdown-menu.component';
import AggridLocaleRu from '@pages/home/shared/utils/aggridLocaleRu';

/**
 * Компонент для логина
 *
 * @author DSalikhov
 * @export
 */
@Component({
    selector: 'app-licenses',
    templateUrl: './licenses.component.html',
    styleUrls: ['./licenses.component.less'],
    providers: [DatePipe],
    encapsulation: ViewEncapsulation.None
})
export class LicensesComponent {
    licenses = LicenseType;
    gridOptions: GridOptions;
    rowClassRules;

    columnDefs: ColDef[];
    defaultColDef: ColDef;
    gridApi: GridApi;
    frameworkComponents: any;
    predefineCol: ColDef = {
        columnGroupShow: 'nonClickable',
        headerName: '',
        cellRenderer: 'dropdownMenuRenderer',
        cellRendererParams: {
            dropdownData: [
                {
                    buttonClick: (rowData) => this.homeFacade.openNewLicenseModal(rowData, rowData.licenseType),
                    icon: 'info',
                    label: 'Подробнее',
                },
                {
                    buttonClick: (rowData) => this.homeFacade.openUpdateLicense(rowData, rowData.licenseType),
                    icon: 'refresh',
                    label: 'Продлить',
                },
                {
                    buttonClick: (rowData => this.homeFacade.deleteLicenseById(rowData.id, rowData.licenseType)),
                    icon: 'remove',
                    label: 'Удалить',
                },
                {
                    buttonClick: (rowData) => this.homeFacade.downloadLicense(rowData.files.LICENSE_FILE, rowData.licenseType),
                    icon: 'get_app',
                    label: 'Скачать лицензию',
                    isFileExists: (rowData) => {
                        return rowData.files?.LICENSE_FILE !== undefined;
                    },
                },
                {
                    buttonClick: (rowData) => this.homeFacade.downloadLicense(rowData.files.PUBLIC_KEY, rowData.licenseType),
                    icon: 'get_app',
                    label: 'Скачать откр. ключ',
                    isFileExists: (rowData) => rowData.files.PUBLIC_KEY !== undefined,
                }
            ]
        },
        pinned: 'right',
        lockPinned: true,
        editable: false,
        sortable: false,
        width: 15,
        filter: false,
        resizable: false,
        lockVisible: true,
    };

    constructor(
        private logger: LoggerService,
        private homeFacade: HomeFacade,
        private date: DatePipe
    ) {
        this.frameworkComponents = {
            dropdownMenuRenderer: DropdownMenuComponent,
        };

        this.defaultColDef = {
            editable: false,
            sortable: true,
            flex: 1,
            minWidth: 100,
            filter: true,
            resizable: true,
            lockVisible: true,
        };

        this.gridOptions = {
            localeText: AggridLocaleRu.ruLocale,
            suppressRowDeselection: true,
            pagination: false,
            paginationPageSize: PageSettings.size,
            onGridReady: (params) => {
                this.gridApi = params.api;

                this.keys.subscribe(rowData => {
                        this.gridApi.setRowData(rowData.content);
                    }
                );

                window.addEventListener('onresize', () => {
                    this.gridApi.sizeColumnsToFit();
                });


                this.homeFacade.getSelectedLicense().subscribe((license) => {
                    switch (license) {
                        case LicenseType.SYSTEM: {
                            this.gridApi.setColumnDefs([
                                {
                                    headerName: 'UUID',
                                    field: 'id',
                                },
                                {
                                    headerName: 'Тестовая',
                                    field: 'properties.testLicense',
                                    cellRenderer: params => {
                                        return '<input type="checkbox" onclick="return false;" ' +  (params.value ? 'checked="checked" />' :'/>');
                                    }
                                },
                                {
                                    headerName: 'Версия',
                                    field: 'properties.version',
                                },
                                {
                                    headerName: 'Выдан кому',
                                    field: 'properties.issuedTo',
                                    comparator: (v1, v2) => {
                                        return v1.toLowerCase().localeCompare(v2.toLowerCase());
                                    }
                                },
                                {
                                    headerName: 'Выдан кем',
                                    field: 'properties.issuedBy',
                                    comparator: (v1, v2) => {
                                        return v1.toLowerCase().localeCompare(v2.toLowerCase());
                                    }
                                },
                                {
                                    headerName: 'Номер лицензии',
                                    field: 'properties.licenseNumber',
                                    valueGetter: ({data}) => {
                                        return parseInt(data.properties.licenseNumber, 10);
                                    }
                                },
                                {
                                    headerName: 'Организации',
                                    field: 'properties.organizationsList',
                                },
                                {
                                    headerName: 'Комментарий',
                                    field: 'properties.comment',
                                },
                                this.predefineCol
                            ]);
                            break;
                        }
                        default: {
                            this.gridApi.setColumnDefs([
                                {
                                    headerName: 'UUID',
                                    field: 'id',
                                },
                                {
                                    headerName: 'Тип',
                                    field: 'licenseType',
                                },
                                {
                                    headerName: 'Тестовая',
                                    field: 'properties.testLicense',
                                    cellRenderer: params => {
                                        return '<input type="checkbox" onclick="return false;" ' +  (params.value ? 'checked="checked" />' :'/>');
                                    }
                                },
                                {
                                    headerName: 'Выдан кому',
                                    field: 'properties.issuedTo',
                                    comparator: (v1, v2) => {
                                        return v1.toLowerCase().localeCompare(v2.toLowerCase());
                                    }
                                },
                                {
                                    headerName: 'Выдан кем',
                                    field: 'properties.issuedBy',
                                    comparator: (v1, v2) => {
                                        return v1.toLowerCase().localeCompare(v2.toLowerCase());
                                    }
                                },
                                {
                                    headerName: 'Номер лицензии',
                                    field: 'properties.licenseNumber',
                                    valueGetter: ({data}) => {
                                        return parseInt(data.properties.licenseNumber, 10);
                                    }
                                },
                                {
                                    headerName: 'Дата создания',
                                    field: 'dateOfIssue',
                                    valueFormatter: (param) => this.date.transform(param.value, 'dd.MM.yyyy'),
                                },
                                {
                                    headerName: 'Дата окончания',
                                    field: 'dateOfExpiry',
                                    valueFormatter: (param) => this.date.transform(param.value, 'dd.MM.yyyy'),
                                    initialSort: 'desc'
                                },
                                this.predefineCol
                            ]);
                        }
                    }
                });
            },
            getRowNodeId(data) {
                return data.id;
            },
            onRowClicked: (event: RowClickedEvent) => {
                if (event.api.getFocusedCell().column.getColumnGroupShow() !== 'nonClickable') {
                    this.homeFacade.openNewLicenseModal(event.data, event.data.licenseType);
                }
            },
        };

        this.rowClassRules = {
            'red-outer': (params) => new Date().getTime() > new Date(params.data.dateOfExpiry).getTime(),
            'blue-outer': (params) => params.data.dateOfExpiry === null,
        };

        // this.homeFacade.isUpdating$().subscribe(value => {
        //
        // });

        this.refreshData();
    }

    get keys() {
        return this.homeFacade.getLicenses();
    }

    /**
     * Обновляет данные о ключах
     */
    refreshData() {
        this.homeFacade.refreshData();
    }

    /**
     * Скачивает ключ
     *
     * @param keyFileId - id ключа
     * @param licenseType - тип лицензии
     */
    downloadKey(keyFileId: number, licenseType: LicenseType) {
        this.homeFacade.downloadLicense(keyFileId, licenseType);
    }

    /**
     * Открывает диалоговое окно с генерацией лицензии
     */
    createLicense() {
        this.homeFacade.openNewLicenseModal(null, this.homeFacade.selectedLicenseValue);
    }

    checkLicense() {
        this.homeFacade.openCheckLicense();
    }
}
