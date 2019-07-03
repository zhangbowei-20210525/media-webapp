import { ReactiveBase } from './reactive-base';

export class ReactiveSilder extends ReactiveBase<Date> {
  controlType = 'silder';
  max: number;
  min: number;
  range: boolean;
  included: boolean;

  constructor(options: {} = {}) {
    super(options);
    this.max = options['max'] || '';
    this.min = options['min'] || '';
    this.range = options['range'] || false;
    this.included = options['included'] || true;
  }
}
