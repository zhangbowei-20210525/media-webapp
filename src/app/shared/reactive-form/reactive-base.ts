export class ReactiveBase<T> {
  value: T;
  key: string;
  label: string;
  required: boolean;
  pattern: boolean;
  order: number;
  controlType: string;
  customerType: string;
  disabled: boolean;
  readonly: boolean;

  constructor(options: {
    value?: T,
    key?: string,
    label?: string,
    required?: boolean,
    order?: number,
    controlType?: string,
    customerType?: string,
    disabled?: boolean,
    readonly?: boolean,
  } = {}) {
    this.value = options.value;
    this.key = options.key || '';
    this.label = options.label || '';
    this.required = !!options.required;
    this.order = options.order === undefined ? 1 : options.order;
    this.controlType = options.controlType || '';
    this.customerType = options.customerType || '';
    this.disabled = !!options.disabled;
    this.readonly = !!options.readonly;
  }
}
