import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { SeriesService } from '../series.service';
import * as _ from 'lodash';
import { NzModalService } from 'ng-zorro-antd';
import { CdkDragStart, CdkDragMove, CdkDragEnd } from '@angular/cdk/drag-drop';

declare interface Position { x: number; y: number; }
declare interface TagMergeSturt {
  id: number;
  raw: string;
}

@Component({
  selector: 'app-series-config',
  templateUrl: './series-config.component.html',
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
export class SeriesConfigComponent implements OnInit {

  active1 = true;
  active2 = true;
  active3 = true;
  active4 = true;

  programTypes = [
    { raw: '电视剧', real: '电视剧', count: 0, over: false },
    { raw: '电影', real: '电影', count: 0, over: false },
    { raw: '动画片', real: '动画片', count: 0, over: false },
  ];

  seriesTypes = [];
  investmentTypes = [];
  themes = [];

  type: string;
  options = [];

  @Input() tags: TagMergeSturt[];
  @ViewChild('tagsParent') tagsParent: ElementRef<HTMLElement>;
  @ViewChild('inputElement') inputElement: ElementRef;

  // oldTags: TagMergeSturt[];
  private _draggingZIndex: string;
  private _draggingMovePosition: Position;

  constructor(
    private router: Router,
    private service: SeriesService,
    private modal: NzModalService,
  ) { }

  ngOnInit() {
    this.wordsMerge();
    // this.oldTags = _.cloneDeep(this.tags);
  }

  wordsMerge() {
    this.service.getTypes('program_types').subscribe(result => {
      result.forEach(f => {
        this.seriesTypes.push({
          id: f.id,
          raw: f.field_value,
          deletable: f.deletable,
          is_default: f.is_default,
        });
      });
      console.log(this.seriesTypes);
    });
    this.service.getTypes('investment_types').subscribe(result => {
      result.forEach(f => {
        this.investmentTypes.push({
          id: f.id,
          raw: f.field_value,
          deletable: f.deletable,
          is_default: f.is_default,
        });
      });
      console.log(this.seriesTypes);
    });
    this.service.getTypes('themes').subscribe(result => {
      result.forEach(f => {
        this.themes.push({
          id: f.id,
          raw: f.field_value,
          deletable: f.deletable,
          is_default: f.is_default,
        });
      });
      console.log(this.seriesTypes);
    });
  }

  seriesMerge() {
    this.service.getSeriesType().subscribe(result => {
      this.options = result.program_type_choices;
      this.type = this.options[0];
      this.service.getSeriesInfoList(this.type).subscribe(res => {
        this.tags = [];
        res.list.forEach(f => {
          this.tags.push({
            id: f.id,
            raw: f.name + '/' + f.program_type + '/' + f.episode + '集'
          });
        });
        console.log(this.tags);
      });
    });
  }

  tabIndexChange(event) {
    if (event === 0) {
      this.wordsMerge();
    }
    if (event === 1) {
      this.seriesMerge();
    }
  }

  typeOnChange() {
    this.service.getSeriesInfoList(this.type).subscribe(res => {
      this.tags = [];
      res.list.forEach(f => {
        this.tags.push({
          id: f.id,
          raw: f.name + '/' + f.program_type + '/' + f.episode + '集'
        });
      });
      console.log(this.tags);
    });
  }

  goBack() {
    this.router.navigate([`/manage/series`]);
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
        nzTitle: '是否合并下列节目',
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
    this.service.seriesMerge(a.id, b.id).subscribe(result => {
      this.seriesMerge();
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
