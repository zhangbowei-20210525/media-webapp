import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SeriesService } from '../../series.service';
import { MentionOnSearchTypes, NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { Observable } from 'rxjs';
import { NullAstVisitor } from '@angular/compiler';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { LocalRequestService } from '@shared/locals';
import { timeout } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Util } from '@shared';

@Component({
  selector: 'app-add-tape',
  templateUrl: './add-tape.component.html',
  styleUrls: ['./add-tape.component.less']
})
export class AddTapeComponent implements OnInit {

  @Input() id: number;
  options = [];
  onlineTapeForm: FormGroup;
  entityTapeForm: FormGroup;
  source_type: 'online' | 'entity' = 'online';
  listOfOption = [];
  carrierBrandList = [];
  carrierModelList = [];
  sound_track = [];
  programList = [];
  disabled: boolean;
  info: any;
  tapeVersion: string;
  isloading = true;
  programTypeOptions = [];
  filteredProgramTypes = [];

  constructor(
    private fb: FormBuilder,
    private service: SeriesService,
    private message: NzMessageService,
    private translate: TranslateService,
    private localRequestService: LocalRequestService,
    private router: Router,
    private component: NzModalRef
  ) { }

  ngOnInit() {
    this.onlineTapeForm = this.fb.group({
      program_name: [null, [Validators.required]],
      program_type: [null, [Validators.required]],
      name: [null, [Validators.required]],
      language: [null],
      subtitle: [null],
      remark: [null],
      // format: [null],
      // bit_rate: [null],
    });
    this.entityTapeForm = this.fb.group({
      program_name: [null, [Validators.required]],
      program_type: [null, [Validators.required]],
      name: [null, [Validators.required]],
      episode: [null],
      language: [null],
      subtitle: [null],
      ch1: [null],
      ch2: [null],
      ch3: [null],
      ch4: [null],
      ch5: [null],
      ch6: [null],
      sharpness: [null],
      carrier: [null],
      brand: [null],
      model: [null],
      storage_date: [null],
      storage_location: [null],
      detail_location: [null],
    });
    if (+this.id > 0) {
      this.service.getSeriesDetailsInfo(this.id).subscribe(result => {
        this.onlineTapeForm.get('program_name').setValue(result.name);
        this.onlineTapeForm.get('program_name').disable();
        this.onlineTapeForm.get('program_type').setValue(result.program_type);
        this.onlineTapeForm.get('program_type').disable();
        this.entityTapeForm.get('program_name').setValue(result.name);
        this.entityTapeForm.get('program_name').disable();
        this.entityTapeForm.get('program_type').setValue(result.program_type);
        this.entityTapeForm.get('program_type').disable();
      });
    }

    this.service.getProgramTypes().subscribe(result => {
      this.filteredProgramTypes = this.programTypeOptions = result.program_type_choices;
    });

    this.listOfOption = [
      { key: '1000', value: 1000 },
      { key: '2000', value: 2000 },
      { key: '3000', value: 3000 },
      { key: '4000', value: 4000 },
      { key: '5000', value: 5000 },
      { key: '6000', value: 6000 },
      { key: '7000', value: 7000 },
      { key: '8000', value: 8000 },
      { key: '9000', value: 9000 },
      { key: '10000', value: 10000 },
    ];
  }

  onProgramTypeInput(value: string) {
    this.filteredProgramTypes = this.programTypeOptions.filter(item => item.indexOf(value) >= 0);
  }

  fetchFuzzyOptions(value: string) {
    this.service.fuzzySearch(value).subscribe(result => {
      this.programList = result.list;
    });
  }

  onInput(form: FormGroup) {
    const value = form.value['program_name'];
    const programType = form.get('program_type');
    const find = this.programList.find(item => item.name === value);
    if (find) {
      programType.setValue(find.program_type);
      programType.disable();
    } else {
      form.get('program_type').reset();
      programType.enable();
    }
    this.fetchFuzzyOptions(value);
  }

  onSourceTypeChange() {
    if (this.source_type === 'online') {
      this.fetchFuzzyOptions(this.onlineTapeForm.value['program_name'] || '');
    } else {
      this.fetchFuzzyOptions(this.entityTapeForm.value['program_name'] || '');
    }
  }

  onlineSubmit(): Observable<any> {
    if (this.source_type === 'online') {
      this.tapeVersion = 'online';
      if (this.id === undefined) {
        const data = {
          program_name: this.onlineTapeForm.value['program_name'] || null,
          program_type: this.onlineTapeForm.value['program_type'] || null,
          name: this.onlineTapeForm.value['name'] || null,
          language: this.onlineTapeForm.value['language'] || null,
          subtitle: this.onlineTapeForm.value['subtitle'] || null,
          remark: this.onlineTapeForm.value['remark'] || null,
          // format: this.onlineTapeForm.value['format'] || null,
          // bit_rate: this.onlineTapeForm.value['bit_rate'] || null,
          source_type: 'online',
        };
        return this.service.addTape1(data);
      } else {
        const data = {
          program_id: this.id,
          name: this.onlineTapeForm.value['name'] || null,
          language: this.onlineTapeForm.value['language'] || null,
          subtitle: this.onlineTapeForm.value['subtitle'] || null,
          remark: this.onlineTapeForm.value['remark'] || null,
          // format: this.onlineTapeForm.value['format'] || null,
          // bit_rate: this.onlineTapeForm.value['bit_rate'] || null,
          source_type: 'online',
        };
        return this.service.addTape(data);
      }
    }
  }

