import { FormControl } from '@angular/forms';
import { merge, Subscription } from 'rxjs';
import { OnDestroy } from '@angular/core';
import * as _ from 'lodash';

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


export class FieldCalc implements OnDestroy {
    private subscription: Subscription;
    private token: string;
    constructor(
        source1: FormControl,
        source2: FormControl,
        result: FormControl,
        calcMethod: CalcMethod<number> | ((v1: number, v2: number) => number),
        // options?: {
        //     onlySelf?: boolean;
        //     emitEvent?: boolean;
        //     emitModelToViewChange?: boolean;
        //     emitViewToModelChange?: boolean;
        // }
        group: CalcGroup
    ) {
        const calc = this.getCalc(calcMethod);
        // merge(source1.valueChanges, source2.valueChanges)
        this.subscription = source1.valueChanges.pipe().subscribe(() => {
            if (source1.valid && source2.valid) {
                if (calc) {
                    if (this.isValidNumber(source1.value) && this.isValidNumber(source2.value)) {
                        result.setValue(calc(+source1.value, +source2.value), { emitEvent: false });
                    }
                }
            }
        });
    }

    setCalcToken(token: string) {
        this.token = token;
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

    isValidNumber(n: string) {
        return !_.isNull(n) && !_.isUndefined(n) && !_.isEmpty(n) && _.toNumber(n) >= 0;
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}

class CalcGroup {

    private token: string;

    constructor() {
        this.token = _.uniqueId();
    }

    public getToken() {
        return this.token;
    }
}

export class FieldMultiplyCalcGroup implements OnDestroy {

    private control1Calc: FieldCalc;
    private control2Calc: FieldCalc;
    private control3Calc: FieldCalc;

    constructor(
        control1: FormControl,
        control2: FormControl,
        control3: FormControl,
    ) {
        const calcGroup = new CalcGroup();
        this.control1Calc = new FieldCalc(control2, control1, control3, new MultiplyCalcMethod(), calcGroup);
        this.control2Calc = new FieldCalc(control3, control1, control2, new DivideCalcMethod(), calcGroup);
        this.control3Calc = new FieldCalc(control1, control2, control3, new MultiplyCalcMethod(), calcGroup);
    }

    ngOnDestroy(): void {
        this.control1Calc.ngOnDestroy();
        this.control2Calc.ngOnDestroy();
        this.control3Calc.ngOnDestroy();
    }
}


export class FieldAdditionCalcGroup implements OnDestroy {

    private control1Calc: FieldCalc;
    private control2Calc: FieldCalc;
    private control3Calc: FieldCalc;

    constructor(
        control1: FormControl,
        control2: FormControl,
        control3: FormControl,
    ) {
        this.control1Calc = new FieldCalc(control2, control1, control3, new AdditionCalcMethod(), null);
        this.control2Calc = new FieldCalc(control3, control1, control2, new SubtractionCalcMethod(), null);
        this.control3Calc = new FieldCalc(control1, control2, control3, new AdditionCalcMethod(), null);
    }

    ngOnDestroy(): void {
        this.control1Calc.ngOnDestroy();
        this.control2Calc.ngOnDestroy();
        this.control3Calc.ngOnDestroy();
    }
}
