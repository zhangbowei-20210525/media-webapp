export interface SeriesCopyrightDto {
    series_id: number;
    series_name: string;
    series_type: string;
    episodes_num: string;
    investment_type: string;
    right_list: {
        right_type: string;
        right_remark: string;
        area_numbers: string;
        area_remark: string;
        start_date: string;
        end_date: string;
        is_permanent: boolean;
        period_remark: string;
    }[];
}

export interface ContractCopyrightDto {
    has_contract: boolean;
    contract_name: string;
    contract_number: string;
    customer_id: number;
    total_amount: number;
    order_list: {
        pay_date: string,
        pay_amount: number
    }[];
    series_list: SeriesCopyrightDto[];
}


export interface UserRecordDto {
    oid: number;
    user_info: {
        head_image: string;
        nickname: string;
    };
    time: string;
    stay_time: number;
    client: string;
}
