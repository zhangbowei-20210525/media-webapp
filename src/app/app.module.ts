import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID, APP_INITIALIZER } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// #region 设置默认语言
import { registerLocaleData } from '@angular/common';
import { default as ngLang } from '@angular/common/locales/zh';
import { NZ_I18N, zh_CN as zorroLang } from 'ng-zorro-antd';

const LANG = {
  abbr: 'zh',
  ng: ngLang,
  zorro: zorroLang
};
registerLocaleData(LANG.ng, LANG.abbr);
const LANG_PROVIDES = [
  { provide: LOCALE_ID, useValue: LANG.abbr },
  { provide: NZ_I18N, useValue: LANG.zorro }
];
// #endregion

// #region 加载i18n语言文件
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { I18nService } from './core/i18n/i18n.service';

export function I18nHttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, `assets/i18n/`, '.json');
}

const I18NSERVICE_MODULES = [
  TranslateModule.forRoot({
    loader: {
      provide: TranslateLoader,
      useFactory: I18nHttpLoaderFactory,
      deps: [HttpClient],
    },
  }),
];

const I18NSERVICE_PROVIDES = [
  I18nService
];
// #endregion

// #region Http 拦截器
import { DelonAuthModule, SimpleInterceptor } from '@delon/auth';
import { I18nInterceptor } from '@core/net/i18n.interceptor';
import { DefaultInterceptor } from '@core/net/default.interceptor';

const INTERCEPTOR_PROVIDES = [
  { provide: HTTP_INTERCEPTORS, useClass: SimpleInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: DefaultInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: I18nInterceptor, multi: true }
];
// #endregion

// #region 启动服务
import { StartupService } from './core/startup/startup.service';
export function StartupServiceFactory(
  startupService: StartupService,
): Function {
  return () => startupService.load();
}
const APPINIT_PROVIDES = [
  StartupService,
  {
    provide: APP_INITIALIZER,
    useFactory: StartupServiceFactory,
    deps: [StartupService],
    multi: true,
  },
];
// #endregion

// import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core';
import { SharedModule } from './shared';
// import { LayoutModule } from './layout/layout.module';
import { RoutesModule } from './routes/routes.module';
import { DelonModule } from './delon.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    // AppRoutingModule,
    CoreModule,
    SharedModule,
    // LayoutModule,
    RoutesModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    DelonAuthModule,
    DelonModule.forRoot(),
    ...I18NSERVICE_MODULES,
  ],
  providers: [
    ...LANG_PROVIDES,
    ...INTERCEPTOR_PROVIDES,
    ...I18NSERVICE_PROVIDES,
    ...APPINIT_PROVIDES,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
