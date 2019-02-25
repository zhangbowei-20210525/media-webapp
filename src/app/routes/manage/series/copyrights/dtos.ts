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
