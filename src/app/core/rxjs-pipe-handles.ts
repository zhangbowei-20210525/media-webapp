import { HttpErrorResponse } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { OperatorFunction } from 'rxjs';
import { ResponseDto } from '../shared/dtos/response.dto';


export function dtoMapHandle<T, R>(): OperatorFunction<T, R> {
    return map<T, R>(res => {
        const response = res as any;
        if (response && response.code === 0) {
            return response.data;
        }
        throw Error(response.message);
    });
}

export function dtoCatchErrorHandle<T>(): OperatorFunction<T, T> {
    return catchError<T, T>(err => {
        if (err.error.code) {
            throw Error(err.error.message);
        } else {
            throw Error('server error!');
        }
    });
}

/**
 * Dto 转换
 * @param project 返回值选择器
 */
export function dtoMap<T, R>(project: (value: T, index: number) => R): OperatorFunction<T, R> {
    return map<T, R>((value: T, index: number) => {
        if (value instanceof HttpErrorResponse) {
            if (value.error && value.error.code && value.error.code > 0) {
                throw Error(value.error.message);
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
 * @param error 错误语句
 */
export function dtoCatchError<T>(error: string = '服务器错误'): OperatorFunction<T, T> {
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


/**
 * 旧的接口 Dto 转换
 */
export function oldDtoMap<T, R = any>(): OperatorFunction<T, R> {
    return map<T, R>(res => {
        const response = res as any;
        if (response && response.res === 'ok') {
            return response;
        }
        throw Error(response.msg);
    });
}

/**
 * 旧的接口 Dto 错误请求捕获转换
 * @param error 错误语句
 */
export function oldDtoCatchError<T>(error: string = '服务器错误'): OperatorFunction<T, T> {
    return catchError<T, T>(err => {
        if (err instanceof HttpErrorResponse) {
            if (typeof err.error !== 'string') {
                throw Error(err.error.msg);
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
