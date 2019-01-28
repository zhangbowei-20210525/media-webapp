export interface PublicityDetailsDto {
     /**
     * 剧名
     */
    series_name: string;

    /**
     * 集名
     */
    program_name: string;

    /**
     * 媒体文件路径
     */
    media_path: string;

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
     * 分段总数
     */
    segment_page_count: number;

    /**
     * 第一分段图
     */
    first_segment_poster: string;

    /**
     * 剧集
     */
    program_list: {
        program_id: number,
        program_name: string
    }[];

    /**
     * 字幕
     */
    subtitle_list: {
        frame_num: number,
        text: string
    }[];

    /**
     * 人脸
     */
    head_list: {
        head_num: number,
        head_src: string
    }[];

    /**
     * 关键帧
     */
    key_frame_list: {
        key_frame_num: number,
        key_frame_src: string
    }[];

    /**
     * 分段
     */
    segment_list: {
        segment_start_num: number,
        segment_end_num: string
    }[];

    /**
     * 缩略图
     */
    thumb_list: {
        thumb: string,
        frame_id: number,
        program_name: string,
        description: number
    }[];

    /**
     * 基本信息
     */
    series_info: {
        key: string,
        value: string,
        display: string
    }[];

}
