import { Injectable } from '@angular/core';
import { CacheType } from './cache-type';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class CacheService {

  readonly coldTime = 10 * 60 * 1e3; // 10分钟
  readonly cache = {};
  readonly updateTime = {};

  constructor() { }

  get(type: CacheType) {
    return this.cache[type];
  }

  set(type: CacheType, value: any) {
    this.cache[type] = value;
    this.updateTime[type] = _.now();
  }

  isCold(type: CacheType) {
    // console.log(type);
    const update = this.updateTime[type];
    // return _.isNumber(update) ? (_.now() - update < this.coldTime) : true;
    if (_.isNumber(update)) {
      const now = _.now();
      if (now - update < this.coldTime) {
        return false;
      }
    }
    return true;
  }
}
