import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private _lang: string;

  constructor() { }

  set(key: string, value: any) {
    localStorage.setItem(key, value);
  }

  get(key: string) {
    return localStorage.getItem(key);
  }

  get lang() {
    return this._lang || this.get('lang');
  }

  set lang(lang: string) {
    this._lang = lang;
    this.set('lang', lang);
  }
}
