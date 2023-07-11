import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { IResponse } from '../../types/Response';
import type { IUser } from '../../types/User';
import type { ISignIn, ISignInResponse, ISignUp } from '../../types/Auth';
import { IImage } from '../../types/Image';

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

export const mainApi = createApi({
  reducerPath: 'main',
  baseQuery,
  tagTypes: ['Transport', 'Transports'],
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
  }),
});

export const { useSignupMutation, useSigninMutation, useUploadImageMutation } =
  mainApi;
