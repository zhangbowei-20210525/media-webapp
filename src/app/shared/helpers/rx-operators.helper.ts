import { OperatorFunction } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { ResponseDto } from '@shared';

/**
 * Dto map
 * @param project 返回值选择器
 */
export function dtoMap<T, R>(project: (value: T, index: number) => R): OperatorFunction<T, R> {
    return map<T, R>((value: T, index: number) => {
        if (value instanceof HttpErrorResponse) {
            throw value;
        } else {
            const response = value as any as ResponseDto<R>;
            if (response && response.code === 0) {
                return project(value, index);
            }
            throw Error(response.message);
        }
    });
}

/**
 * Dto 错误请求捕获转换
 * @param errorMessage 默认错误提示
 */
export function dtoCatchError<T>(errorMessage: string = 'server error'): OperatorFunction<T, T> {
    return catchError<T, T>(err => {
        if (err instanceof HttpErrorResponse) {
            if (typeof err.error !== 'string') {
                throw Error(err.error.message);
            } else {
                console.error(err.message);
                throw Error(errorMessage);
            }
        } else if (err instanceof Error) {
            throw err;
        } else {
            throw Error(errorMessage);
        }
    });
}
