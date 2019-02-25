export interface AddCopyrightsDto {
    contract_data: ContractDto;
    order_data: OrderPayDto[];
    program_data: ProgramDto[];
}

export interface ContractDto {
    contract_number: string;
    contract_name: string;
    remark: string;
    custom_id: number;
}

export interface OrderPayDto {
    pay_amount: number;
    pay_date: string;
    pay_remark: string;
}

export interface ProgramDto {
    program_id: number;
    program_name: string;
    program_type: string;
    episodes: number;
    investment_type: string;
    right_data: CopyrightDto[];
}

export interface CopyrightDto {
    right_type: string;
    right_remark: string;
    area_number: string;
    area_remark: string;
    permanent_date: boolean;
    start_date: string;
    end_date: string;
    date_remark: string;
    remark: string;
}
