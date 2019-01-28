export interface PublicityDto {
    /**
     * 媒体Id
     */
    id: number;

    /**
     * 标题
     */
    series_name: string;

    /**
     * 状态
     */
    status: string;

    /**
     * 发行公司
     */
    group: string;

    /**
     * 主演
     */
    key_person: string;

    /**
     * 封面
     */
    surface_image: string;

    /**
     * 剧集
     */
    list: { id: number, program_name: string, processed: boolean }[];
    /**
     * 三种类型
     */
    labels: {
        media: number,
        poster: number,
        pdf: number
    };
    type: string;
}
