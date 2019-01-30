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
