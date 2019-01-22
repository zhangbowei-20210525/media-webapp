// import { Injectable, Inject } from '@angular/core';
// import { DA_SERVICE_TOKEN, ITokenService, SimpleTokenModel } from '@delon/auth';
// import { Subject } from 'rxjs';
// import { TokenModel } from './token';

// const TERM = 1000000;

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {

//   private _notify$ = new Subject<boolean>();
//   private _isLoggedIn: boolean;

//   constructor(
//     @Inject(DA_SERVICE_TOKEN) private token: ITokenService
//   ) {
//     this.token.change().subscribe(t => {
//       if (t) {
//         this.isLoggedIn = true;
//       } else {
//         if (!this.checkToken()) { // 忽略初始值
//           this.isLoggedIn = false;
//         }
//       }
//     });
//   }

//   private checkSimple(model: SimpleTokenModel): boolean {
//     return model != null && typeof model.token === 'string' && model.token.length > 0;
//   }

//   private checkToken(): boolean {
//     return this.checkSimple(this.token.get());
//   }

//   CheckTokenValid() {
//     const tk = this.token.get() as TokenModel;
//     this._isLoggedIn = this.checkSimple(tk);
//     if (this._isLoggedIn) {
//       if (tk.time + TERM < +new Date) {
//         this._isLoggedIn = false;
//         this.token.clear();
//       }
//     }
//   }

//   get notify() {
//     return this._notify$.asObservable();
//   }

//   get isLoggedIn() {
//     if (this._isLoggedIn === undefined) {
//       this._isLoggedIn = this.checkToken();
//     }
//     return this._isLoggedIn;
//   }

//   set isLoggedIn(value: boolean) {
//     this._isLoggedIn = value;
//     this._notify$.next(value);
//   }

//   setLogin(token: TokenModel) {
//     this.token.set(token);
//   }

//   setLogout() {
//     this.token.clear();
//   }
// }
