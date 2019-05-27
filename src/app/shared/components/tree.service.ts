import { Injectable } from '@angular/core';
import { NzTreeNode, NzTreeNodeOptions } from 'ng-zorro-antd';

@Injectable({
  providedIn: 'root'
})
export class TreeService {

  constructor() { }

  equalsArrayItems(a: Array<any>, b: Array<any>) {
    if (!a || !b) {
      return false;
    }
    if (a.length !== b.length) {
      return false;
    }
    for (let i = 0, l = a.length; i < l; i++) {
      if (a[i] instanceof Array && b[i] instanceof Array) {
        if (!a[i].equals(b[i])) {
          return false;
        }
      } else if (a[i] !== b[i]) {
        return false;
      }
    }
    return true;
  }

  /**
   * 递归节点
   * @param nodes 节点
   * @param cb 回调
   */
  recursionNodes<T extends { children?: T[] }>(nodes: T[], cb: (node: T) => void) {
    for (const i in nodes) {
      if (nodes.hasOwnProperty(i)) {
        const element = nodes[i];
        cb(element);
        if (element.children && element.children.length > 0) {
          this.recursionNodes(element.children, cb);
        }
      }
    }
  }

  /**
   * 递归节点并从其中找到
   * @param nodes 节点
   * @param selector 条件回调
   */
  recursionNodesFindBy<T extends { children?: T[] }>(nodes: T[], selector: (node: T, index?: any) => boolean): T {
    for (const i in nodes) {
      if (nodes.hasOwnProperty(i)) {
        const element = nodes[i];
        if (selector(element, i)) {
          return element;
        }
        if (element.children && element.children.length > 0) {
          const result = this.recursionNodesFindBy(element.children, selector);
          if (result) {
            return result;
          }
        }
      }
    }
    return null;
  }

  /**
   * 递归节点并映射为平行数组 flattenMapNodes
   * @param nodes 节点
   * @param map 映射回调
   * @param selector 条件回调
   */
  recursionNodesMapArray<T extends { children?: T[] }, TResult>
    (nodes: T[], map: (node: T) => TResult, selector?: (node: T) => boolean): TResult[] {
    const result = [];
    for (const i in nodes) {
      if (nodes.hasOwnProperty(i)) {
        const element = nodes[i];
        if (selector) {
          if (selector(element)) {
            result.push(map(element));
          }
        } else {
          result.push(map(element));
        }
        if (element.children && element.children.length > 0) {
          result.push(...this.recursionNodesMapArray(element.children, map, selector));
        }
      }
    }
    return result;
  }

  /**
   * 递归节点并映射为结构
   * @param nodes 节点
   * @param map 映射回调
   * @param selector 条件回调
   */
  recursionNodesMapNodes<T extends { children?: T[] }, TResult extends { children?: TResult[] }>
    (nodes: T[], map: (node: T) => TResult, selector?: (node: T) => boolean): TResult[] {
    const result: TResult[] = [];
    for (const i in nodes) {
      if (nodes.hasOwnProperty(i)) {
        const element = nodes[i];
        const obj = map(element);
        obj.children = this.recursionNodesMapNodes(element.children, map, selector);
        result.push(obj);
      }
    }
    return result;
  }

  removeNode<T extends { children?: T[] }>(nodes: T[], selector: (node: T, index?: any) => boolean): boolean {
    for (const i in nodes) {
      if (nodes.hasOwnProperty(i)) {
        const element = nodes[i];
        if (selector(element, i)) {
          nodes.splice(i as any, 1);
          return true;
        }
        if (element.children && element.children.length > 0) {
          const result = this.removeNode(element.children, selector);
          if (result) {
            return result;
          }
        }
      }
    }
    return false;
  }

  findInvalidNode(nodes: NzTreeNode[]): NzTreeNode {
    return this.recursionNodesFindBy(nodes, item => {
      return item.isChecked && item.parentNode && !item.parentNode.isChecked;
    });
  }

  getNzTreeNodes<T extends { children?: T[] }>(origins: T[], fn: (obj: T) => NzTreeNodeOptions): NzTreeNodeOptions[] {
    return this.recursionNodesMapNodes(origins, fn);
  }

  getNodeByKey(nodes: NzTreeNode[], key: string): NzTreeNode {
    return this.recursionNodesFindBy(nodes, item => item.key === key);
  }

  getSelectTreeNodeByKey(nodes: NzTreeNode[], key: string[]) {
    nodes.forEach(x => {
      key.forEach(k => {
        if (x.key === k) {
          x.isDisabled = false;
        } else {
          x.isDisabled = true;
        }
      });
    });
  }

  getKeysWithStatus<T extends { status: boolean, children: T[] }>(origins: T[], keyMap: (obj: T) => string) {
    return this.recursionNodesMapArray(origins, keyMap, item => item.status);
  }

  setCheckedByKeys(nodes: NzTreeNode[], keys: string[]) {
    this.recursionNodes(nodes, item => {
      item.isChecked = !!keys.find(e => e === item.key);
    });
  }

  setDisableCheckbox(nodes: NzTreeNode[], disable: boolean) {
    this.recursionNodes(nodes, item => {
      item.isDisableCheckbox = disable;
    });
  }
}
