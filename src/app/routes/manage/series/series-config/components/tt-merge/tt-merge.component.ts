import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { SeriesService } from '../../../series.service';
import * as _ from 'lodash';
import { CdkDragStart, CdkDragMove, CdkDragEnd } from '@angular/cdk/drag-drop';
import { NzModalService } from 'ng-zorro-antd';

declare interface Position { x: number; y: number; }
declare interface TagMergeSturt {
  id: number;
  raw: string;
  deletable: boolean;
  is_default: boolean;
}

@Component({
  selector: 'app-tt-merge',
  templateUrl: './tt-merge.component.html',
  styles: [`
    .merge-tag {
      position: relative;
      margin: 5px;
    }
    .editable-tag {
      background: rgb(255, 255, 255);
      border-style: dashed;
    }
  `]
})
export class TtMergeComponent implements OnInit {

  @Input() tags: TagMergeSturt[];
  oldTags: TagMergeSturt[];

  @ViewChild('inputElement') inputElement: ElementRef;

  private _draggingZIndex: string;
  private _draggingMovePosition: Position;
  inputVisible = false;
  inputValue = '';

  @ViewChild('tagsParent') tagsParent: ElementRef<HTMLElement>;

  constructor(
    private service: SeriesService,
    private modal: NzModalService,
  ) { }

  ngOnInit() {
    this.oldTags = _.cloneDeep(this.tags);
  }

  refresh() {
    this.service.getTypes('themes').subscribe(result => {
      this.tags = [];
      result.forEach(f => {
        this.tags.push({
          id: f.id,
          raw: f.field_value,
          deletable: f.deletable,
          is_default: f.is_default,
        });
      });
    });
  }

  handleClose(event, info: any): void {
    event.preventDefault();
    event.stopPropagation();
    this.modal.confirm({
      nzTitle: '是否删除以下题材?',
      nzContent: `${info.raw}`,
      nzOkText: '删除',
      nzCancelText: '我再想想',
      nzOkType: 'danger',
      nzOnOk: () => this.service.deleteType('themes', info.id).subscribe(result => {
        this.refresh();
      }),
      // nzOnCancel: () => this.refresh()
    });
  }

  showInput(): void {
    this.inputVisible = true;
    setTimeout(() => {
      this.inputElement.nativeElement.focus();
    }, 10);
    this.inputValue = '';
  }

  handleInputConfirm(): void {
    if (this.tags.every(f => f.raw !== this.inputValue)) {
      this.service.addType('themes', this.inputValue).subscribe(result => {
        this.refresh();
      });
    }
    this.inputVisible = false;
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
      const dropTag = this.tags.find(item => item.raw === drop.dataset['raw']);
      this.modal.confirm({
        nzTitle: '是否合并下列题材',
        nzContent: `把“${dragTag.raw}”合并到“${dropTag.raw}”(保留“${dropTag.raw}”)。`,
        nzOkText: '合并',
        nzCancelText: '我再想想',
        nzOnOk: () => this.mergeAgreed(dragTag, dropTag)
      });
    }
    drag.style.zIndex = this._draggingZIndex;
    event.source.reset();
  }

  mergeAgreed(a: any, b: any) {
    this.service.typeMerge('themes', a.id, b.raw).subscribe(result => {
      this.refresh();
    });
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

}
