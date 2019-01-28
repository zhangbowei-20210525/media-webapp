/**
 * 返回结构Dto (所有接口)
 */
export class ResponseDto<TData> {

    /**
     * 业务代码，成功：0
     */
    code: number;

    /**
     * 用于用户显示的提示语
     */
    message: string;

    /**
     * 用于开发人员调试的详细信息
     */
    detail: string;

    /**
     * 具体数据
     */
    data: TData;
}
