import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SeriesService } from '../../series.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-add-pub-tape',
  templateUrl: './add-pub-tape.component.html',
  styleUrls: ['./add-pub-tape.component.less']
})
export class AddPubTapeComponent implements OnInit {


  @Input() id: number;
  validateForm: FormGroup;
  phone: number;
  companiesName = [];
  isOpen: boolean;
  companyOptions: any[];
  filteredCompanyOptions: any[];

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
      phone: [null, [Validators.required]],
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
    setTimeout(() => {
      console.log('1', this.validateForm.value['company']);
    }, 0);
    const  company =  this.companyOptions.filter(f =>  f.name === this.validateForm.value['company']);
    console.log(company);
    // if (company.length > 0) {
    //     this.seriesService.getContacts(company[0].id).subscribe(res => console.log(res));
    // }
  }

  onContactInput() {}

  onPhoneInput() {}

  formSubmit(): Observable<any> {
    const form = this.validateForm;
    const data = {
      auth_company_id: form.value['companyName'] || null,
    };
    return this.seriesService.addPubTape(this.id, data);
  }

  // openChange() {
  //   console.log(this.isOpen);
  // }

  // inputChange() {
  //   if (this.validateForm.value['phone'] === '') {
  //     this.isOpen = false;
  //   }
  // }

  // search() {
  //   this.phone = this.validateForm.value['phone'];
  //   this.seriesService.getCompaniesName(this.phone).subscribe(res => {
  //     this.companiesName = res;
  //     this.isOpen = true;
  //   });
  // }

}
