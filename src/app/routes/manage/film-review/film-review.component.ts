import { Component, OnInit } from '@angular/core';
import { NzModalService, NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { EditFilmReviewTeamComponent } from './components/edit-film-review-team/edit-film-review-team.component';
import { ConclusionConfigInfoComponent } from './components/conclusion-config-info/conclusion-config-info.component';
import { ScoreConfigComponent } from './components/score-config/score-config.component';
import { IdeaConfigComponent } from './components/idea-config/idea-config.component';
import { FilmReviewService } from './film-review.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-film-review',
  templateUrl: './film-review.component.html',
  styleUrls: ['./film-review.component.less']
})
export class FilmReviewComponent implements OnInit {

  filmReviewTeam: string;
  ref: NzModalRef;
  filmReview1: any;
  filmReview2: any;
  filmReview3: any;
  people: string;
  switchTab: number;
  info: number;

  constructor(
    private modal: NzModalService,
    private service: FilmReviewService,
    private message: NzMessageService,
    private translate: TranslateService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.switchTab = 0;
    this.service.getFilmReviewList().subscribe(res => {
      this.refresh(res, 0);
      console.log(res, '11');
    });
  }

  goBack() {
    this.router.navigate([`/manage/image/review-view`]);
  }

  onClick(tab: number) {
    this.switchTab = tab;
    if (tab === 0) {
      this.service.getFilmReviewList().subscribe(res => {
        this.refresh(res, 0);
      });
    }
    if (tab === 1) {
      this.service.getFilmReviewList().subscribe(res => {
        this.refresh(res, 1);
      });
    }
    if (tab === 2) {
      this.service.getFilmReviewList().subscribe(res => {
        this.refresh(res, 2);
      });
    }
  }

  refresh(data: any, step_number: number) {
    if (step_number === 0) {
      this.service.getFilmReviewDetails(data[0].id).subscribe(res => {
        this.filmReview1 = res;
        console.log(res);
        console.log(res.conclusion_item.neutral_name);
      });
    }
    if (step_number === 1) {
      this.service.getFilmReviewDetails(data[1].id).subscribe(res => {
        this.filmReview2 = res;
      });
    }
    if (step_number === 2) {
      this.service.getFilmReviewDetails(data[2].id).subscribe(res => {
        this.filmReview3 = res;
      });
    }
  }


  conclusionConfig() {
    if (this.switchTab === 0) {
      this.info = this.filmReview1;
    }
    if (this.switchTab === 1) {
      this.info = this.filmReview2;
    }
    if (this.switchTab === 2) {
      this.info = this.filmReview3;
    }
    this.modal.create({
      nzTitle: `结论配置信息`,
      nzContent: ConclusionConfigInfoComponent,
      nzComponentParams: { filmReview: this.info },
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: 800,
      nzOnOk: this.conclusionConfigAgreed,
      nzNoAnimation: true
    });
  }

  conclusionConfigAgreed = (component: ConclusionConfigInfoComponent) => new Promise((resolve, reject) => {
    if (component.validation()) {
      component.submit()
        .subscribe(result => {
          this.message.success(this.translate.instant('global.add-success'));
          if (this.switchTab === 0) {
            this.service.getFilmReviewList().subscribe(res => {
              this.refresh(res, 0);
            });
          }
          if (this.switchTab === 1) {
            this.service.getFilmReviewList().subscribe(res => {
              this.refresh(res, 1);
            });
          }
          if (this.switchTab === 2) {
            this.service.getFilmReviewList().subscribe(res => {
              this.refresh(res, 2);
            });
          }
          resolve();
        }, error => {
          reject(false);
        });
    } else {
      reject(false);
    }
  })

  reviewPeopleConfig() {
    if (this.switchTab === 0) {
      this.info = this.filmReview1;
    }
    if (this.switchTab === 1) {
      this.info = this.filmReview2;
    }
    if (this.switchTab === 2) {
      this.info = this.filmReview3;
    }
    this.modal.create({
      nzTitle: `编辑审片团队信息`,
      nzContent: EditFilmReviewTeamComponent,
      nzComponentParams: { filmReview: this.info },
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: 800,
      nzOnOk: this.reviewPeopleConfigAgreed,
      nzNoAnimation: true
    });
  }

