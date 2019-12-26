import { Component, OnInit, TemplateRef, Input } from '@angular/core';
// tslint:disable-next-line:max-line-length
import { NzDropdownContextComponent, NzTreeNode, NzDropdownService, NzFormatEmitEvent, NzTreeNodeOptions, NzMessageService } from 'ng-zorro-antd';
import { TeamsService } from '../../teams.service';
import { TreeService } from '@shared';
import { ImportStaffDto } from '../../dtos';

@Component({
  selector: 'app-import-staff',
  templateUrl: './import-staff.component.html',
  styleUrls: ['./import-staff.component.less']
})
export class ImportStaffComponent implements OnInit {

  @Input() hlId: number;

  dropdown: NzDropdownContextComponent;
  // actived node
  activedNode: NzTreeNode;
  nodes: NzTreeNodeOptions[];
  staffKey: string;
  selecteds = [];

  constructor(
    private nzDropdownService: NzDropdownService,
    private service: TeamsService,
    private ts: TreeService,
    private message: NzMessageService,
  ) { }

  ngOnInit() {
    this.service.getStaffs().subscribe(result => {
      this.setStaffNodes(result);
    });
  }

  setStaffNodes(list: ImportStaffDto[]) {
    this.nodes = this.ts.getNzTreeNodes(list, item => ({
      title: item.name,
      key: item.id,
      isLeaf: item.is_leaf,
    }));
    console.log(this.nodes);
  }

  select(key: string) {
    const node = this.ts.recursionNodesMapArray(this.nodes, item => item, item => key === item.key && item.isLeaf === true)[0];
    console.log(node);
    if (this.selecteds.some(s => s.id === node.key) === true) {
      this.message.warning('该员工已添加导入列表');
    } else {
      if (node.isLeaf === true) {
        this.selecteds = [ ...this.selecteds, {
          id: node.key,
          name: node.title
        }];
      }
    }
  }

  deleteSelected(id: string) {
    this.selecteds = this.selecteds.filter(f => f.id !== id);
  }

  contextMenu($event: MouseEvent, template: TemplateRef<void>): void {
    this.dropdown = this.nzDropdownService.create($event, template);
  }

  selectDropdown(): void {
    this.dropdown.close();
    // do something
  }

  submit() {
    const ids = [];
    this.selecteds.forEach(f => {
      ids.push(f.id);
    });
   return this.service.importStaff(this.hlId, ids);
  }
}
