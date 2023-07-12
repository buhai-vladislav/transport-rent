import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import type { IAffectedResult, IResponse } from '../../types/Response';
import type { IUser } from '../../types/User';
import type { ISignIn, ISignInResponse, ISignUp } from '../../types/Auth';
import { IImage } from '../../types/Image';
import { resetUser } from '../reducers/user';

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.REACT_APP_API_HOST,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('accessToken');

    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }

    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (typeof args !== 'string') {
    if (
      result.error &&
      result.error.status === 401 &&
      args.url !== 'auth/signin'
    ) {
      const refreshToken = localStorage.getItem('refreshToken');
      const refreshResult = await baseQuery(
        { url: `/auth/refresh?token=${refreshToken}`, method: 'POST' },
        api,
        extraOptions,
      );
      if (refreshResult.data) {
        const refeshTokenResult =
          refreshResult.data as IResponse<ISignInResponse>;
        if (refeshTokenResult?.data) {
          localStorage.setItem(
            'accessToken',
            refeshTokenResult?.data?.accessToken,
          );
          localStorage.setItem(
            'refreshToken',
            refeshTokenResult.data.refreshToken,
          );
          result = await baseQuery(args, api, extraOptions);
        }
      } else {
        localStorage.clear();
        api.dispatch(resetUser());
        window.location.href = '/signin';
      }
    }
  }

  return result;
};

export const mainApi = createApi({
  reducerPath: 'main',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Transport', 'Transports', 'RentInfo'],
  endpoints: (build) => ({
    signup: build.mutation<IResponse<IUser>, ISignUp>({
      query: ({ email, password, name, imageId }) => ({
        url: 'auth/signup',
        method: 'POST',
        body: {
          email,
          password,
          name,
          imageId,
        },
      }),
    }),
    signin: build.mutation<IResponse<ISignInResponse>, ISignIn>({
      query: ({ email, password }) => ({
        url: 'auth/signin',
        method: 'POST',
        body: {
          email,
          password,
        },
      }),
    }),
    uploadImage: build.mutation<IResponse<IImage>, FormData>({
      query: (file) => ({
        url: 'files',
        method: 'POST',
        body: file,
      }),
    }),
    logout: build.mutation<IResponse<IAffectedResult>, string>({
      query: (token) => ({
        url: 'auth/logout',
        method: 'POST',
        params: {
          token,
        },
      }),
    }),
  }),
});

export const {
  useSignupMutation,
  useSigninMutation,
  useUploadImageMutation,
  useLogoutMutation,
} = mainApi;
