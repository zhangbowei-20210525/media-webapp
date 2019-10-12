import { Directive, Input, OnDestroy, ElementRef } from '@angular/core';
import { SettingsService } from '@core';
import { filter } from 'rxjs/operators';
import { User } from '@core/settings/interface';
import { Subscription } from 'rxjs';

const hideClassName = 'vip__hide';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[app-vip]'
})
export class VipDirective implements OnDestroy {

  private _vipLeast: number;
  private _user: User;
  private _userSubscription: Subscription;

  constructor(
    private settings: SettingsService,
    private el: ElementRef<HTMLElement>
  ) {
    this._user = settings.user;
    this.settings.notify.pipe(filter(setting => setting.type === 'user')).subscribe(setting => {
      this._user = setting.value as User;
      this.setElement(this._vipLeast, this._user.vip_level);
    });
  }

  @Input('app-vip') set vipLeast(vip: number) {
    this._vipLeast = vip;
    this.setElement(vip, this._user.vip_level);
  }

  setElement(least: number, current: number) {
    const elClassList = this.el.nativeElement.classList;
    if (least > current) {
      if (!elClassList.contains(hideClassName)) { elClassList.add(hideClassName); }
    } else {
      if (elClassList.contains(hideClassName)) { elClassList.remove(hideClassName); }
    }
  }

  ngOnDestroy(): void {
    if (this._userSubscription) {
      this._userSubscription.unsubscribe();
    }
  }

}
