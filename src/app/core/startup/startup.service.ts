import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { I18nService } from '../i18n/i18n.service';
import { AuthService } from '@core/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class StartupService {

  constructor(
    private httpClient: HttpClient,
    private i18n: I18nService,
    private translate: TranslateService,
    private auth: AuthService
  ) { }

  load(): Promise<any> {
    return new Promise(resolve => {
      this.httpClient.get(`assets/i18n/${this.i18n.defaultLang}.json`)
      .pipe(
        catchError((langData) => {
          resolve(null);
          return langData;
        }),
      )
      .subscribe(langData => {
        this.translate.setTranslation(this.i18n.defaultLang, langData);
        this.translate.setDefaultLang(this.i18n.defaultLang);
        this.auth.CheckTokenValid();
      },
      () => {},
      () => {
        resolve(null);
      });
    });
  }
}
