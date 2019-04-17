export interface ContractPaymentsDto {
  contract_number: string;    // 合同编号
  contract_name: string;      // 合同名称
  total_amount: number;       // 合同总金额
  paid_amount: number;        // 已支付金额
  order_list: {               // 预计收款
    id: number;
    pay_amount: number;       // 交易金额
    pay_date: string;         // 付款时间
    pay_remark: string;       // 备注
  }[];
  payment_list: {             // 实际收款
    id: number;
    pay_amount: number;       // 交易金额
    pay_date: string;         // 付款时间
    pay_remark: string;       // 备注
  }[];
}
