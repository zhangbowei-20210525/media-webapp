import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse,
  HttpSentEvent,
  HttpHeaderResponse,
  HttpProgressEvent,
  HttpResponse,
  HttpUserEvent,
} from '@angular/common/http';
import { Observable, of, throwError, merge } from 'rxjs';
import { mergeMap, catchError } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd';
// import { _HttpClient } from '@delon/theme';
import { environment } from '@env/environment';
import { ITokenService, DA_SERVICE_TOKEN } from '@delon/auth';

/**
 * 默认HTTP拦截器，其注册细节见 `app.module.ts`
 */
@Injectable()
export class DefaultInterceptor implements HttpInterceptor {
  constructor(private injector: Injector) { }

  get msg(): NzMessageService {
    return this.injector.get(NzMessageService);
  }

  get token(): ITokenService {
    return this.injector.get(DA_SERVICE_TOKEN);
  }

  private goTo(url: string) {
    setTimeout(() => this.injector.get(Router).navigateByUrl(url));
  }

  private errorNotify(message: string) {
    this.msg.error(message);
  }

  private handleData(
    event: HttpResponse<any> | HttpErrorResponse,
  ): Observable<any> {
    // 可能会因为 `throw` 导出无法执行 `_HttpClient` 的 `end()` 操作
    // this.injector.get(_HttpClient).end();
    // 业务处理：一些通用操作
    switch (event.status) {
      case 200:
        // 业务层级错误处理，以下是假定restful有一套统一输出格式（指不管成功与否都有相应的数据格式）情况下进行处理
        // 例如响应内容：
        //  错误内容：{ status: 1, msg: '非法参数' }
        //  正确内容：{ status: 0, response: {  } }
        // 则以下代码片断可直接适用
        if (event instanceof HttpResponse) {
          const body: any = event.body;
          if (body && body.code !== 0) {
            if (body.code === 10101) { // 11001
              if (body.message) {
                this.errorNotify(body.message);
              }
              this.token.clear(); // 清除登录状态
              this.goTo('/passport/login'); // 回到主页
            } else {
              this.errorNotify(body.message);
            }
            // 继续抛出错误中断后续所有 Pipe、subscribe 操作，因此：
            // this.http.get('/').subscribe() 并不会触发
            // return throwError({ message: body.message, handled: true });
            throw { message: body.message, handled: true };
          } else {
            // 重新修改 `body` 内容为 `response` 内容，对于绝大多数场景已经无须再关心业务状态码
            return of(new HttpResponse(Object.assign(event, { body: body.data })));
            // 或者依然保持完整的格式
            // return of(event);
          }
        }
        break;
      case 401: // 未登录状态码
        this.goTo('/passport/login');
        break;
      case 403:
      case 404:
        this.errorNotify('请求不存在');
        return throwError(event);
        break;
      case 500:
        // this.goTo(`/${event.status}`);
        this.errorNotify('服务端错误');
        return throwError(event);
        break;
      case 504:
        this.errorNotify('网络请求失败');
        return throwError(event);
        break;
      // case 403:
      // case 404:
      // case 500:
      //     // this.goTo(`/${event.status}`);
      //     return of(event);
      //     break;
      default:
        if (event instanceof HttpErrorResponse) {
          console.warn(
            '未可知错误，大部分是由于后端不支持CORS或无效配置引起',
            event,
          );
          this.errorNotify(event.message);
        }
        break;
    }
    return of(event);
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<
    | HttpSentEvent
    | HttpHeaderResponse
    | HttpProgressEvent
    | HttpResponse<any>
    | HttpUserEvent<any>
  > {
    // 所有以 /api 开头的请求，包括是否包含基路径（域名）的情况
    if (req.url.startsWith('/api') || req.url.replace(/^(http|https):\/\/[^/]+/, '').startsWith('/api')) {
      return next.handle(req).pipe(
        catchError((err: HttpErrorResponse) => this.handleData(err)), // 如需将错误往下传递则在handle函数中throw一个新的错误
        mergeMap((event: any) => {
          // 允许统一对请求错误处理，这是因为一个请求若是业务上错误的情况下其HTTP请求的状态是200的情况下需要
          if (event instanceof HttpResponse && event.status === 200) {
            return this.handleData(event);
          }
          // 若一切都正常，则后续操作
          return of(event);
        }),
      );
    } else {
      return next.handle(req);
    }
  }
}
