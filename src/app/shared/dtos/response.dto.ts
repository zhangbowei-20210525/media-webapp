interface IResponseDto {
    code: number;
    message: string;
    detail: string;
}

interface PaginationResponseDto<T> {
    list: T[];
    pagination: PaginationDto;
}

export interface PaginationDto {
    count: number;
    page: number;
    pages: number;
    page_size: number;
}

export interface ResponseDto<T> extends IResponseDto {
    data: T;
}

export interface ListResponseDto<T> extends ResponseDto<PaginationResponseDto<T>> { }