  reviewPeopleConfigAgreed = (component: EditFilmReviewTeamComponent) => new Promise((resolve, reject) => {
    if (component.validation()) {
      component.submit()
        .subscribe(result => {
          this.message.success(this.translate.instant('global.add-success'));
          if (this.switchTab === 0) {
            this.service.getFilmReviewList().subscribe(res => {
              this.refresh(res, 0);
            });
          }
          if (this.switchTab === 1) {
            this.service.getFilmReviewList().subscribe(res => {
              this.refresh(res, 1);
            });
          }
          if (this.switchTab === 2) {
            this.service.getFilmReviewList().subscribe(res => {
              this.refresh(res, 2);
            });
          }
          resolve();
        }, error => {
          reject(false);
        });
    } else {
      reject(false);
    }
  })

  scoreConfig() {
    if (this.switchTab === 0) {
      this.info = this.filmReview1;
    }
    if (this.switchTab === 1) {
      this.info = this.filmReview2;
    }
    if (this.switchTab === 2) {
      this.info = this.filmReview3;
    }
    this.modal.create({
      nzTitle: `评分配置信息`,
      nzContent: ScoreConfigComponent,
      nzComponentParams: { filmReview: this.info },
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: 800,
      nzOnOk: this.scoreConfigAgreed,
      nzNoAnimation: true
    });
  }

  scoreConfigAgreed = (component: ScoreConfigComponent) => new Promise((resolve, reject) => {
    if (component.validation()) {
      if (component.validationZero()) {
        component.submit()
          .subscribe(result => {
            this.message.success(this.translate.instant('global.add-success'));
            if (this.switchTab === 0) {
              this.service.getFilmReviewList().subscribe(res => {
                this.refresh(res, 0);
              });
            }
            if (this.switchTab === 1) {
              this.service.getFilmReviewList().subscribe(res => {
                this.refresh(res, 1);
              });
            }
            if (this.switchTab === 2) {
              this.service.getFilmReviewList().subscribe(res => {
                this.refresh(res, 2);
              });
            }
            resolve();
          }, error => {
            reject(false);
          });
      } else {
        this.message.warning(this.translate.instant('请重新修改百分比统计(占比值不可为0)'));
        reject(false);
      }
    } else {
      this.message.warning(this.translate.instant('请重新修改百分比统计(占比值需等于100%)'));
      reject(false);
    }
  })

  ideaConfig() {
    if (this.switchTab === 0) {
      this.info = this.filmReview1;
    }
    if (this.switchTab === 1) {
      this.info = this.filmReview2;
    }
    if (this.switchTab === 2) {
      this.info = this.filmReview3;
    }
    this.modal.create({
      nzTitle: `意见配置信息`,
      nzContent: IdeaConfigComponent,
      nzComponentParams: { filmReview: this.info },
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: 800,
      nzOnOk: this.ideaConfigAgreed,
      nzNoAnimation: true
    });
  }

  ideaConfigAgreed = (component: IdeaConfigComponent) => new Promise((resolve, reject) => {
    if (component.validation()) {
      component.submit()
        .subscribe(result => {
          this.message.success(this.translate.instant('global.add-success'));
          if (this.switchTab === 0) {
            this.service.getFilmReviewList().subscribe(res => {
              this.refresh(res, 0);
            });
          }
          if (this.switchTab === 1) {
            this.service.getFilmReviewList().subscribe(res => {
              this.refresh(res, 1);
            });
          }
          if (this.switchTab === 2) {
            this.service.getFilmReviewList().subscribe(res => {
              this.refresh(res, 2);
            });
          }
          resolve();
        }, error => {
          reject(false);
        });
    } else {
      reject(false);
    }
  })


}
