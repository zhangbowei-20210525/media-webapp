import { Component, OnInit } from '@angular/core';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { AddTheatreComponent } from './components/add-theatre/add-theatre.component';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ChoreographyService } from './choreography.service';
import { ACLAbility } from '@core/acl';

@Component({
  selector: 'app-choreography',
  templateUrl: './choreography.component.html',
  styleUrls: ['./choreography.component.less']
})
export class ChoreographyComponent implements OnInit {

  radioValue: string;

  constructor(
    private modal: NzModalService,
    private message: NzMessageService,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private router: Router,
    private service: ChoreographyService,
    public ability: ACLAbility
  ) { }

  ngOnInit() {
    this.route.url.subscribe(urls => {
      const urlSegments = this.router.url.split('/');
      const lastUrl = urlSegments[urlSegments.length - 1];
      if (lastUrl.startsWith('theatre')) {
            this.radioValue = 'theatre';
          }
    });
  }

  addTheatre () {
    this.modal.create({
      nzTitle: '新增剧场',
      nzContent: AddTheatreComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: 800,
      nzOnOk: this.addTheatreAgreed
    });
  }


  addTheatreAgreed = (component: AddTheatreComponent) => new Promise((resolve, reject) => {
    if (component.validation()) {
      component.submit().subscribe(res => {
        this.message.success(this.translate.instant('global.add-success'));
          this.service.eventEmit.emit( { type: 'theatre', method: 'refresh'});
        resolve();
      }, error => {
        reject(false);
      });
    } else {
      reject(false);
    }
  })

  view() {
    this.router.navigate([`/manage/series/choreography`]);
  }

}
