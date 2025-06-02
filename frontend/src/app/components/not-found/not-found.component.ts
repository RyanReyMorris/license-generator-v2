import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {TuiBlockStatusModule} from "@taiga-ui/layout";
import {TuiBreakpointService, TuiButtonModule, TuiSizeL} from "@taiga-ui/core";
import {map, Observable} from "rxjs";
import {AsyncPipe, NgIf} from "@angular/common";
import {Router} from "@angular/router";

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [
    TuiBlockStatusModule,
    AsyncPipe,
    TuiButtonModule,
    NgIf
  ],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundComponent {

  constructor(@Inject(TuiBreakpointService) readonly breakpointService: TuiBreakpointService, private router: Router) {
    console.log("не найден")
  }

  size$: Observable<TuiSizeL> = this.breakpointService.pipe(
    map(key => (key === 'mobile' ? 'm' : 'l')),
  );

  goHome(){
    this.router.navigate([""]); // переход на корень приложения
  }

}
