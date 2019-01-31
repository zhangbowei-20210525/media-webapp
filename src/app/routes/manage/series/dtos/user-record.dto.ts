export interface UserRecordDto {
    oid: number;
    user_info: {
        head_image: string;
        nickname: string;
    };
    time: string;
    stay_time: number;
    client: string;
}
