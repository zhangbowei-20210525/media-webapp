import { Component, OnInit, Input, ViewChild, ElementRef, PLATFORM_ID, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SeriesService } from '../../series.service';
import { Observable } from 'rxjs';
import { viewDef } from '@angular/core/src/view';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-add-pub-tape',
  templateUrl: './add-pub-tape.component.html',
  styleUrls: ['./add-pub-tape.component.less']
})
export class AddPubTapeComponent implements OnInit {


  @Input() id: number;
  @ViewChild('companyInput') companyInput: ElementRef<HTMLInputElement>;
  validateForm: FormGroup;
  phone: number;
  companiesName = [];
  isOpen: boolean;
  companyOptions: any[];
  filteredCompanyOptions: any[];
  contactOptions = [];
  phoneOptions = [];
  company: any[];
  contactInfo: any[];
  contactId: number;

  constructor(
    private fb: FormBuilder,
    private seriesService: SeriesService,
  ) { }

  ngOnInit() {
    this.seriesService.getInternetCompanies().subscribe(result => {
      this.filteredCompanyOptions = result.list;
      this.validateForm = this.fb.group({
        company: [null, [Validators.required]],
        phone: [null, [Validators.required, Validators.pattern(/^[1][3,4,5,7,8][0-9]{9}$/)]],
        contact: [null, [Validators.required]],
      });
      this.validateForm.get('phone').disable();
      this.validateForm.get('contact').disable();
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

  companyChange() {
    this.seriesService.getContactsInfo(this.validateForm.get('company').value).subscribe(res => {
      this.contactOptions = res.list;
      this.contactOptions = this.contactOptions.filter(f => f.from_type === 'outside');
      this.validateForm.get('contact').enable();
    });
  }

  onContactInput() {
    console.log(this.validateForm.value['contact']);
  }

  onPhoneInput() {
    console.log(this.validateForm.value['phone']);
  }

  contactChange() {
    // tslint:disable-next-line:max-line-length
    this.validateForm.get('phone').setValue(this.contactOptions.filter(f => f.id === this.validateForm.get('contact').value)[0].employee.outside_phone);

  }


  submit(): Observable<any> {
      // tslint:disable-next-line:max-line-length
      return this.seriesService.addPubTape(this.id, this.validateForm.get('contact').value);
  }

}
