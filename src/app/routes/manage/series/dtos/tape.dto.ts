/**
 * 母带Dto
 */
export interface TapeDto {
    /**
     * 母带ID
     */
    id: number;

    /**
     * 母带封面
     */
    image: string;

     /**
     * 节目类型
     */
    program_type: string;

    /**
     * 母带名
     */
    series_name: string;

    /**
     * 母带集数
     */
    episode: number;

    /**
     * 母带类型
     */
    source_type: string;

    /**
     * 母带字幕类型
     */
    subtitle: string;

     /**
     * 声轨
     */
    sound_track: [];

     /**
     * 清晰度
     */
    sharpness: string;

    /**
     * 载体
     */
    carrier: string;

    /**
     * 品牌
     */
    brand: string;

     /**
     * 型号
     */
    model: string;

    /**
     * 入库时间
     */
    storage_date: string;

     /**
     * 存放地点
     */
    storage_location: string;

     /**
     * 具体位置
     */
    detail_location: string;

    /**
     * 母带语言
     */
    language: string;

    /**
    * 上传公司
    */
    area_name: string;

    /**
     * 下载次数
     */
    download_times: number;

    /**
     * 上载人
     */
    uploader_name: string;

    /**
     * 是否正在上载
     */
    has_upload_task: boolean;

    /**
     * 正在上载的集数
     */
    upload_task_num: number;

    /**
     * 是否正在下载
     */
    has_download_task: boolean;
    /**
     * 手机授权状态
     */
    auth_status: number;
    /**
    * 下载人个数
    */
    download_user_num: number;
    /**
    * 下载文件个数
    */
    download_task_num: number;
    /**
    * 码率
    */
    bit_rate: number;
    /**
    * 格式
    */
    format: string;
    /**
    * 是否二次分发
    */
    distributable: boolean;
    /**
    * 分发类型
    */
    auth_type: number;
    folderName: string;
    issued_status: boolean;
}
