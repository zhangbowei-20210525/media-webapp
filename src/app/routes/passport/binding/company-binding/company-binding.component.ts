import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BindingService } from '../binding.service';
import { NzMessageService } from 'ng-zorro-antd';
import { AuthService } from '@core/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { StateStoreService } from '../../state-store.service';
import { TreeService } from '@shared';
import { LoginResultDto } from '@shared/dtos';

@Component({
  selector: 'app-company-binding',
  templateUrl: './company-binding.component.html',
  styleUrls: ['./company-binding.component.less']
})
export class CompanyBindingComponent implements OnInit {

  form: FormGroup;
  isSendDisabled = false;
  countdown: number;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private service: BindingService,
    private message: NzMessageService,
    private auth: AuthService,
    private stateStore: StateStoreService,
    private route: ActivatedRoute,
    private router: Router,
    private ts: TreeService
  ) { }

  get name() {
    return this.form.get('name');
  }

  get companyFullName() {
    return this.form.get('company_full_name');
  }

  get companyName() {
    return this.form.get('company_name');
  }

  ngOnInit() {
    const state = this.stateStore.getState();
    if (state.userInfo && state.token) {
      this.form = this.fb.group({
        name: ['', Validators.required],
        company_full_name: ['', Validators.required],
        company_name: ['']
      });
    } else {
      this.message.warning('状态已经失效');
      setTimeout(() => {
        this.router.navigateByUrl('/');
      }, 0);
    }
  }

  validation(form: FormGroup): boolean {
    for (const i in form.controls) {
      if (form.controls.hasOwnProperty(i)) {
        form.controls[i].markAsDirty();
        form.controls[i].updateValueAndValidity();
      }
    }
    return form.valid;
  }

  onSubmit() {
    if (this.validation(this.form)) {
      this.isSubmitting = true;
      this.service.bindingCompany(this.stateStore.getState().token, this.name.value, this.companyName.value, this.companyFullName.value)
        .pipe(finalize(() => {
          this.isSubmitting = false;
        })).subscribe(result => {
          this.message.success('绑定完成');
          this.login(result);
        });
    }
  }

  login(data: LoginResultDto) {
    const returnUrl = this.stateStore.getDirectionUrl();
    this.stateStore.clearState();
    this.auth.onLogin({
      userInfo: data.auth,
      token: data.token,
      permissions: this.ts.recursionNodesMapArray(data.permissions, p => p.code, p => p.status)
    });
    this.router.navigate([returnUrl || '/']);
  }

}
