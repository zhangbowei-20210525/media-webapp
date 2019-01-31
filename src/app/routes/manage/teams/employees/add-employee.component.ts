import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { TeamsService } from '../teams.service';
import { EmployeesService } from './employees.service';

@Component({
  selector: 'app-add-employee',
  template: `
  <form nz-form [formGroup]="form" (ngSubmit)="submit()">
    <nz-form-item>
      <nz-form-control>
        <input nz-input formControlName="name" id="name" placeholder="名称">
        <nz-form-explain *ngIf="form.get('name').dirty && form.get('name').errors">
        请输入员工名称
        </nz-form-explain>
      </nz-form-control>
    </nz-form-item>
    <nz-form-item>
      <nz-form-control>
        <input nz-input formControlName="phone" id="phone" placeholder="手机号">
        <nz-form-explain *ngIf="form.get('phone').dirty && form.get('phone').errors">
        请输入员工手机号
        </nz-form-explain>
      </nz-form-control>
    </nz-form-item>
  </form>
  `
})
export class AddEmployeeComponent implements OnInit {

  @Input() id: string;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private service: EmployeesService
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      name: [null, [Validators.required]],
      phone: [null, [Validators.required]]
    });
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
    return this.service.addEmployee(this.id, this.form.value['name'], this.form.value['phone']);
  }

}
