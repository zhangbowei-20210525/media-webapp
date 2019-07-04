import { Injectable } from '@angular/core';
import { UserInfoDto } from '@shared/dtos';
import { AuthService } from '@core/auth';

interface State {
  userInfo: UserInfoDto;
  token: string;
}

declare type storeKey = 'stateUserInfo' | 'stateToken';

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
      localStorage.setItem(key, JSON.stringify(content));
    }
  }

  private get(key: storeKey) {
    return JSON.parse(localStorage.getItem(key));
  }

  private clear(key: storeKey) {
    localStorage.removeItem(key);
  }

  setState(state: State) {
    this.userInfo = state.userInfo;
    this.token = state.token;
    this.set('stateUserInfo', this.userInfo);
    this.set('stateToken', this.token);
  }

  getState() {
    if (!this.userInfo) {
      this.userInfo = this.get('stateUserInfo') || this.userInfo;
    }
    if (!this.token) {
      this.token = this.get('stateToken') || this.token;
    }
    return { userInfo: this.userInfo, token: this.token };
  }

  clearState() {
    this.userInfo = null;
    this.token = null;
    this.clear('stateUserInfo');
    this.clear('stateToken');
  }

  setDirectionUrl(url: string) {
    this.directionUrl = url;
  }

  getDirectionUrl() {
    const url = this.directionUrl;
    this.directionUrl = null;
    return url;
  }
}
