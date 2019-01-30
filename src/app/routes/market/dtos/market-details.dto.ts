export interface MarketDetailsDto {
    id: number;

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
    video_poster: string;

    /**
     * 剧集
     */
    program_list: {
        program_id: number,
        program_name: string
        processed: boolean
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
        segment_end_num: number,
        segment_start_frame: number,
        segment_end_frame: number,
        segment_descript: number
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

    /**
  * 公司信息
  */
    // area: CompanyInfoDto;
    /**
   * 用户信息
   */
    // user: UserInfoDto;
    /**
   * 收藏状态
   */
    is_favorite: boolean;
    /**
    *  点赞状态
    */
    is_digg: boolean;
    /**
     * 点赞数量
     */
    digg: number;
    /**
   *类型  PDF 图片 视频
   */
    type: string;
    /**
     *页面图标判断  PDF 图片 视频
     */
    labels: {
        media: boolean,
        poster: boolean,
        pdf: boolean
    };
    medias: {
        program_name: string,
        media_src: string,
        media_poster: string,
    }[];
    posters: {
        poster_name: string,
        img_url: string,
    }[];
    pdfs: {
        pdf_name: string,
        pdf_url: string,
    }[];

    series_type: string;
}
