import {Routes} from '@angular/router';
import {NotFoundComponent} from "./components/not-found/not-found.component";
import {HomeComponent} from "./components/home/home.component";
import {authGuard} from "./shared/services/user.service";
import {LoginComponent} from "./components/login/login.component";
import {RegistrationComponent} from "./components/registration/registration.component";

const homeChildren: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: []
  }
]

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: "home",
    children: homeChildren,
    canActivate: [authGuard]
  },
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: "registration",
    component: RegistrationComponent
  },
  {
    path: '404',
    component: NotFoundComponent
  },

  {
    path: '**',
    redirectTo: "404"
  }
];
