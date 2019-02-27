export interface RightDetailsDto {
    id: number;
    name: string;
    program_type: string;
    episode: number;
    investment_type: string;
    own_rights: RightDto[];
}

export interface RightDto {
    id: number;
    right_type: string;
    right_type_label: string;
    right_remark: string;
    area_number: string;
    area_label: string;
    area_remark: string;
    permanent_date: boolean;
    start_date: string;
    end_date: string;
    contract_number: string;
    remark: string;
}
