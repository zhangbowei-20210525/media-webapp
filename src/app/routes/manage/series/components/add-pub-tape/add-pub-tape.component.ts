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
  @ViewChild('inputFocus') inputFocus: ElementRef;
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
    // this.seriesService.getCompaniesName()
    this.seriesService.getCompanyList().subscribe(res => {
      this.filteredCompanyOptions = this.companyOptions = res;
    });
    this.validateForm = this.fb.group({
      company: [null, [Validators.required]],
      phone: [null, [Validators.required, Validators.pattern(/^[1][3,4,5,7,8][0-9]{9}$/)]],
      contact: [null, [Validators.required]],
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

  onCompanyInput(value: string) {
    this.filteredCompanyOptions = this.companyOptions.filter(item => item.name.indexOf(value) >= 0);
  }

  companyChange() {
    const company = this.companyOptions.filter(f => f.name === this.validateForm.value['company']);
    this.validateForm.get('contact').reset();
    this.validateForm.get('phone').reset();
    this.contactOptions = [];
    this.phoneOptions = [];
    if (company.length > 0) {
      this.seriesService.getContacts(company[0].id).subscribe(res => {
        this.contactInfo = res.list;
        res.list.forEach(c => {
          this.contactOptions.push(c.name);
          this.phoneOptions.push(c.phone);
        });
      });
    }
  }

  onContactInput() {
    console.log(this.validateForm.value['contact']);
  }

  onPhoneInput() {
    console.log(this.validateForm.value['phone']);
  }

  contactChange() {
    this.validateForm.get('phone').reset();
    this.validateForm.get('phone').enable();
    if (this.contactInfo !== undefined) {
      const contact = this.contactInfo.filter(f => f.name === this.validateForm.value['contact']);
      if (contact.length > 0) {
        this.contactId = contact[0].id;
        this.validateForm.get('phone').setValue(contact[0].phone);
        this.validateForm.get('phone').disable();
      }
    }
  }

  // phoneChange() {
  //   console.log(this.validateForm.value['phone']);
  // }

  submit(): Observable<any> {
    const form = this.validateForm;
    if (this.contactId === undefined) {
      const data = {
        custom_name: form.value['company'] || null,
        liaison_name: form.value['contact'] || null,
        liaison_phone: form.value['phone'] || null,
        liaison_id: ''
      };
      return this.seriesService.addPubTape(this.id, data);
    } else {
      const data = {
        custom_name: '',
        liaison_name: '',
        liaison_phone: '',
        liaison_id: this.contactId + ''
      };
      return this.seriesService.addPubTape(this.id, data);
    }
  }

}
