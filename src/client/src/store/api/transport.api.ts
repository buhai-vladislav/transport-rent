import { IAffectedResult, IPaginated, IResponse } from '../../types/Response';
import {
  ITransport,
  ITransportCreate,
  ITransportGetWhere,
  ITransportUpdate,
} from '../../types/Transport';
import { mainApi } from './main.api';

const transportApi = mainApi.injectEndpoints({
  endpoints: (build) => ({
    createTransport: build.mutation<IResponse<ITransport>, ITransportCreate>({
      query: (transport) => ({
        url: 'transports',
        method: 'POST',
        body: transport,
      }),
    }),
    getSingleTransport: build.query<IResponse<ITransport>, string>({
      query: (id) => ({
        url: `transports/${id}`,
        method: 'GET',
      }),
      providesTags: ['Transport'],
    }),
    updateTransport: build.mutation<IResponse<ITransport>, ITransportUpdate>({
      query: ({ description, transport, imageId, id }) => ({
        url: `transports/${id}`,
        method: 'PUT',
        body: {
          transport,
          description,
          imageId,
        },
      }),
      invalidatesTags: ['Transport'],
    }),
    getTransports: build.query<
      IResponse<IPaginated<ITransport>>,
      ITransportGetWhere
    >({
      query: (params) => ({
        url: 'transports',
        method: 'GET',
        params,
      }),
    }),
    removeTransport: build.mutation<IResponse<IAffectedResult>, string>({
      query: (id) => ({
        url: `transports/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useCreateTransportMutation,
  useLazyGetSingleTransportQuery,
  useGetSingleTransportQuery,
  useUpdateTransportMutation,
  useGetTransportsQuery,
  useLazyGetTransportsQuery,
  useRemoveTransportMutation,
} = transportApi;
