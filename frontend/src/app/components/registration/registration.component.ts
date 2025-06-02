import {Component} from '@angular/core';
import {AsyncPipe} from "@angular/common";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {TuiButtonModule, TuiErrorModule, TuiTextfieldControllerModule} from "@taiga-ui/core";
import {
  TuiFieldErrorPipeModule,
  TuiInputModule,
  TuiInputMonthModule,
  TuiInputPasswordModule,
  TuiIslandModule
} from "@taiga-ui/kit";
import {UserService} from "../../shared/services/user.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    TuiButtonModule,
    TuiErrorModule,
    TuiFieldErrorPipeModule,
    TuiInputModule,
    TuiInputMonthModule,
    TuiInputPasswordModule,
    TuiIslandModule,
    TuiTextfieldControllerModule
  ],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.less'
})
export class RegistrationComponent {

  constructor(private userService: UserService, private router: Router) {
  }

  registrationForm = new FormGroup({
    login: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  register() {
    this.userService.registerUser(this.registrationForm.value.login as string, this.registrationForm.value.password as string, "/")
  }

  login() {
    this.router.navigate(['/login']).then()
  }
}
