import { SeriesCopyrightDto } from './series-copyright.dto';


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
