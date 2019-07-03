import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CopyrightsService } from '../../copyrights.service';

@Component({
  selector: 'app-right-config',
  templateUrl: './right-config.component.html',
  styleUrls: ['./right-config.component.less']
})
export class RightConfigComponent implements OnInit {

  @ViewChild('ITInputElement') ITInputElement: ElementRef;
  @ViewChild('STInputElement') STInputElement: ElementRef;
  @ViewChild('THInputElement') THInputElement: ElementRef;
  form: FormGroup;
  tags1 = ['投资1', '投资2', '投资3'];
  tags2 = ['节目类型1', '节目类型2', '节目类型3'];
  tags3 = ['题材1', '题材2', '题材3'];
  isITInputVisible = false;
  isSTInputVisible = false;
  isTHInputVisible = false;

  constructor(
    private fb: FormBuilder,
    private service: CopyrightsService,
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      investsType: [null, [Validators.required]],
      seriesType: [null, [Validators.required]],
      themes: [null, [Validators.required]],
    });
  }

  onTagClose(removedTag: {}, type: string) {
    if (type === 'IT') {
      this.tags1 = this.tags1.filter(tag => tag !== removedTag);
    }
    if (type === 'ST') {
      this.tags2 = this.tags2.filter(tag => tag !== removedTag);
    }
    if (type === 'TH') {
      this.tags3 = this.tags3.filter(tag => tag !== removedTag);
    }
  }

  onShowInput(type: string) {
    if (type === 'IT') {
      this.isITInputVisible = true;
      setTimeout(() => {
        this.ITInputElement.nativeElement.focus();
      }, 10);
    }
    if (type === 'ST') {
      this.isSTInputVisible = true;
      setTimeout(() => {
        this.STInputElement.nativeElement.focus();
      }, 10);
    }
    if (type === 'TH') {
      this.isTHInputVisible = true;
      setTimeout(() => {
        this.THInputElement.nativeElement.focus();
      }, 10);
    }
  }

  onHandleInputConfirm(type: string) {
    if (type === 'IT') {
      if (this.form.get('investsType').value && this.tags1.indexOf(this.form.get('investsType').value) === -1) {
        this.tags1 = [...this.tags1, this.form.get('investsType').value];
      }
      this.form.get('investsType').setValue('');
      this.isITInputVisible = false;
    }
    if (type === 'ST') {
      if (this.form.get('seriesType').value && this.tags2.indexOf(this.form.get('seriesType').value) === -1) {
        this.tags2 = [...this.tags2, this.form.get('seriesType').value];
      }
      this.form.get('seriesType').setValue('');
      this.isSTInputVisible = false;
    }
    if (type === 'TH') {
      if (this.form.get('themes').value && this.tags3.indexOf(this.form.get('themes').value) === -1) {
        this.tags3 = [...this.tags3, this.form.get('themes').value];
      }
      this.form.get('themes').setValue('');
      this.isTHInputVisible = false;
    }
  }

  validation() {
    const form = this.form;
    for (const i in form.controls) {
      if (form.controls.hasOwnProperty(i)) {
        const control = form.controls[i];
        control.markAsDirty();
        control.updateValueAndValidity();
      }
    }
    return form.valid;
  }

  // submit(): Observable<any> {
  //   const form = this.validateForm;
  //   const data = {
  //     // program_id: this.data.id,
  //     start_episode: form.value['start_episode'] || null,
  //     end_episode: form.value['end_episode'] || null,
  //     episode: form.value['num'] || null,
  //   };
  //   console.log(data);
  //   return this.service.addInsertBroadcastInfo();
  // }

}
