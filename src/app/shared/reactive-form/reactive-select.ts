import { ReactiveBase } from './reactive-base';

export class ReactiveSelect extends ReactiveBase<Date> {
    controlType = 'select';

    constructor(options: {} = {}) {
      super(options);
    }
}
