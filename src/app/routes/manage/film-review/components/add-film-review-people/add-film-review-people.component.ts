import { Component, OnInit, ElementRef, ViewChild, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FilmReviewService } from '../../film-review.service';
import { NzMessageService } from 'ng-zorro-antd';
import { TranslateService } from '@ngx-translate/core';
import { ReactiveBase, FormControlService } from '@shared';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-add-film-review-people',
  templateUrl: './add-film-review-people.component.html',
  styleUrls: ['./add-film-review-people.component.less']
})
export class AddFilmReviewPeopleComponent implements OnInit {

  @ViewChild('reviewPeopleInfoRef') reviewPeopleInfoRef: ElementRef<HTMLFormElement>;
  @Input() tid: number;

  validateForm: FormGroup;
  reviewPeopleInfoForm: FormGroup;
  controlArray: Array<{ id: number; controlInstance: string }> = [];
  reviewPeopleInfos: ReactiveBase<any>[][];

  constructor(
    private fb: FormBuilder,
    private service: FilmReviewService,
    private message: NzMessageService,
    private translate: TranslateService,
    private fcs: FormControlService,
  ) { }

  ngOnInit() {
    this.validateForm = this.fb.group({
      num: [null, [Validators.required]]
    });
  }

  onPeopleNumChange(value: string) {
    const count = parseInt(value, 10);
    if (count >= 0) {
      this.reviewPeopleInfos = this.service.getPeopleInfoInput(count);
      const fg = {};
      this.reviewPeopleInfos.map(p => this.fcs.toFormGroup(p)).forEach(p => {
        const c = p.controls;
        for (const key in c) {
          if (c.hasOwnProperty(key)) {
            fg[key] = c[key];
          }
        }
      });
      this.reviewPeopleInfoForm = this.fb.group(fg);
    }
  }

  validation(form: FormGroup) {
    for (const i in form.controls) {
      if (form.controls.hasOwnProperty(i)) {
        const control = form.controls[i];
        control.markAsDirty();
        control.updateValueAndValidity();
      }
    }
    return form.valid;
  }

  through() {
    return this.validation(this.validateForm) && this.validation(this.reviewPeopleInfoForm);
  }

  submit(): Observable<any> {
    if (this.reviewPeopleInfoForm.value.reviewPeople1 === undefined) {
      const a = [
        { name: this.reviewPeopleInfoForm.value.reviewPeople0, phone: this.reviewPeopleInfoForm.value.phone0 },
      ];
      return this.service.addFilmReviewPeople(this.tid, a);
    } else if
      (this.reviewPeopleInfoForm.value.reviewPeople2 === undefined) {
      const a = [
        { name: this.reviewPeopleInfoForm.value.reviewPeople0, phone: this.reviewPeopleInfoForm.value.phone0 },
        { name: this.reviewPeopleInfoForm.value.reviewPeople1, phone: this.reviewPeopleInfoForm.value.phone1 },
      ];
      return this.service.addFilmReviewPeople(this.tid, a);
    } else if
      (this.reviewPeopleInfoForm.value.reviewPeople3 === undefined) {
      const a = [
        { name: this.reviewPeopleInfoForm.value.reviewPeople0, phone: this.reviewPeopleInfoForm.value.phone0 },
        { name: this.reviewPeopleInfoForm.value.reviewPeople1, phone: this.reviewPeopleInfoForm.value.phone1 },
        { name: this.reviewPeopleInfoForm.value.reviewPeople2, phone: this.reviewPeopleInfoForm.value.phone2 },
      ];
      return this.service.addFilmReviewPeople(this.tid, a);
    } else if
      (this.reviewPeopleInfoForm.value.reviewPeople4 === undefined) {
      const a = [
        { name: this.reviewPeopleInfoForm.value.reviewPeople0, phone: this.reviewPeopleInfoForm.value.phone0 },
        { name: this.reviewPeopleInfoForm.value.reviewPeople1, phone: this.reviewPeopleInfoForm.value.phone1 },
        { name: this.reviewPeopleInfoForm.value.reviewPeople2, phone: this.reviewPeopleInfoForm.value.phone2 },
        { name: this.reviewPeopleInfoForm.value.reviewPeople3, phone: this.reviewPeopleInfoForm.value.phone3 },
      ];
      return this.service.addFilmReviewPeople(this.tid, a);
    } else {
      const a = [
        { name: this.reviewPeopleInfoForm.value.reviewPeople0, phone: this.reviewPeopleInfoForm.value.phone0 },
        { name: this.reviewPeopleInfoForm.value.reviewPeople1, phone: this.reviewPeopleInfoForm.value.phone1 },
        { name: this.reviewPeopleInfoForm.value.reviewPeople2, phone: this.reviewPeopleInfoForm.value.phone2 },
        { name: this.reviewPeopleInfoForm.value.reviewPeople3, phone: this.reviewPeopleInfoForm.value.phone3 },
        { name: this.reviewPeopleInfoForm.value.reviewPeople4, phone: this.reviewPeopleInfoForm.value.phone4 }
      ];
      return this.service.addFilmReviewPeople(this.tid, a);
    }
  }
}
