import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { ReactiveBase, FormControlService, TreeService, MessageService, Util, ScrollService } from '@shared';
import { TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs/operators';

import * as _ from 'lodash';
import { ActivatedRoute } from '@angular/router';
import { RootTemplateDto, ContractDto } from '../dtos';
import { NzModalService } from 'ng-zorro-antd';
import { IpManagementService } from '../ip-management.service';
import { FieldCalcGroup, FieldAdditionCalcGroup } from '../../series/copyrights/field-calc';

@Component({
    selector: 'app-add-ip',
    templateUrl: './add-ip.component.html',
    styles: [`
    .block-operations {
      width: 100%;
      padding: 0.5rem;
      margin-bottom: 1rem;
      // background-color: #e6f7ff;
    }
    .ant-form-item {
      margin-bottom: 5px;
    }
  `]
})
export class AddIpComponent implements OnInit {

    @ViewChild('contractFormRef') contractFormRef: ElementRef<HTMLFormElement>;
    @ViewChild('paymentFormRef') paymentFormRef: ElementRef<HTMLFormElement>;
    @ViewChild('rightFormRef') rightFormRef: ElementRef<HTMLFormElement>;

    tab: number;
    series: any[];
    customerOptions: any[];
    filteredCustomerOptions: string[];
    areaTemplates: RootTemplateDto[];
    contractForm: FormGroup;
    paymentForm: FormGroup;
    rightForm: FormGroup;
    payments: ReactiveBase<any>[][];
    indeterminate = false;
    checkOptions: any;
    dataSet = [];
    isSaving: boolean;
    isSaved = false;
    programOfOptions: any;
    fieldCalcGroups: FieldCalcGroup[];
    id: number;
    isShowMore = false;



    ipTypeOption = [
        '小说',
        '剧本',
        '电视剧',
        '电影',
        '动画',
        '漫画',
        '游戏',
        '综艺',
        '舞台剧',
        '纪录片',
    ];

    rightOption = ['改编权', '著作权'];

    constructor(
        private fb: FormBuilder,
        private service: IpManagementService,
        private fcs: FormControlService,
        private ts: TreeService,
        private translate: TranslateService,
        private message: MessageService,
        private scroll: ScrollService,
        private route: ActivatedRoute,
        private modal: NzModalService,
    ) { }

    get projects() {
        return this.rightForm.get('projects') as FormControl;
    }

    get projectsAllChecked() {
        return this.rightForm.get('projectsAllChecked') as FormControl;
    }

    ngOnInit() {
        this.contractForm = this.fb.group({
            customer: [null, [Validators.required]],
            totalAmount: [null, [Validators.pattern(/^[1-9]{1}\d*(.\d{1,2})?$|^0.\d{1,2}$/)]],
            paymentMethod: [null],
            contractName: [null],
            contractNumber: [null],
            signDate: [new Date(), Validators.required],
            chargePerson: [null]          // 经办人
        });

        this.rightForm = this.fb.group({
            originalAuthor: [null],
            ipType: [null, [Validators.required]],
            projects: [null, [Validators.required]],
            copyright: [null, [Validators.required]],
            copyrightIsSole: [false],
            copyrightNote: [null],
            copyrightArea: [null, [Validators.required]],
            copyrightAreaNote: [null],
            copyrightValidTerm: [null],
            copyrightValidTermIsPermanent: [false],
            copyrightValidTermNote: [null],
            note: [null]
        });
        this.route.paramMap.subscribe(params => {
            this.id = +params.get('id');
          });
          if (this.id === -1) {

          } else {
            this.service.getIpInfo(this.id).subscribe(result => {
                this.rightForm.get('originalAuthor').setValue(result.author);
                this.rightForm.get('ipType').setValue(result.category);
                const arr = [];
                arr.push(result.name);
                this.rightForm.get('projects').setValue(arr);
                this.rightForm.get('originalAuthor').disable();
                this.rightForm.get('ipType').disable();
                this.rightForm.get('projects').disable();
              });
          }
        this.service.getCustomerOptions().subscribe(result => {
            this.customerOptions = result.list;
            this.filteredCustomerOptions = result.list.map(c => c.name);
        });

        this.service.getCopyrightAreaOptions().subscribe(result => {
            if (result) {
                this.service.setLeafNode(result);
            }
            this.areaTemplates = result;
        });

        this.service.getProjectName().subscribe(result => {
            this.programOfOptions = result.list;
        });
    }

    getContractFormFields(...keys: string[]) {
        return keys.map(k => this.contractForm.get(k) as FormControl);
    }

    onCustomerInput(value: string) {
        this.filteredCustomerOptions = this.customerOptions.filter(item => item.name.indexOf(value) >= 0).map(item => item.name);
    }

    seriesTagChange(event: { checked: boolean, tag: any }) {
        event.tag.status = event.checked;
        const selected = this.series ? this.series.filter(e => e.status) : [];
        this.checkOptions = selected.map(item => ({ label: item.name, value: item.id, checked: true, episodes: item.episodes }));
        this.projects.setValue(this.checkOptions);
    }

    updateAllChecked() {
        this.indeterminate = false;
        if (this.projectsAllChecked.value) {
            this.checkOptions.forEach(item => item.checked = true);
        } else {
            this.checkOptions.forEach(item => item.checked = false);
        }
    }

    updateSingleChecked() {
        if (this.checkOptions.every(item => item.checked === false)) {
            this.projectsAllChecked.setValue(false);
            this.indeterminate = false;
        } else if (this.checkOptions.every(item => item.checked === true)) {
            this.projectsAllChecked.setValue(true);
            this.indeterminate = false;
        } else {
            this.indeterminate = true;
        }
    }

    next() {
        this.tab = 1;
    }

    onPaymentMethodChange(value: string) {
        const count = parseInt(value, 10);
        if (count >= 0) {
            this.payments = this.service.getCopyrightPaymentReactives(count);
            this.payments[count - 1].find(item => item.key.startsWith('money')).readonly = true;
            const fg = {};
            this.payments.map(p => this.fcs.toFormGroup(p)).forEach(p => {
                const c = p.controls;
                for (const key in c) {
                    if (c.hasOwnProperty(key)) {
                        fg[key] = c[key];
                    }
                }
            });
            this.paymentForm = this.fb.group(fg);
            this.setAmounts();
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

    resetCopyrightForm() {
        this.rightForm.reset();
    }

    addList() {
        if (this.validationForm(this.rightForm)) {
            const checkedAreas = this.rightForm.get('copyrightArea').value as Array<any>;
            const area = this.ts.recursionNodesFindBy(this.areaTemplates, node => node.code === checkedAreas[checkedAreas.length - 1]);
            const term = this.rightForm.get('copyrightValidTerm').value;
            let startDate: any, endDate: any;
            if (term) {
                startDate = term[0];
                endDate = term[1];
            }
            const list = this.projects.value.map(name => {
                return {
                    originalAuthor: this.rightForm.get('originalAuthor').value,
                    name: name,
                    type: this.rightForm.get('ipType').value,
                    area: area.code,
                    term: term,
                    copyright: this.rightForm.get('copyright').value,
                    termIsPermanent: this.rightForm.get('copyrightValidTermIsPermanent').value,
                    note: this.rightForm.get('note').value,
                    rightNote: this.rightForm.get('copyrightNote').value,
                    areaNote: this.rightForm.get('copyrightAreaNote').value,
                    termNote: this.rightForm.get('copyrightValidTermNote').value,
                    displayArea: area.name,
                    termStartDate: startDate,
                    termEndDate: endDate
                };
            });
            this.dataSet = [...this.dataSet, ...list];
        } else {
            this.scroll.scrollToElement(this.rightFormRef.nativeElement, -20);
        }
    }

    resetList() {
        this.contractForm.reset();
    }

    hasContract() {

    }

    save() {
        if (this.validationForm(this.contractForm)) {
            if (this.paymentForm) {
                if (this.validationForm(this.paymentForm)) {
                    if (this.dataSet.length > 0) {
                        this.saveCopyrights(true);
                    } else {
                        this.message.warning('请先"添加"');
                    }
                } else {
                    this.scroll.scrollToElement(this.paymentFormRef.nativeElement, -20);
                }
            } else {
                if (this.dataSet.length > 0) {
                    this.saveCopyrights(true);
                } else {
                    this.message.warning('请先"添加"');
                }
            }
        } else {
            this.scroll.scrollToElement(this.contractFormRef.nativeElement, -20);
        }
    }

    saveCopyrights(hasContract: boolean) {
        this.isSaving = true;
        let contract = {} as ContractDto, orders = null, programs = null;

        if (hasContract) {
            contract = {
                custom_name: this.contractForm.value['customer'],
                // sign_date: Util.dateToString(this.contractForm.value['signDate']),
                number: this.contractForm.value['contractNumber'],
                name: this.contractForm.value['contractName'],
                charge_person: this.contractForm.value['chargePerson'],
                total_amount: this.contractForm.value['totalAmount'],
                remark: null
            };

            if (this.payments) {
                orders = this.payments.map(paymentObjArr => {
                    const arr = paymentObjArr.map(item => this.paymentForm.value[item.key]);
                    return this.service.toOrderData(+arr[1], Util.dateToString(arr[0]), arr[3]); // 来自页面字段顺序
                });
            }
        }

        const groupData = this.service.groupBy(this.dataSet, item => item.id);
        // const nullId = groupData.find(item => item[0].id === null);
        // if (nullId) {
        //     groupData.splice(groupData.indexOf(nullId), 1);
        //     this.service.groupBy(nullId, item => item.name).forEach(item => groupData.push(item));
        // }
        programs = groupData.map(group => {
            const first = group[0];
            const program = this.service.toProgramData(
              first.name,
              first.type,
              first.originalAuthor,
              group.map(item => {
                return this.service.toCopyrightData(
                    item.copyright,
                    item.rightNote,
                    item.area,
                    item.areaNote,
                    item.termIsPermanent,
                    Util.dateToString(item.termStartDate),
                    Util.dateToString(item.termEndDate),
                    item.termNote,
                    item.note,
                  );
              })
            );
            return program;
          });

        if (programs.length > 0) {
            this.service.addIp(this.service.toAddCopyrightsData(contract, orders, programs))
                .pipe(finalize(() => this.isSaving = false))
                .subscribe(result => {
                    this.isSaved = true;
                    this.dataSet = [];
                    if (this.paymentForm) {
                        this.paymentForm.reset();
                    }
                    this.contractForm.reset();
                    this.payments = null;
                    this.message.success(this.translate.instant('global.save-successfully'));
                });
        } else {
            this.isSaving = false;
        }
    }

    deleteRight(item: any) {
        this.dataSet = this.dataSet.filter(d => d !== item);
    }

    onMoneyChange(value: string, key: string) {
        this.setAmounts();
    }

    onTotalAmountChange(value: string) {
        if (!this.paymentForm) {
            return;
        }
        this.setAmounts();
    }

    setAmounts() {
        let hasValue = true;
        const allKeys = _.flatten(this.payments).filter(item => item.key.startsWith('money')).map(item => item.key);
        const lastKey = allKeys[allKeys.length - 1];
        allKeys.filter(item => item !== lastKey).forEach(item => {
            const field = this.paymentForm.get(item);
            if (!(typeof field.value === 'string' && field.value.length > 0 && field.valid)) {
                hasValue = false;
            }
        });
        if (hasValue) {
            let otherTotalValue = 0;
            allKeys.filter(item => item !== lastKey).forEach(item => otherTotalValue += +this.paymentForm.value[item]);
            const lastField = this.paymentForm.get(lastKey) as FormControl;
            const lastValue = +this.contractForm.value['totalAmount'] - otherTotalValue;
            const totalAountField = this.contractForm.get('totalAmount');
            if (lastValue < 0) {
                totalAountField.setErrors({ totalInvalid: true });
            } else {
                totalAountField.markAsDirty();
                totalAountField.updateValueAndValidity();
            }
            lastField.setValue(lastValue, { emitViewToModelChange: false });
            lastField.markAsDirty();
            lastField.updateValueAndValidity();
            allKeys.forEach(item => {
                const percentKey = 'percent' + _.trimStart(item, 'money');
                const percent = (+this.paymentForm.value[item] / +this.contractForm.value['totalAmount']) * 100;
                this.paymentForm.get(percentKey).setValue(_.floor(percent, 2) + '%');
            });
        }
    }
    seeMore() {
        this.isShowMore = true;
    }
    retractMore() {
        this.isShowMore = false;
    }

}
