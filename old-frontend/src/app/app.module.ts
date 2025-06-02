import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {MaterialFileInputModule} from 'ngx-material-file-input';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {ErrorModalComponent} from '@components/modals/error-modal/error-modal.component';
import {HttpErrorInterceptor} from '@shared/interceptor/http-error-interceptor.service';
import {AuthService} from '@shared/service/auth/auth.service';
import {AngularMaterialModule} from './angular-material/angular-material.module';
import {AuthModule} from '@pages/auth/auth.module';
import {AuthStore} from '@shared/store/auth.store';
import {tap} from 'rxjs/operators';
import {HomeModule} from '@pages/home/home.module';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {PerfectScrollbarModule} from "ngx-perfect-scrollbar";
import {ConfirmationModalComponent} from "@components/modals/confirmation-modal/confirmation-modal.component";
import {NgIdleModule} from "@ng-idle/core"
import {APP_BASE_HREF} from "@angular/common";

@NgModule({
    declarations: [
        AppComponent,

        ErrorModalComponent,
        ConfirmationModalComponent
    ],
    imports: [
        NgbModule,
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        NgIdleModule.forRoot(),

        HomeModule,
        AuthModule,
        AngularMaterialModule,

        MaterialFileInputModule,
        PerfectScrollbarModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (http: HttpClient): TranslateLoader =>
                    new TranslateHttpLoader(http, './locale/', '.json'),
                deps: [HttpClient]
            },
            useDefaultLang: false,
        })
    ],
    providers: [
        {provide: APP_BASE_HREF, useValue: '/old/'},
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpErrorInterceptor,
            multi: true,
        },
        {
            provide: APP_INITIALIZER,
            useFactory: (authService: AuthService, authStore: AuthStore) => () => {
                return authService.updateUserStatus().pipe(
                    tap((user) => {
                        authStore.setCurrentUser(user);
                    })
                ).toPromise();
            },
            deps: [AuthService, AuthStore],
            multi: true
        }
    ],
    bootstrap: [AppComponent],
})
export class AppModule {
}
