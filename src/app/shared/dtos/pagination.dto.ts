/**
 * 分页信息DTO
 */
export interface PaginationDto {
    /**
     * 总数据数
     */
    count: number;

    /**
     * 当前页码
     */
    page: number;

    /**
     * 总页码
     */
    pages: number;

    /**
     * 页数据数
     */
    page_size: number;
}
