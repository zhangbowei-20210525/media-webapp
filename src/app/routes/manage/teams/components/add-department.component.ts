import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { TeamsService } from '../teams.service';

@Component({
  selector: 'app-add-department',
  template: `
  <form nz-form [formGroup]="form" (ngSubmit)="submit()">
    <nz-form-item>
      <nz-form-control>
        <input nz-input formControlName="departmentName" id="departmentName" placeholder="部门名称">
        <nz-form-explain *ngIf="form.get('departmentName').dirty && form.get('departmentName').errors">
        请输入部门名称
        </nz-form-explain>
      </nz-form-control>
    </nz-form-item>
  </form>
  `
})
export class AddDepartmentComponent implements OnInit {

  @Input() id: string;
  form: FormGroup;

  get departmentName() {
    return this.form.controls['departmentName'];
  }

  constructor(
    private fb: FormBuilder,
    private service: TeamsService
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      departmentName: [null, [Validators.required]],
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
    return this.service.addDepartment(this.id, this.departmentName.value);
  }

}
