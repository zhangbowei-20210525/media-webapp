export interface DashboardDto {
    code: string;
    name: string;
    status: boolean;
    children: DashboardDto[];
    // meta: {
    //     area_number_choices: [];
    //     year_choices: [];
    // };
}
