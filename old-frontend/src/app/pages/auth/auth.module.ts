import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthComponent} from './auth.component';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {AuthRoutingModule} from './auth-routing.module';
import {AngularMaterialModule} from '../../angular-material/angular-material.module';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
    declarations: [
        AuthComponent,
        LoginComponent,
        RegisterComponent,
    ],
    imports: [
        CommonModule,
        AuthRoutingModule,
        AngularMaterialModule,
        ReactiveFormsModule,
    ]
})
export class AuthModule {
}
