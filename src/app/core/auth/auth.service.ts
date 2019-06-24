import { Injectable, Inject } from '@angular/core';
import { DA_SERVICE_TOKEN, ITokenService, SimpleTokenModel, ITokenModel } from '@delon/auth';
import { Subject, Observable } from 'rxjs';
import { TokenModel } from './token';
import { SettingsService } from '@core/settings/settings.service';
import { NotifiesPolling } from '@core/notifies';
import { User } from '@core/settings/interface';
import { map } from 'rxjs/operators';

interface LoginData {
    userInfo: any;
    token: string;
    permissions: string[];
  }

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    state$: Observable<boolean>;

    constructor(
        @Inject(DA_SERVICE_TOKEN) private its: ITokenService,
        private settings: SettingsService,
        private ntf: NotifiesPolling
    ) {
        this.state$ = its.change().pipe(map(t => this.checkToken(t)));
    }

    get isLoggedIn() {
        return this.checkToken(this.token);
    }

    get token() {
        return this.its.get();
    }

    private checkToken(model: SimpleTokenModel) {
        return model != null && typeof model.token === 'string' && model.token.length > 0;
    }

    // login(token: TokenModel, user: User, permissions: string[]) {
    //     this.its.set(token);
    //     this.settings.user = user;
    //     this.settings.permissions = permissions;
    //     this.ntf.startNotifiesPolling();
    // }

    onLogin(data: LoginData) {
        this.its.set({
            token: data.token,
            time: +new Date
        });
        this.settings.user = data.userInfo;
        this.settings.permissions = data.permissions;
        this.ntf.startNotifiesPolling();
    }

    onLogout() {
        this.ntf.stopNotifiesPolling();
        this.its.clear();
        this.settings.user = null;
        this.settings.permissions = null;
    }
}
