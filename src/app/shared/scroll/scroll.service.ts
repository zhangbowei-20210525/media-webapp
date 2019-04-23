import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

// from nz-zorro
// tslint:disable:no-non-null-assertion

export type EasyingFn = (t: number, b: number, c: number, d: number) => number;

function easeInOutCubic(t: number, b: number, c: number, d: number): number {
  const cc = c - b;
  let tt = t / (d / 2);
  if (tt < 1) {
    return (cc / 2) * tt * tt * tt + b;
  } else {
    return (cc / 2) * ((tt -= 2) * tt * tt + 2) + b;
  }
}

@Injectable({
  providedIn: 'root'
})
export class ScrollService {
  /* tslint:disable-next-line:no-any */
  constructor(@Inject(DOCUMENT) private doc: Document) { }

  /** 设置 `el` 滚动条位置 */
  setScrollTop(el: Element | Window, topValue: number = 0): void {
    if (el === window) {
      this.doc.body.scrollTop = topValue;
      this.doc.documentElement!.scrollTop = topValue;
    } else {
      (el as Element).scrollTop = topValue;
    }
  }

  /** 获取 `el` 相对于视窗距离 */
  getOffset(el: Element): { top: number; left: number } {
    const ret = {
      top: 0,
      left: 0
    };
    if (!el || !el.getClientRects().length) {
      return ret;
    }

    const rect = el.getBoundingClientRect();
    if (rect.width || rect.height) {
      const doc = el.ownerDocument!.documentElement;
      ret.top = rect.top - doc!.clientTop;
      ret.left = rect.left - doc!.clientLeft;
    } else {
      ret.top = rect.top;
      ret.left = rect.left;
    }

    return ret;
  }

  /** 获取 `el` 滚动条位置 */
  // TODO: remove '| Window' as the fallback already happens here
  getScroll(el?: Element | Window, top: boolean = true): number {
    const target = el ? el : window;
    const prop = top ? 'pageYOffset' : 'pageXOffset';
    const method = top ? 'scrollTop' : 'scrollLeft';
    const isWindow = target === window;
    // @ts-ignore
    let ret = isWindow ? target[prop] : target[method];
    if (isWindow && typeof ret !== 'number') {
      ret = this.doc.documentElement![method];
    }
    return ret;
  }

  /**
   * 使用动画形式将 `el` 滚动至某位置
   *
   * @param containerEl 容器，默认 `window`
   * @param targetTopValue 滚动至目标 `top` 值，默认：0，相当于顶部
   * @param easing 动作算法，默认：`easeInOutCubic`
   * @param callback 动画结束后回调
   */
  scrollTo(containerEl: Element | Window, targetTopValue: number = 0, easing?: EasyingFn, callback?: () => void): void {
    const target = containerEl ? containerEl : window;
    const scrollTop = this.getScroll(target);
    const startTime = Date.now();
    const frameFunc = () => {
      const timestamp = Date.now();
      const time = timestamp - startTime;
      this.setScrollTop(target, (easing || easeInOutCubic)(time, scrollTop, targetTopValue, 450));
      if (time < 450) {
        requestAnimationFrame(frameFunc);
      } else {
        if (callback) {
          callback();
        }
      }
    };
    requestAnimationFrame(frameFunc);
  }

  /**
   * 使用动画滚动到 `targetEl` 处
   * @param targetEl 滚动位置元素
   * @param offset 偏移量
   * @param easing 动作算法，默认：`easeInOutCubic`
   * @param callback 动画结束后回调
   */
  scrollToElement(targetEl: Element, offset?: number, easing?: EasyingFn, callback?: () => void): void {
    this.scrollTo(
      window,
      targetEl.getBoundingClientRect().top + window.pageYOffset + (typeof offset === 'number' ? offset : 0),
      easing,
      callback);
  }
}
