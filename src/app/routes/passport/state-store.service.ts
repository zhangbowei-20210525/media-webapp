import { Injectable } from '@angular/core';
import { UserInfoDto } from '@shared/dtos';
import { AuthService } from '@core/auth';

interface State {
  userInfo: UserInfoDto;
  token: string;
}

declare type storeKey = 'userInfo' | 'token' | 'directionUrl';

@Injectable({
  providedIn: 'root'
})
export class StateStoreService {

  private userInfo: UserInfoDto;
  private token: string;

  private directionUrl: string;

  constructor() { }

  private set(key: storeKey, content: any) {
    if (content != null && content !== undefined) {
      localStorage.setItem('STATE_' + key, JSON.stringify(content));
    }
  }

  private get(key: storeKey) {
    return JSON.parse(localStorage.getItem('STATE_' + key));
  }

  private clear(key: storeKey) {
    localStorage.removeItem('STATE_' + key);
  }

  setState(state: State) {
    this.set('userInfo', this.userInfo = state.userInfo);
    this.set('token', this.token = state.token);
  }

  getState() {
    if (!this.userInfo) {
      this.userInfo = this.get('userInfo') || this.userInfo;
    }
    if (!this.token) {
      this.token = this.get('token') || this.token;
    }
    return { userInfo: this.userInfo, token: this.token };
  }

  clearState() {
    this.userInfo = null;
    this.token = null;
    this.directionUrl = null;
    this.clear('userInfo');
    this.clear('token');
    this.clear('directionUrl');
  }

  setDirectionUrl(url: string) {
    this.set('directionUrl', this.directionUrl = url);
  }

  getDirectionUrl() {
    const url = this.directionUrl || this.get('directionUrl');
    this.directionUrl = null;
    this.clear('directionUrl');
    return url;
  }
}
