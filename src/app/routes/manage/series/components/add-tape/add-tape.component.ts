import { Component, OnInit, Input } from '@angular/core';
import { TapeDto } from '../../dtos/tape.dto';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SeriesService } from '../../series.service';
import { MentionOnSearchTypes } from 'ng-zorro-antd';
import { Observable } from 'rxjs';
import { NullAstVisitor } from '@angular/compiler';

@Component({
  selector: 'app-add-tape',
  templateUrl: './add-tape.component.html',
  styleUrls: ['./add-tape.component.less']
})
export class AddTapeComponent implements OnInit {

  @Input() id: number;
  onlineTapeForm: FormGroup;
  entityTapeForm: FormGroup;
  source_type: string;
  listOfOption = [];

  constructor(
    private fb: FormBuilder,
    private seriesService: SeriesService,
  ) {}

  ngOnInit() {
    this.source_type = 'online';
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

    this.onlineTapeForm = this.fb.group({
      name: [null, [Validators.required]],
      language: [null],
      subtitle: [null],
      format: [null],
      bit_rate : [null],
    });

    this.entityTapeForm = this.fb.group({
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

  formSubmit(): Observable<any> {
    if (this.source_type === 'online') {
      const otForm = this.onlineTapeForm;
      for (const i in otForm.controls) {
        if (otForm.controls.hasOwnProperty(i)) {
          const control = otForm.controls[i];
          control.markAsDirty();
          control.updateValueAndValidity();
        }
      }
        const data = {
          program_id: this.id,
          name: otForm.value['name'] || null,
          language: otForm.value['language'] || null,
          subtitle: otForm.value['subtitle'] || null,
          format: otForm.value['format'] || null,
          bit_rate : otForm.value['bit_rate'] || null,
          source_type:  'online',
        };
        if (otForm.valid === true) {
          return this.seriesService.addTape(data);
        } else {
          return Observable.create(() => { throw Error('otForm invalid'); });
        }
    }
    }
}
