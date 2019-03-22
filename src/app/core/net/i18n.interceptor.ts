import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { I18nService } from '..';

@Injectable()
export class I18nInterceptor implements HttpInterceptor {

    constructor(private i18n: I18nService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (!req.params.has('_allow_no_language')) {
            const obj = {};
            obj['lang'] = this.i18n.currentLang; // this.settings.lang || ''; // 出现 null 值将导致错误
            req = req.clone({
                setHeaders: obj
            });
        }
        return next.handle(req);
    }

}
