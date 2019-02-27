import { ReactiveBase } from './reactive-base';

export class ReactiveTextbox extends ReactiveBase<string> {
  controlType = 'textbox';
  type: string;
  reg: string | RegExp;

  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';
    this.reg = options['reg'] || undefined;
  }
}
