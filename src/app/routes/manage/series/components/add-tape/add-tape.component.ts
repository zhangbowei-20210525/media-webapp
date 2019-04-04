import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SeriesService } from '../../series.service';
import { MentionOnSearchTypes } from 'ng-zorro-antd';
import { Observable } from 'rxjs';
import { NullAstVisitor } from '@angular/compiler';
import { DatePipe } from '@angular/common';

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
  source_type: string;
  listOfOption = [];
  sound_track = [];
  programList = [];
  disabled: boolean;
  info: any;
  tapeVersion: string;

  constructor(
    private fb: FormBuilder,
    private service: SeriesService,
  ) {
    this.onlineTapeForm = this.fb.group({
      program_name: [null, [Validators.required]],
      program_type: [null, [Validators.required]],
      name: [null, [Validators.required]],
      language: [null],
      subtitle: [null],
      format: [null],
      bit_rate: [null],
    });

    this.entityTapeForm = this.fb.group({
      program_name: [  null, [Validators.required]],
      program_type: [ null, [Validators.required]],
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
   }

  ngOnInit() {
    this.source_type = 'online';
    if ( this.id === undefined ) {
      this.onlineTapeForm = this.fb.group({
        program_name: [null, [Validators.required]],
        program_type: [null, [Validators.required]],
        name: [null, [Validators.required]],
        language: [null],
        subtitle: [null],
        format: [null],
        bit_rate: [null],
      });
      this.entityTapeForm = this.fb.group({
        program_name: [  null, [Validators.required]],
        program_type: [ null, [Validators.required]],
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
    } else {
      this.service.getSeriesDetailsInfo(this.id).subscribe(result => {
        this.onlineTapeForm = this.fb.group({
          program_name: [{value: result.name, disabled: true}, [Validators.required]],
          program_type: [result.program_type, [Validators.required]],
          name: [null, [Validators.required]],
          language: [null],
          subtitle: [null],
          format: [null],
          bit_rate: [null],
        });
        this.entityTapeForm = this.fb.group({
          program_name: [{value: result.name, disabled: true}, [Validators.required]],
          program_type: [result.program_type, [Validators.required]],
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
        this.disabled = true;
  });
}


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

  onInput() {
    this.service.fuzzySearch(this.onlineTapeForm.value['program_name']).subscribe(s => {
      this.programList = s.list;
      if (this.disabled === true) {
        this.disabled = false;
        this.onlineTapeForm = this.fb.group({
          program_name: [this.onlineTapeForm.value['program_name'], [Validators.required]],
          program_type: [null, [Validators.required]],
          name: [null, [Validators.required]],
          language: [null],
          subtitle: [null],
          format: [null],
          bit_rate: [null],
        });
      }
      this.programList.forEach(pf => {
        if (this.onlineTapeForm.value['program_name'] === pf.name) {
          this.id = pf.id;
          console.log(this.id);
          this.onlineTapeForm = this.fb.group({
            program_name: [this.onlineTapeForm.value['program_name'], [Validators.required]],
            program_type: [pf.program_type, [Validators.required]],
            name: [null, [Validators.required]],
            language: [null],
            subtitle: [null],
            format: [null],
            bit_rate: [null],
          });
          this.disabled = true;
        }
      });
    });
  }

  enInput() {
    this.service.fuzzySearch(this.entityTapeForm.value['program_name']).subscribe(s => {
      this.programList = s.list;
      if (this.disabled === true) {
        this.disabled = false;
        this.entityTapeForm = this.fb.group({
          program_name: [this.entityTapeForm.value['program_name'], [Validators.required]],
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
      }
      this.programList.forEach(pf => {
        if (this.entityTapeForm.value['program_name'] === pf.name) {
          this.id = pf.id;
          console.log(this.id);
          this.entityTapeForm = this.fb.group({
            program_name: [this.entityTapeForm.value['program_name'], [Validators.required]],
            program_type: [pf.program_type, [Validators.required]],
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
          this.disabled = true;
        }
      });
    });
  }

  formSubmit(): Observable<any> {
    if (this.source_type === 'online') {
      this.tapeVersion = 'online';
      const otForm = this.onlineTapeForm;
      for (const i in otForm.controls) {
        if (otForm.controls.hasOwnProperty(i)) {
          const control = otForm.controls[i];
          control.markAsDirty();
          control.updateValueAndValidity();
        }
      }
      if (this.id === undefined) {
        const data = {
          program_name: this.onlineTapeForm.value['program_name'] || null,
          program_type: this.onlineTapeForm.value['program_type'] || null,
          name: this.onlineTapeForm.value['name'] || null,
          language: this.onlineTapeForm.value['language'] || null,
          subtitle: this.onlineTapeForm.value['subtitle'] || null,
          format: this.onlineTapeForm.value['format'] || null,
          bit_rate: this.onlineTapeForm.value['bit_rate'] || null,
          source_type: 'online',
        };
        if (this.onlineTapeForm.valid === true) {
          return this.service.addTape1(data);
        } else {
          return Observable.create(() => { throw Error('otForm invalid'); });
        }

      } else {
        const data = {
          program_id: this.id,
          name: this.onlineTapeForm.value['name'] || null,
          language: this.onlineTapeForm.value['language'] || null,
          subtitle: this.onlineTapeForm.value['subtitle'] || null,
          format: this.onlineTapeForm.value['format'] || null,
          bit_rate: this.onlineTapeForm.value['bit_rate'] || null,
          source_type: 'online',
        };
        if (this.onlineTapeForm.valid === true) {
          return this.service.addTape(data);
        } else {
          return Observable.create(() => { throw Error('otForm invalid'); });
        }
      }
    }

    if (this.source_type === 'entity') {
      this.tapeVersion = 'entity';
      const etForm = this.entityTapeForm;
      for (const i in etForm.controls) {
        if (etForm.controls.hasOwnProperty(i)) {
          const control = etForm.controls[i];
          control.markAsDirty();
          control.updateValueAndValidity();
        }
      }

      if (this.id === undefined) {
        const ch1 = etForm.value['ch1'] || null;
        const ch2 = etForm.value['ch2'] || null;
        const ch3 = etForm.value['ch3'] || null;
        const ch4 = etForm.value['ch4'] || null;
        const ch5 = etForm.value['ch5'] || null;
        const ch6 = etForm.value['ch6'] || null;
        const storage_date = new DatePipe('zh-CN').transform(etForm.value['storage_date'], 'yyyy-MM-dd');
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
        if (etForm.valid === true) {
          return this.service.addEntityTape1(data);
        } else {
          return Observable.create(() => { throw Error('etForm invalid'); });
        }
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
          brand: etForm.value['brand'] || null,
          model: etForm.value['model'] || null,
          storage_date: storage_date || null,
          storage_location: etForm.value['storage_location'] || null,
          detail_location: etForm.value['detail_location'] || null,
          sound_track: this.sound_track
        };
        if (etForm.valid === true) {
          return this.service.addEntityTape(data);
        } else {
          return Observable.create(() => { throw Error('etForm invalid'); });
        }
      }
    }
  }
}
