import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { TeamsService } from '../teams.service';

@Component({
  selector: 'app-edit-company',
  template: `
  <form nz-form [formGroup]="form" (ngSubmit)="submit()">
    <nz-form-item>
      <nz-form-control>
        <input nz-input formControlName="fullName" id="fullName" placeholder="企业全名">
        <nz-form-explain *ngIf="form.get('fullName').dirty && form.get('fullName').errors">
        请输入企业全名
        </nz-form-explain>
      </nz-form-control>
    </nz-form-item>
    <nz-form-item>
      <nz-form-control>
        <input nz-input formControlName="name" id="name" placeholder="企业简称">
        <nz-form-explain *ngIf="form.get('name').dirty && form.get('name').errors">
        请输入企业简称
        </nz-form-explain>
      </nz-form-control>
    </nz-form-item>
    <nz-form-item>
      <nz-form-control>
        <!-- <input nz-input formControlName="introduction" id="introduction" placeholder="企业简介"> -->
        <textarea nz-input formControlName="introduction" placeholder="企业简介" rows="4"></textarea>
      </nz-form-control>
    </nz-form-item>
  </form>
  `
})
export class EditCompanyComponent implements OnInit {

  @Input() name: string;
  @Input() fullName: string;
  @Input() introduction: string;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private service: TeamsService
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      name: [this.name, [Validators.required]],
      fullName: [this.fullName, [Validators.required]],
      introduction: [this.introduction],
    });

    this.form.get('name').disable();
    this.form.get('fullName').disable();
  }

  validation(): boolean {
    for (const i in this.form.controls) {
      if (this.form.controls.hasOwnProperty(i)) {
        this.form.controls[i].markAsDirty();
        this.form.controls[i].updateValueAndValidity();
      }
    }
    return this.form.valid;
  }

  submit() {
    return this.service.editCompany(this.form.value['name'], this.form.value['fullName'], this.form.value['introduction']);
  }

}