  entitySubmit(): Observable<any> {
    if (this.source_type === 'entity') {
      this.tapeVersion = 'entity';
      const etForm = this.entityTapeForm;
      if (this.id === undefined) {
        const ch1 = etForm.value['ch1'] || null;
        const ch2 = etForm.value['ch2'] || null;
        const ch3 = etForm.value['ch3'] || null;
        const ch4 = etForm.value['ch4'] || null;
        const ch5 = etForm.value['ch5'] || null;
        const ch6 = etForm.value['ch6'] || null;
        const storage_date = Util.dateToString(etForm.value['storage_date']);
        this.sound_track = [ch1, ch2, ch3, ch4, ch5, ch6];
        const data = {
          program_name: etForm.value['program_name'] || null,
          program_type: etForm.value['program_type'] || null,
          name: etForm.value['name'] || null,
          language: etForm.value['language'] || null,
          subtitle: etForm.value['subtitle'] || null,
          source_type: 'entity',
          episode: etForm.value['episode'] || null,
          sharpness: etForm.value['sharpness'] || null,
          carrier: etForm.value['carrier'] || null,
          brand: etForm.value['brand'] || null,
          model: etForm.value['model'] || null,
          storage_date: storage_date || null,
          storage_location: etForm.value['storage_location'] || null,
          detail_location: etForm.value['detail_location'] || null,
          sound_track: this.sound_track
        };
        return this.service.addEntityTape1(data);
      } else {
        const ch1 = etForm.value['ch1'] || null;
        const ch2 = etForm.value['ch2'] || null;
        const ch3 = etForm.value['ch3'] || null;
        const ch4 = etForm.value['ch4'] || null;
        const ch5 = etForm.value['ch5'] || null;
        const ch6 = etForm.value['ch6'] || null;
        const storage_date = new DatePipe('zh-CN').transform(etForm.value['storage_date'], 'yyyy-MM-dd');
        this.sound_track = [ch1, ch2, ch3, ch4, ch5, ch6];
        const data = {
          program_id: this.id,
          name: etForm.value['name'] || null,
          language: etForm.value['language'] || null,
          subtitle: etForm.value['subtitle'] || null,
          source_type: 'entity',
          episode: etForm.value['episode'] || null,
          sharpness: etForm.value['sharpness'] || null,
          carrier: etForm.value['carrier'] || null,
          brand: etForm.value['brand'][0] || null,
          model: etForm.value['model'][0] || null,
          storage_date: storage_date || null,
          storage_location: etForm.value['storage_location'] || null,
          detail_location: etForm.value['detail_location'] || null,
          sound_track: this.sound_track
        };
        return this.service.addEntityTape(data);
      }
    }
  }

  validationForm(form: FormGroup) {
    for (const i in form.controls) {
      if (form.controls.hasOwnProperty(i)) {
        const control = form.controls[i];
        control.markAsDirty();
        control.updateValueAndValidity();
      }
    }
    return form.valid;
  }

  cancel() {
    this.component.close();
  }

  save() {
    this.isloading = false;
    if (this.validationForm(this.entityTapeForm)) {
      this.entitySubmit().subscribe(result => {
        this.isloading = true;
        this.message.success(this.translate.instant('global.add-success'));
        this.component.close();
      });
    } else {
      this.isloading = true;
    }
  }

  upload() {
    this.isloading = false;
    if (this.validationForm(this.onlineTapeForm)) {
      this.service.getIpAddress().subscribe(res => {
        const address = res.ip;
        this.localRequestService.status(address).pipe(timeout(5000)).subscribe(z => {
          this.onlineSubmit().subscribe(result => {
            if (address.charAt(0) === '1' && address.charAt(1) === '2' && address.charAt(2) === '7') {
              this.localRequestService.uploadTape(result.id).subscribe(x => {
                this.isloading = true;
                this.component.close();
                // this.message.success(this.translate.instant('global.add-success'));
                this.router.navigate([`/manage/transmit/historic-record/${result.id}`]);
              });
            } else {
            }
          });
        }, err => {
            this.message.success(this.translate.instant('global.start-client'));
            this.isloading = true;
          });
        });
    } else {
      this.isloading = true;
    }
  }


    //   this.onlineSubmit().subscribe(result => {
    //     this.service.getIpAddress().subscribe(res => {
    //       const address = res.ip;
    //       this.localRequestService.status(address).pipe(timeout(5000)).subscribe(z => {
    //         if (address.charAt(0) === '1' && address.charAt(1) === '2' && address.charAt(2) === '7') {
    //           this.localRequestService.uploadTape(result.id).subscribe(x => {
    //             this.isloading = true;
    //             this.component.close();
    //             // this.message.success(this.translate.instant('global.add-success'));
    //             this.router.navigate([`/manage/transmit/historic-record/${result.id}`]);
    //           });
    //         } else {
    //         }
    //       }, err => {
    //         this.message.success(this.translate.instant('global.start-client'));
    //         this.isloading = true;
    //       });
    //     });
    //   });
    // } else {
    //   this.isloading = true;
    // }
}
