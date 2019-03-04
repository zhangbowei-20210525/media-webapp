export interface NotifyDto {
    id: number;
    group: string;
    type: string;
    content: string;
    receive_id: number;
    receive_name: string;
    related_id: number;
    is_read: boolean;
    read_at: string;
    is_detail: boolean;
    is_process: boolean;
    created_id: number;
    created_name: string;
    created_at: string;
    count: number;
    image: string;
}