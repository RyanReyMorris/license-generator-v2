import {Component} from '@angular/core';
import {HomeFacade} from './shared/service/facade/home.facade';
import {Observable} from 'rxjs';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {LicenseType} from '@api/license/enums/license-type';

interface LicenseNode {
    name: string;
    value: LicenseType;
    children?: LicenseNode[];
}

interface FlatNode {
    expandable: boolean;
    name: string;
    level: number;
    value: LicenseType;
}

const TREE_DATA: LicenseNode[] = [
    {
        name: 'Все лицензии',
        value: null,
        children: [
            {
                name: 'Лицензия ЮЗЭДО',
                value: LicenseType.SYSTEM
            }
        ]
    }
];

/**
 * Корневой компонент для основного контента страницы
 *
 * @author DSalikhov
 * @export
 */
@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.less']
})
export class HomeComponent {
    isUpdating$: Observable<boolean>;

    treeControl = new FlatTreeControl<FlatNode>(node => node.level, node => node.expandable);
    treeFlattener = new MatTreeFlattener<LicenseNode, FlatNode>(
        this.transformer,
        node => node.level,
        node => node.expandable,
        node => node.children
    );
    dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    constructor(public homeFacade: HomeFacade) {
        this.isUpdating$ = homeFacade.isUpdating$();
        this.dataSource.data = TREE_DATA;
        this.treeControl.expandAll();
    }

    changeLicense(license: LicenseType) {
        this.homeFacade.setSelectedLicense(license);
        this.homeFacade.refreshData();
    }

    /**
     * Выход для кнопки выхода
     */
    logout(): void {
        this.homeFacade.logout();
    }

    transformer(node: LicenseNode, level: number) {
        return {
            expandable: !!node.children && node.children.length > 0,
            name: node.name,
            level,
            value: node.value
        };
    }

    treeHasChild(_: number, node: FlatNode): boolean {
        return node.expandable;
    }
}
