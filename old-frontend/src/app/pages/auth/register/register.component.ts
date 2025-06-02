import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FormStateMatcher} from '@shared/state-matchers/form.state-matcher';
import {AuthFacade} from '../shared/services/auth.facade';

/**
 * Компонент для регистрации
 *
 * @author DSalikhov
 * @export
 */
@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.less'],
})
export class RegisterComponent implements OnInit {
    /**
     * Форма регистрации
     */
    registerForm: FormGroup;
    /**
     * Валидатор
     */
    matcher = new FormStateMatcher();

    constructor(
        private formBuilder: FormBuilder,
        public authFacade: AuthFacade
    ) {
    }

    ngOnInit(): void {
        this.registerForm = this.formBuilder.group({
            username: [null, Validators.required],
            password: [null, Validators.required],
        });
    }

    registration(formData: { username: string, password: string }): void {
        this.authFacade.registration(formData.username, formData.password);
    }
}


