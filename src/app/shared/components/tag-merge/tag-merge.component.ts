import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { CdkDragStart, CdkDragMove, CdkDragEnd } from '@angular/cdk/drag-drop';

declare interface Position { x: number; y: number; }
declare interface TagMergeSturt {
  raw: string;
  real: string;
  count: number;
  over?: boolean;
}

@Component({
  selector: 'app-tag-merge',
  templateUrl: './tag-merge.component.html',
  styles: [`
    .merge-tag {
      position: relative;
      margin: 4px;
    }
  `]
})
export class TagMergeComponent implements OnInit {

  @Input() tags: TagMergeSturt[];

  private _draggingZIndex: string;
  private _draggingMovePosition: Position;

  @ViewChild('tagsParent') tagsParent: ElementRef<HTMLElement>;

  constructor() { }

  ngOnInit() {
  }

  onDragStarted(event: CdkDragStart<any>) {
    this._draggingZIndex = event.source.element.nativeElement.style.zIndex;
    event.source.element.nativeElement.style.zIndex = '9';
  }

  onDragMoved(event: CdkDragMove<any>) {
    this._draggingMovePosition = event.pointerPosition;
  }

  onTagDragEnded(event: CdkDragEnd<any>) {
    const drag = event.source.element.nativeElement;
    const tags = this.tagsParent.nativeElement.querySelectorAll<HTMLElement>('.merge-tag');
    const drop = this.getDropped(drag, tags);
    if (drop) {
      const dragTag = this.tags.find(item => item.raw === drag.dataset['raw']);
      dragTag.over = true; // hidden
      const dropTag = this.tags.find(item => item.raw === drop.dataset['raw']);
      this.setReal(dropTag.raw, dragTag, this.tags);
      let count = 1;
      if (dragTag.count > 0) {
        count += dragTag.count;
      }
      dropTag.count += count;
    }
    drag.style.zIndex = this._draggingZIndex;
    event.source.reset();
  }

  setReal(raw: string, target: { raw: string, real: string }, list: { raw: string, real: string }[]) {
    target.real = raw;
    list.filter(item => item.real === target.raw).forEach(item => this.setReal(raw, item, list));
  }

  inRect(point: Position, rect: DOMRect) {
    if (point.x > rect.x && point.x < rect.x + rect.width) {
      if (point.y > rect.y && point.y < rect.y + rect.height) {
        return true;
      }
    }
    return false;
  }

  getDropped(drag: HTMLElement, elements: NodeListOf<HTMLElement>) {
    // const rect = drag.getBoundingClientRect() as DOMRect;
    const point = this._draggingMovePosition; // { x: rect.x + (rect.width / 2), y: rect.y + (rect.height / 2) };
    for (let i = 0; i < elements.length; i++) {
      const el = elements.item(i);
      if (el.hidden) {
        continue;
      }
      if (el.dataset['raw'] === drag.dataset['raw']) {
        continue;
      }
      const elRect = el.getBoundingClientRect() as DOMRect;
      if (this.inRect(point, elRect)) {
        return el;
      }
    }
    return null;
  }

  reset() {
    this.tags.forEach(item => {
      item.real = item.raw;
      item.over = false;
      item.count = 0;
    });
  }

}
