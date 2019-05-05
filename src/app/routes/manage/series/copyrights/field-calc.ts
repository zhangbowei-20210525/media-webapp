import { FormControl } from '@angular/forms';
import { merge, Subscription, of, throwError } from 'rxjs';
import { OnDestroy } from '@angular/core';
import * as _ from 'lodash';
import { zip, mergeMap, map, tap, filter } from 'rxjs/operators';

export interface CalcMethod<T> {
    calc(a: T, b: T): T;
}

export class MultiplyCalcMethod implements CalcMethod<number> {
    calc(a: number, b: number): number {
        return a * b;
    }
}

export class DivideCalcMethod implements CalcMethod<number> {
    calc(a: number, b: number): number {
        return a / b;
    }
}

export class AdditionCalcMethod implements CalcMethod<number> {
    calc(a: number, b: number): number {
        return a + b;
    }
}

export class SubtractionCalcMethod implements CalcMethod<number> {
    calc(a: number, b: number): number {
        return a - b;
    }
}


/**
 * 以 `source1` 为订阅对象，保证一组字段正序符合 `calcMethod` 计算方式
 */
export class FieldCalc implements OnDestroy {
    private subscriptionSource: FormControl;
    private subscription: Subscription;
    private token: string;
    private currentToken: string;

    constructor(
        source1: FormControl,
        source2: FormControl,
        result: FormControl,
        calcMethod: CalcMethod<number> | ((v1: number, v2: number) => number),
        group: CalcGroup
    ) {
        group.registerFieldCalc(this);
        const calc = this.getCalc(calcMethod);
        this.subscriptionSource = source1;
        this.subscription = source1.valueChanges.pipe(filter(value => this.getCurrentToken() !== this.token))
        .subscribe(() => {
            if (source1.valid && source2.valid) {
                if (calc) {
                    if (this.isValidNumber(source1.value) && this.isValidNumber(source2.value)) {
                        group.setOtherCurrentToken(this.token, result);
                        result.setValue(calc(+source1.value, +source2.value));
                    }
                }
            }
        });
    }

    isSubscriptionSource(formControl: FormControl) {
        return this.subscriptionSource === formControl;
    }

    setCalcToken(token: string) {
        this.token = token;
    }

    setCurrentToken(token: string) {
        this.currentToken = token;
    }

    getCurrentToken() {
        const token = this.currentToken;
        this.currentToken = null;
        return token;
    }

    getCalc(calcMethod: CalcMethod<number> | ((v1: number, v2: number) => number)) {
        let calc: Function;
        if (calcMethod instanceof Function) {
            calc = calcMethod;
        } else if (calcMethod && calcMethod.calc instanceof Function) {
            calc = calcMethod.calc;
        }
        return calc;
    }

    isValidNumber(n: string | number) {
        return _.isNumber(n) || (!_.isNull(n) && !_.isUndefined(n) && !_.isEmpty(n) && _.toNumber(n) >= 0);
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}

/**
 * 用来规定一组 `FieldCalc` ，保证其 `valueChanges` 不互相冲突
 */
class CalcGroup {

    private token: string;
    private fieldCalcs: FieldCalc[];

    constructor() {
        this.token = _.uniqueId();
        this.fieldCalcs = [];
    }

    registerFieldCalc(fieldCalc: FieldCalc) {
        this.fieldCalcs.push(fieldCalc);
        fieldCalc.setCalcToken(this.token);
    }

    getToken() {
        return this.token;
    }

    setOtherCurrentToken(token: string, result: FormControl) {
        const fieldCalc = this.fieldCalcs.find(item => item.isSubscriptionSource(result));
        if (fieldCalc) {
            fieldCalc.setCurrentToken(token);
        }
    }
}

/**
 * 字段运算组，保证3个字段值之间互相影响，第一个会为固定值
 */
export class FieldCalcGroup implements OnDestroy {

    protected control1Calc: FieldCalc;
    protected control2Calc: FieldCalc;
    protected control3Calc: FieldCalc;

    ngOnDestroy(): void {
        this.control1Calc.ngOnDestroy();
        this.control2Calc.ngOnDestroy();
        this.control3Calc.ngOnDestroy();
    }
}

/**
 * 乘除法字段运算组
 */
export class FieldMultiplyCalcGroup extends FieldCalcGroup {
    constructor(
        control1: FormControl,
        control2: FormControl,
        control3: FormControl,
    ) {
        super();
        const calcGroup = new CalcGroup();
        this.control1Calc = new FieldCalc(control2, control1, control3, new MultiplyCalcMethod(), calcGroup);
        this.control2Calc = new FieldCalc(control3, control1, control2, new DivideCalcMethod(), calcGroup);
        this.control3Calc = new FieldCalc(control1, control2, control3, new MultiplyCalcMethod(), calcGroup);
    }
}

/**
 * 加减法字段运算组
 */
export class FieldAdditionCalcGroup extends FieldCalcGroup {
    constructor(
        control1: FormControl,
        control2: FormControl,
        control3: FormControl,
    ) {
        super();
        const calcGroup = new CalcGroup();
        this.control1Calc = new FieldCalc(control2, control1, control3, new AdditionCalcMethod(), calcGroup);
        this.control2Calc = new FieldCalc(control3, control1, control2, new SubtractionCalcMethod(), calcGroup);
        this.control3Calc = new FieldCalc(control1, control2, control3, new AdditionCalcMethod(), calcGroup);
    }
}
