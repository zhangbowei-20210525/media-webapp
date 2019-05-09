import { Component, OnInit, Input, ViewChild, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { CdkDragDrop, CdkDragEnd, CdkDragStart, CdkDragMove } from '@angular/cdk/drag-drop';
import { NzTagComponent } from 'ng-zorro-antd';
import * as _ from 'lodash';

@Component({
  selector: 'app-relation-import-field',
  templateUrl: './relation-import-field.component.html',
  styleUrls: ['./relation-import-field.component.less']
})
export class RelationImportFieldComponent implements OnInit {

  @Input() programThemes: { raw: string, real: string, count: number, over?: boolean }[];
  @Input() programTypes: { raw: string, real: string, count: number, over?: boolean }[];

  constructor() { }

  ngOnInit() {
  }

}
