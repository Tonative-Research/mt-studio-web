import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ENDPOINTS } from 'services/api/endpoints';

export const countryApi = createApi({
  reducerPath: 'countryApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  endpoints: (builder) => ({
    getCountriesStates: builder.query<any, void>({
      query: () => ({
        url: ENDPOINTS.COUNTRIES_STATES,
        responseHandler: 'content-type',
      }),
    }),
  }),
});

export const { useGetCountriesStatesQuery } = countryApi;
