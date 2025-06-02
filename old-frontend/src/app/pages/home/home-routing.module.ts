import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LicensesComponent} from './licenses/licenses.component';
import {HomeComponent} from './home.component';

const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        children: [
            {
                path: 'licenses',
                component: LicensesComponent,
            },
            {
                path: '',
                redirectTo: 'licenses',
                pathMatch: 'full'
            },
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class HomeRoutingModule {
}
