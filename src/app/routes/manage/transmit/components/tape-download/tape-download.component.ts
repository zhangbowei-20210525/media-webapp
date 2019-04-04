import { Component, OnInit, Input } from '@angular/core';
import { SeriesService } from 'app/routes/manage/series/series.service';
import { TransmitService } from '../../transmit.service';
import { PaginationDto } from '@shared';

@Component({
  selector: 'app-tape-download',
  templateUrl: './tape-download.component.html',
  styleUrls: ['./tape-download.component.less']
})
export class TapeDownloadComponent implements OnInit {

  @Input() purchaseTapeId: number;
  sources: { id: number, source_name: string }[];
  sourceCheckOptions: { value: number, checked: boolean }[];
  allChecked: boolean;
  indeterminate: boolean;
  isDownloaded: boolean;
  checkeds = 0;
  tapeFilePagination: PaginationDto;
  tapeDownloadInfo: any;

  constructor(
    private transmitService: TransmitService,
    private seriesService: SeriesService,
  ) { }

  ngOnInit() {
    this.transmitService.tapeDownloadInfo(this.purchaseTapeId).subscribe(res => {
      this.tapeDownloadInfo = res;
    });
    this.transmitService.tapeFileList(this.purchaseTapeId).subscribe(res => {
        this.indeterminate = true;
        this.sources = res.list;
        console.log(res.list);
        const b =[];
        const aa = res.list.forEach(x =>b.push(x.id));
        console.log(b);
        this.sourceCheckOptions = this.selectArray(b, e => Object.create({ value: e, checked: false }));
        this.allChecked = true;
        this.updateAllChecked(); // 默认全选
      });
  }

  getCheckSourceIdList(): number[] {
    this.isDownloaded = true;
    return this.selectArray(this.sourceCheckOptions.filter(e => e.checked), e => e.value);
  }

  selectArray<T, R>(arr: T[], project: (value: T) => R) {
    const result: R[] = [];
    for (const key in arr) {
      if (arr.hasOwnProperty(key)) {
        result.push(project(arr[key]));
      }
    }
    return result;
  }

  clickCheck(index: number) {
    this.sourceCheckOptions[index].checked = !this.sourceCheckOptions[index].checked;
    this.updateSingleChecked();
  }

  updateSingleChecked() {
    if (this.sourceCheckOptions.every(item => item.checked === false)) {
      this.allChecked = false;
      this.indeterminate = false;
    } else if (this.sourceCheckOptions.every(item => item.checked === true)) {
      this.allChecked = true;
      this.indeterminate = false;
    } else {
      this.indeterminate = true;
    }
    this.pushCheckeds();
  }

  updateAllChecked() {
    this.indeterminate = false;
    if (this.allChecked) {
      this.sourceCheckOptions.forEach(item => item.checked = true);
    } else {
      this.sourceCheckOptions.forEach(item => item.checked = false);
    }
    this.pushCheckeds();
  }

  pushCheckeds() {
    this.checkeds = this.sourceCheckOptions.filter(e => e.checked).length;
  }

}
