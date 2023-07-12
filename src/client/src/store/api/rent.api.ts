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
      invalidatesTags: ['Transport', 'RentInfo'],
    }),
    updateRent: build.mutation<IResponse<IRent>, IRentBody & { id: string }>({
      query: ({ id, fromDate, toDate, transportId, stoppedAt }) => ({
        url: `rent/${id}`,
        method: 'PUT',
        body: {
          fromDate,
          toDate,
          transportId,
          stoppedAt,
        },
      }),
      invalidatesTags: ['Transport', 'RentInfo'],
    }),
    getRentList: build.query<IResponse<IPaginated<IRent>>, IRentWhere>({
      query: (params) => ({
        url: 'rent',
        method: 'GET',
        params,
      }),
    }),
    getRentInfo: build.query<IResponse<IRent>, string>({
      query: (id) => ({
        url: `rent/${id}`,
        method: 'GET',
      }),
      providesTags: ['RentInfo'],
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
