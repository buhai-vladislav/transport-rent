import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import { useEffect } from 'react';
import { toast, ToastOptions } from 'react-toastify';
import { HttpStatus } from '../types/HttpStatus';
import { IResponse } from '../types/Response';
import { DEFAULT_ERROR_MESSAGE } from '../utils/constants';

type HooksError = FetchBaseQueryError | SerializedError | undefined;

export interface IErrorItem {
  status: HttpStatus;
  errorMessage?: string;
  callback?: () => void;
}

export function useErrorToast(
  error: HooksError,
  errorCondition: IErrorItem[],
  toastOptions?: ToastOptions,
) {
  useEffect(() => {
    if (error && 'data' in error) {
      const { statusCode, message } = error.data as Partial<IResponse<unknown>>;

      errorCondition.forEach(({ status, errorMessage, callback }) => {
        if (message && statusCode && statusCode === status) {
          toast(errorMessage ?? message, toastOptions);
          callback && callback();
        }
      });
    }
  }, [error]);
}
