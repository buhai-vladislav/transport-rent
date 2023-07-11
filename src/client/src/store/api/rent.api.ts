import { IRent, IRentBody, IRentWhere } from '../../types/Rent';
import { IAffectedResult, IPaginated, IResponse } from '../../types/Response';
import { mainApi } from './main.api';

const rentApi = mainApi.injectEndpoints({
  endpoints: (build) => ({
    rentTransport: build.mutation<IResponse<IRent>, IRentBody>({
      query: (body) => ({
        url: 'rent',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Transport'],
    }),
    updateRent: build.mutation<IResponse<IRent>, IRentBody>({
      query: (body) => ({
        url: 'rent',
        method: 'PUT',
        body,
      }),
    }),
    getRentList: build.query<IResponse<IPaginated<IRent>>, IRentWhere>({
      query: (params) => ({
        url: 'rent',
        method: 'GET',
        params,
      }),
    }),
    getRentInfo: build.query<IResponse<IAffectedResult>, string>({
      query: (id) => ({
        url: `rent/${id}`,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useRentTransportMutation,
  useUpdateRentMutation,
  useGetRentListQuery,
  useLazyGetRentListQuery,
  useLazyGetRentInfoQuery,
} = rentApi;
