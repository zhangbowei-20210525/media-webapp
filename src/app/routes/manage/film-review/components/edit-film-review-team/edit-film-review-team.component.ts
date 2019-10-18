import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FilmReviewComponent } from '../../film-review.component';
import { FilmReviewService } from '../../film-review.service';
import { NzModalService, NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { AddFilmReviewPeopleComponent } from '../add-film-review-people/add-film-review-people.component';
import { AddFilmReviewTeamComponent } from '../add-film-review-team/add-film-review-team.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-edit-film-review-team',
  templateUrl: './edit-film-review-team.component.html',
  styleUrls: ['./edit-film-review-team.component.less']
})
export class EditFilmReviewTeamComponent implements OnInit {

  @Input() filmReview: any;
  validateForm: FormGroup;
  ref: NzModalRef;
  teamInfo: any;
  peopleInfo = [];
  tid: number;
  pid = [];
  constructor(
    private fb: FormBuilder,
    private service: FilmReviewService,
    private modal: NzModalService,
    private message: NzMessageService,
    private translate: TranslateService,
  ) { }

  ngOnInit() {
    this.validateForm = this.fb.group({
      filmReviewTeam: [null, [Validators.required]],
      filmReviewPeople: [null, [Validators.required]],
    });
    this.service.getFilmReviewTeam(this.filmReview.id).subscribe(res => {
      this.teamInfo = res;
      this.tid = this.teamInfo.filter(x => x.status === true)[0].id;
      this.validateForm.get('filmReviewTeam').setValue(this.tid);
      this.service.getFilmReviewPeople(this.filmReview.id,
        this.tid).subscribe(ress => {
          this.peopleInfo = ress.map(item => ({
            value: item.id,
            label: item.name + '：' + item.phone,
            phone: item.phone,
            checked: item.status
          }));
          this.validateForm.get('filmReviewPeople').setValue(this.peopleInfo);
        });
      // if (this.filmReview.department !== null) {
      //   this.tid = this.filmReview.department.id;
      //   this.validateForm.get('filmReviewTeam').setValue(this.tid);
      //   this.service.getFilmReviewPeople(this.tid).subscribe(ress => {
      //     this.peopleInfo = ress.map(item => ({
      //       value: item.id,
      //       label: item.name,
      //       phone: item.phone,
      //       checked: this.filmReview.employees.some(e => e.id === item.id)
      //     }));
      //     this.validateForm.get('filmReviewPeople').setValue(this.peopleInfo);
      //   });
      // }
      // if (this.filmReview.department === null) {
      //   this.tid = res[0].id;
      //   this.validateForm.get('filmReviewTeam').setValue(this.tid);
      //   this.service.getFilmReviewPeople(this.tid).subscribe(ress => {
      //     this.peopleInfo = ress.map(item => ({
      //       value: item.id,
      //       label: item.name,
      //       phone: item.phone,
      //       checked: this.filmReview.employees.some(e => e.id === item.id)
      //     }));
      //     this.validateForm.get('filmReviewPeople').setValue(this.peopleInfo);
      //   });
      // }
    });
  }

  teamRefresh() {
    this.service.getFilmReviewTeam(this.filmReview.id).subscribe(res => {
      this.teamInfo = res;
      this.tid = this.filmReview.department.id;
      this.peopleInfo =  [];
      this.peopleRefresh(this.tid);
    });
  }

  peopleRefresh(id: number) {
    this.service.getFilmReviewPeople(this.filmReview.id, id).subscribe(res => {
      res.forEach(f => {
        this.peopleInfo.push({
          value: f.id,
          label: f.name + '：' + f.phone,
          phone: f.phone,
          checked: f.status
        });
      });
      this.validateForm.get('filmReviewPeople').setValue(this.peopleInfo);
    });
  }



