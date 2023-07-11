import { IResponse } from '../../types/Response';
import { IUser } from '../../types/User';
import { mainApi } from './main.api';

const userApi = mainApi.injectEndpoints({
  endpoints: (build) => ({
    me: build.query<IResponse<IUser>, void>({
      query: () => ({
        url: 'users/me',
        method: 'GET',
      }),
    }),
  }),
});

export const { useLazyMeQuery, useMeQuery } = userApi;
