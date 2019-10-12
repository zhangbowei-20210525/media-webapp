import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IpManagementService } from '../ip-management.service';
import { MessageService } from '@shared';
import { TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-ip-details',
  templateUrl: './ip-details.component.html',
  styleUrls: ['./ip-details.component.less']
})
export class IpDetailsComponent implements OnInit {

  id: number;
  ipInfo: any;

  isOwnLoaded = false;
  isPublishLoaded = false;
  isPublishLoading: boolean;
  ownDataSet: any;
  pubDataSet = [];
  allDataSet = [];
  ipId: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: IpManagementService,
    private message: MessageService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.id = +params.get('id');
    });
    this.getIpInfo();
  }

  getIpInfo() {
    this.service.getIpInfo(this.id).subscribe(result => {
      this.ipId = result.id;
      this.ipInfo = result;
    });
  }
}
