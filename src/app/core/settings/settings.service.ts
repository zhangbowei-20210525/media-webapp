import { Injectable } from '@angular/core';
import { User, SettingsNotify } from './interface';
import { Subject, Observable } from 'rxjs';

export const LANG = '_lang';

export const USER = '_user';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private _notify$ = new Subject<SettingsNotify>();
  private _lang: string;
  private _user: User;

  constructor() { }

  private set(key: string, value: any) {
    localStorage.setItem(key, key === LANG ? value : JSON.stringify(value));
  }

  private get(key: string) {
    return key === LANG
    ? localStorage.getItem(key) || null
    : JSON.parse(localStorage.getItem(key) || 'null') || null;
  }

  get notify(): Observable<SettingsNotify> {
    return this._notify$.asObservable();
  }

  get lang(): string {
    if (!this._lang) {
      this._lang = this.get(LANG);
    }
    return this._lang;
  }

  set lang(value: string) {
    this._lang = value;
    this.set(LANG, value);
    this._notify$.next({ type: 'lang', value });
  }

  get user(): User {
    if (!this._user) {
      this._user = { ...this.get(USER) };
      this.set(USER, this._user);
    }
    return this._user;
  }

  set user(value: User) {
    this._user = value;
    this.set(USER, value);
    this._notify$.next({ type: 'user', value });
  }
}
