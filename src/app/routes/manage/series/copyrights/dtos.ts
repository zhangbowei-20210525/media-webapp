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
    contract_data: ContractDto;
    order_data: OrderPayDto[];
    program_data: ProgramDto[];
}

export interface PublishRightsDto {
    contract_data: ContractDto;
    order_data: OrderPayDto[];
    program_data: ProgramDto[];
}

export interface ContractDto {
    contract_number: string;
    contract_name: string;
    remark: string;
    custom_name: string;
    sign_date: string;
    total_amount: number;
    total_episodes: number;
    episode_price: number;
    total_episodes_price: number;
    tape_mail_price: number;
    total_tape_mail_price: number;
    charge_person: string;
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
    sole: boolean;
    right_type: string;
    child_rights: string[];
    right_remark: string;
    area_number: string;
    area_remark: string;
    permanent_date: boolean;
    start_date: string;
    end_date: string;
    date_remark: string;
    broadcast_channel?: string;
    air_date?: string;
    remark: string;
}

export interface RootTemplateDto {
    code: string;
    name: string;
    status?: boolean;
    disabled?: boolean;
    children?: RootTemplateDto[];
}
