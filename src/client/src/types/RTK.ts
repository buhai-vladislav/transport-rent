import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';

type MutationError = FetchBaseQueryError | SerializedError;

interface IMutation<T> {
  data?: T;
  error?: MutationError;
}

export type { IMutation, MutationError };
