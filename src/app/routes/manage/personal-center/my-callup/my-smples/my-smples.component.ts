import { PaginationDto, MessageService } from '@shared';
import { Component, OnInit } from '@angular/core';
import { PersonalCenterService } from '../../personal-center.service';
import { finalize } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-my-smples',
  templateUrl: './my-smples.component.html',
  styleUrls: ['./my-smples.component.less']
})
export class MySmplesComponent implements OnInit {



  isLoaded: boolean;
  isLoading: boolean;
  pagination = { page: 1, count: 10, page_size: 5 } as PaginationDto;
  list = [];
  id: number;

  constructor(
    private pcs: PersonalCenterService,
    private message: MessageService,
    private router: Router,

  ) { }

  ngOnInit() {
    console.log(1111);
    this.getDataList();
    // this.pcs.getBrowseRecord(this.pagination).subscribe(res => {
    //   console.log(res);
    // });
  }

  getPageChange(page) {
    console.log(11111);
    // you should print page
    console.log(page);
    this.pagination.page = page;
    this.getDataList();
  }

  getDataList() {
    this.isLoaded = false;
    this.isLoading = true;
    this.pcs.getShareRecord(this.pagination).pipe(finalize(() => {
      this.isLoading = false;
      this.isLoaded = true;
    })).subscribe(res => {
      console.log(res);
      this.list = res.list;
      this.pagination = res.pagination;
      this.id = res.id;
    });
  }
  // copy
    // 复制
    copy(data) {
      const input = document.getElementById('url') as HTMLInputElement;
      console.log(input);
      // 选中文本
      input.select();
      // input.onselect()
      // 执行浏览器复制命令
      document.execCommand('copy');
      this.message.success('复制成功');
    }
    linkChange(data) {
      console.log(data);
    }
    goSolicitation(data) {
      console.log(data);
    }
    goSampleDetails(id: number) {
      this.router.navigate([`/manage/account-center/my-callup/samples-deails/${id}`]);
    }
}

