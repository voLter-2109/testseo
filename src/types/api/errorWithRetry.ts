import { InternalAxiosRequestConfig } from 'axios';

export interface ErrorWithRetry<D = any> extends InternalAxiosRequestConfig<D> {
  isRetry?: boolean;
}
