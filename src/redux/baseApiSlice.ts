import {
  createApi,
  fetchBaseQuery,
  retry,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '@/services/api/endpoints';

const staggeredBaseQuery = retry(
  fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as { auth?: { authToken?: string } };
      const authToken = state.auth?.authToken;
      if (authToken) {
        headers.set('authorization', `Bearer ${authToken}`);
      }
      return headers;
    },
  }),
  { maxRetries: 2 },
);

const baseQueryWithErrorHandling: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  return await staggeredBaseQuery(args, api, extraOptions);
};

export const baseApi = createApi({
  baseQuery: baseQueryWithErrorHandling,
  endpoints: () => ({}),
});