  teamConfig() {
    this.modal.create({
      nzTitle: `新增审片团`,
      nzContent: AddFilmReviewTeamComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: 800,
      nzOnOk: this.addFilmReviewTeamAgreed,
      nzNoAnimation: true
    });
    // this.ref = this.modal.create({
    //   nzTitle: '配置信息',
    //   nzContent: '请选择操作',
    //   nzFooter: [
    //     {
    //       label: '返回',
    //       shape: 'default',
    //       onClick: () => this.ref.destroy()
    //     },
    //     {
    //       label: '删除',
    //       type: 'danger',
    //       loading: false,
    //       onClick() {
    //       }
    //     },
    //     {
    //       label: '新增',
    //       type: 'primary',
    //       onClick: () =>
    //         this.modal.create({
    //           nzTitle: `新增审片团`,
    //           nzContent: AddFilmReviewTeamComponent,
    //           nzMaskClosable: false,
    //           nzClosable: false,
    //           nzWidth: 800,
    //           nzOnOk: this.addFilmReviewTeamAgreed,
    //           nzNoAnimation: true
    //         })
    //     },
    //   ]
    // });
  }

  addFilmReviewTeamAgreed = (component: AddFilmReviewTeamComponent) => new Promise((resolve, reject) => {
    if (component.validation()) {
      if (this.teamInfo.find(x => x.name === component.teamName())) {
        this.message.warning('该审片部门已存在，请重新填写');
        reject(false);
      } else {
        component.submit()
          .subscribe(result => {
            this.message.success(this.translate.instant('global.add-success'));
            // this.ref.destroy();
            this.teamRefresh();
            resolve();
          }, error => {
            reject(false);
          });
      }
    } else {
      reject(false);
    }
  })

  onTeamChange() {
    this.tid = this.validateForm.get('filmReviewTeam').value;
    this.peopleInfo = [];
    this.peopleRefresh(this.validateForm.get('filmReviewTeam').value);
  }

  onPeopleChange() {
    this.pid = [];
    // this.validateForm.get('filmReviewPeople').value.filter(x => x.checked === true).forEach(f => {
    //   this.pid.push(f.value);
    // });
    this.validateForm.get('filmReviewPeople').value.filter(x => x.checked === true).forEach(f => {
      this.pid.push(f.value);
    });
  }

  validation() {
    const form = this.validateForm;
    for (const i in form.controls) {
      if (form.controls.hasOwnProperty(i)) {
        const control = form.controls[i];
        control.markAsDirty();
        control.updateValueAndValidity();
      }
    }
    return form.valid;
  }

  peopleConfig() {
    this.modal.create({
      nzTitle: `新增审片人`,
      nzContent: AddFilmReviewPeopleComponent,
      nzComponentParams: { tid: this.tid },
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: 800,
      nzOnOk: this.addFilmReviewPeopleAgreed,
      nzNoAnimation: true
    });
    // this.ref = this.modal.create({
    //   nzTitle: '配置信息',
    //   nzContent: '请选择操作',
    //   nzFooter: [
    //     {
    //       label: '返回',
    //       shape: 'default',
    //       onClick: () => this.ref.destroy()
    //     },
    //     {
    //       label: '删除',
    //       type: 'danger',
    //       loading: false,
    //       onClick() {
    //       }
    //     },
    //     {
    //       label: '新增',
    //       type: 'primary',
    //       onClick: () =>
    //         this.modal.create({
    //           nzTitle: `新增审片人`,
    //           nzContent: AddFilmReviewPeopleComponent,
    //           nzComponentParams: { tid: this.tid },
    //           nzMaskClosable: false,
    //           nzClosable: false,
    //           nzWidth: 800,
    //           nzOnOk: this.addFilmReviewPeopleAgreed,
    //           nzNoAnimation: true
    //         })
    //     },
    //   ]
    // });
  }

  addFilmReviewPeopleAgreed = (component: AddFilmReviewPeopleComponent) => new Promise((resolve, reject) => {
    if (component.through()) {
      component.submit()
        .subscribe(result => {
          this.message.success(this.translate.instant('global.add-success'));
          this.peopleInfo = [];
          this.peopleRefresh(this.tid);
          // this.ref.destroy();
          resolve();
        }, error => {
          reject(false);
        });
    } else {
      reject(false);
    }
  })

  submit(): Observable<any> {
    return this.service.saveFilmReviewTeamInfo(this.filmReview.id, this.tid, this.pid);
  }

}
