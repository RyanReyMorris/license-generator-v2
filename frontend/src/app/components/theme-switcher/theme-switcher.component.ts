import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {AbstractTuiThemeSwitcher} from "@taiga-ui/cdk";

@Component({
  "selector": 'theme-switcher',
  "standalone": true,
  "imports": [],
  "template": '',
  "styleUrl": './theme-switcher.component.less',
  "encapsulation": ViewEncapsulation.None,
  "changeDetection": ChangeDetectionStrategy.OnPush,
})
export class ThemeSwitcherComponent extends AbstractTuiThemeSwitcher {
  // Компонент-заглушка. Используется для смены темы.
  // При смене темы все цвета приложения меняются согласно theme-switcher.component.less
  // Доделать в будущем при необходимости смены тем
}
