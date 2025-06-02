import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FormStateMatcher} from '@shared/state-matchers/form.state-matcher';
import {AuthFacade} from '../shared/services/auth.facade';

/**
 * Компонент логина
 *
 * @author DSalikhov
 * @export
 */
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.less'],
})
export class LoginComponent implements OnInit {
    /**
     * Форма логина
     */
    loginForm: FormGroup;
    /**
     * Валидатор
     */
    matcher = new FormStateMatcher();

    constructor(private formBuilder: FormBuilder, public authFacade: AuthFacade) {
    }

    ngOnInit(): void {
        this.loginForm = this.formBuilder.group({
            username: [null, Validators.required],
            password: [null, Validators.required],
        });
    }

    login(formData: { username: string, password: string }): void {
        this.authFacade.login(formData.username, formData.password);
    }
}
