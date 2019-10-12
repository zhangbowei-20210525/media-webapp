export interface CopyrightSeriesDto {
    // [key: string]: any;
    episode: number;
    id: number;
    name: string;
    program_type: string;
    investment_type: string;
    rights: CopyrightDto[];
}

export interface CopyrightDto {
    area_label: string;
    area_number: string;
    contract_number: string;
    end_date: string;
    date_remark: string;
    id: number;
    permanent_date: boolean;
    right_type: string;
    right_type_label: string;
    start_date: string;
}



export interface AddCopyrightsDto {
    contract: ContractDto;
    orders: OrderPayDto[];
    programs: ProgramDto[];
}

export interface PublishRightsDto {
    contract_data: ContractDto;
    order_data: OrderPayDto[];
    program_data: ProgramDto[];
}

export interface ContractDto {
    number: string;
    name: string;
    custom_name: string;
    total_amount: number;
    charge_person: string;
    remark: string;
}

export interface OrderPayDto {
    pay_amount: number;
    pay_date: string;
    pay_remark: string;
}

export interface ProgramDto {
    name: string;
    category: string;
    author: string;
    rights: CopyrightDto[];
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

export interface RootTemplateDto {
    code: string;
    name: string;
    status?: boolean;
    disabled?: boolean;
    children?: RootTemplateDto[];
}
