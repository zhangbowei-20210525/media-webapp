export interface ResponseDto<TData> {
    code: number;
    message: string;
    detail: string;
    data: TData;
}
