import {Component} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {UserService} from "../../shared/services/user.service";
import {
  TuiActionModule,
  TuiFieldErrorPipeModule,
  TuiInputDateModule,
  TuiInputFilesModule,
  TuiInputModule,
  TuiInputPasswordModule,
  TuiIslandModule
} from "@taiga-ui/kit";
import {TuiButtonModule, TuiErrorModule, TuiTextfieldControllerModule} from "@taiga-ui/core";
import {AsyncPipe, NgIf} from "@angular/common";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    TuiIslandModule,
    TuiActionModule,
    TuiButtonModule,
    AsyncPipe,
    FormsModule,
    NgIf,
    ReactiveFormsModule,
    TuiErrorModule,
    TuiFieldErrorPipeModule,
    TuiInputDateModule,
    TuiInputFilesModule,
    TuiTextfieldControllerModule,
    TuiInputModule,
    TuiInputPasswordModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.less'
})
export class LoginComponent {

  private returnUrl: string;

  constructor(private userService: UserService, private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation) {
      const state = navigation.extras.state as { returnUrl: string };
      this.returnUrl = state != null ? state.returnUrl : '/';
    } else {
      this.returnUrl = '/';
    }
  }

  loginForm = new FormGroup({
    login: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  login() {
    this.userService.logInUser(this.loginForm.value.login as string, this.loginForm.value.password as string, this.returnUrl)
  }

  registration() {
    this.router.navigate(['/registration']).then()
  }
}
