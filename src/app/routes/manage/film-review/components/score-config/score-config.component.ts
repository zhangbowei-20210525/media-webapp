import { Component, OnInit, ViewChild, HostListener, ElementRef, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FilmReviewService } from '../../film-review.service';
import { NzModalRef, NzModalService, NzInputDirective, NzMessageService } from 'ng-zorro-antd';
import { AddScoreComponent } from '../add-score/add-score.component';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { PaginationDto } from '@shared';

@Component({
  selector: 'app-score-config',
  templateUrl: './score-config.component.html',
  styleUrls: ['./score-config.component.less']
})
export class ScoreConfigComponent implements OnInit {

  validateForm: FormGroup;
  ref: NzModalRef;
  editId: number;
  listOfData = [];
  sum = 0;
  brr = [];
  @Input() filmReview: any;

  constructor(
    private fb: FormBuilder,
    private service: FilmReviewService,
    private modal: NzModalService,
    private message: NzMessageService,
    private translate: TranslateService,
  ) { }

  ngOnInit() {
    // this.validateForm = this.fb.group({
    //   scoreSelect: [null, [Validators.required]],
    // });
    this.service.getScoreConfigInfo().subscribe(res => {
      const arr = [];
      res.forEach(x => {
        arr.push({
          id: x.id,
          name: x.name,
          proportion: 0,
        });
      });
      this.listOfData = arr;
    });
  }

  refreshStatus($event, id: number, proportion: number) {
    if ($event === true) {
      if (this.brr.length > 0) {
        if (this.brr.find(x => x.id !== id)) {
          this.brr.push({
            id: id,
            proportion: proportion,
          });
        }
        this.sum = 0;
        this.brr.forEach(x => {
          console.log(x);
          this.sum = this.sum + x.proportion;
        });
        console.log(this.sum);
      }
      if (this.brr.length === 0) {
        this.brr.push({
          id: id,
          proportion: proportion,
        });
        this.sum = 0;
        this.brr.forEach(x => {
          console.log(x);
          this.sum = this.sum + x.proportion;
        });
        console.log(this.sum);
      }
    }
    if ($event === false) {
      this.brr = this.brr.filter(x => x.id !== id);
      this.sum = 0;
      this.brr.forEach(x => {
        console.log(x);
        this.sum = this.sum + x.proportion;
      });
      console.log(this.sum);
    }
    console.log(this.brr);
  }

  startEdit(id: number, event: MouseEvent): void {
    console.log(id);
    event.preventDefault();
    event.stopPropagation();
    this.editId = id;
  }

  // validation() {
  //   const form = this.validateForm;
  //   for (const i in form.controls) {
  //     if (form.controls.hasOwnProperty(i)) {
  //       const control = form.controls[i];
  //       control.markAsDirty();
  //       control.updateValueAndValidity();
  //     }
  //   }
  //   return form.valid;
  // }

  // scoreSelectChange(event, data: any) {
  //   console.log(event);
  //   console.log(data);
  // }

  // submit(): Observable<any> {
  //   const form = this.validateForm;
  //     return this.service.addBroadcastingInfo('Insert', this.tid, this.data.id,
  //     Util.dateToString(form.get('currentBroadcastDate').value),
  //     form.value['start_episode'],
  //     form.value['end_episode']);
  //   }

  // scoreConfig() {
  //   this.ref = this.modal.create({
  //     nzTitle: '配置信息',
  //     nzContent: '请选择操作',
  //     nzFooter: [
  //       {
  //         label: '返回',
  //         shape: 'default',
  //         onClick: () => this.ref.destroy()
  //       },
  //       {
  //         label: '删除',
  //         type: 'danger',
  //         loading: false,
  //         onClick() {
  //         }
  //       },
  //       {
  //         label: '新增',
  //         type: 'primary',
  //         onClick: () =>
  //         this.modal.create({
  //           nzTitle: `新增审片人`,
  //           nzContent: AddScoreComponent,
  //           nzMaskClosable: false,
  //           nzClosable: false,
  //           nzWidth: 800,
  //           nzOnOk: this.addScoreAgreed,
  //           nzNoAnimation: true
  //         })
  //       },
  //     ]
  //   });
  // }

  add() {
    this.modal.create({
      nzTitle: `新增评分项`,
      nzContent: AddScoreComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: 800,
      nzOnOk: this.addScoreAgreed,
      nzNoAnimation: true
    });
  }

  addScoreAgreed = (component: AddScoreComponent) => new Promise((resolve, reject) => {
    if (component.validation()) {
      component.submit()
        .subscribe(result => {
          this.message.success(this.translate.instant('global.add-success'));
          this.service.getScoreConfigInfo().subscribe(res => {
            const arr = [];
            res.forEach(x => {
              arr.push({
                id: x.id,
                name: x.name,
                proportion: 0,
              });
            });
            this.listOfData = arr;
          });
          resolve();
        }, error => {
          reject(false);
        });
    } else {
      reject(false);
    }
  })

  validation() {
    this.sum = 0;
    this.brr.forEach(x => {
      console.log(x);
      this.sum = this.sum + x.proportion;
    });
    if (this.sum !== 100) {
      return false;
    }
    if (this.sum === 100) {
      return true;
    }
  }

  onChange($event, id: number, proportion: number) {
    this.brr.forEach(x => {
      if (id === x.id) {
        x.proportion = proportion;
      }
    });
  }

  submit(): Observable<any> {
    this.brr.map(x => {
      x.proportion = x.proportion / 100;
    });
    return this.service.saveScoreConfigInfo(this.filmReview.id, this.brr);
  }

}
