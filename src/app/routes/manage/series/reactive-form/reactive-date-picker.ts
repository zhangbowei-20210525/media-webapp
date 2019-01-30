import { ReactiveBase } from './reactive-base';

export class ReactiveDatePicker extends ReactiveBase<Date> {
  controlType = 'datepicker';
  format: string;

  constructor(options: {} = {}) {
    super(options);
    this.format = options['format'] || [];
  }
}
