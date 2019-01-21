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
            if (value.error && value.error.code && value.error.code > 0) {
                throw Error(value.error.message || value.message);
            } else {
                throw Error(value.message);
            }
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
 * @param error 默认错误提示
 */
export function dtoCatchError<T>(error: string = 'server error'): OperatorFunction<T, T> {
    return catchError<T, T>(err => {
        if (err instanceof HttpErrorResponse) {
            if (typeof err.error !== 'string') {
                throw Error(err.error.message);
            } else {
                throw Error(error);
            }
        } else if (err instanceof Error) {
            throw err;
        } else {
            throw Error(error);
        }
    });
}
