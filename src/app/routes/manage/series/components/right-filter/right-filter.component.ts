import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CopyrightsService } from '../../copyrights/copyrights.service';
import { RootTemplateDto } from '../../copyrights/dtos';
import { TreeService } from '@shared';
import { NzTreeNodeOptions } from 'ng-zorro-antd';

// 暂未使用

@Component({
  selector: 'app-right-filter',
  templateUrl: './right-filter.component.html',
  styleUrls: ['./right-filter.component.less']
})
export class RightFilterComponent implements OnInit {

  filtrateForm: FormGroup;
  areaOptions = [];
  rightOptions = [];

  constructor(
    private fb: FormBuilder,
    private service: CopyrightsService,
    private ts: TreeService
  ) { }

  ngOnInit() {
    this.filtrateForm = this.fb.group({
      days: [null],
      right: [[null]],
      area: [[null]],
      date: [null],
      is_salable: [false],
      sole: [false],
      investment_type: [null],
      program_type: [null]
    });
    this.fetchAreaOptions();
    this.fetchRightsOptions();
  }

  getStatisticsSelectArea(origins: RootTemplateDto[]): NzTreeNodeOptions[] {
    return this.ts.getNzTreeNodes(origins, item => ({
      title: item.name,
      key: item.code,
      isLeaf: !!item.children && item.children.length < 1,
      selectable: true,
      expanded: true,
      disableCheckbox: false,
      checked: false,
      disabled: item.disabled
    }));
  }

  fetchAreaOptions() {
    this.service.getCopyrightAreaOptions().subscribe(result => {
      // if (result) {
      //   result = [{ code: 'all', name: '所有' }, ...result];
      //   this.service.setLeafNode(result);
      // }
      this.areaOptions = this.getStatisticsSelectArea(result);
    });
  }

  fetchRightsOptions() {
    this.service.getCopyrightTemplates().subscribe(result => {
      if (result) {
        result = [{ code: null, name: '所有' }, ...result];
        this.service.setLeafNode(result);
      }
      this.rightOptions = result;
    });
  }

  onFormValueChange() {

  }

}
