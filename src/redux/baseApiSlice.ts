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
  const result = await staggeredBaseQuery(args, api, extraOptions);

  // If the backend returns 404, try again with a trailing slash on the URL.
  // This helps with servers that are strict about trailing slashes.
  if (result.error && result.error.status === 404) {
    try {
      let altArgs: string | FetchArgs | null = null;
      if (typeof args === 'string') {
        altArgs = args.endsWith('/') ? null : `${args}/`;
      } else if (typeof args === 'object' && args.url) {
        const url = String(args.url);
        if (!url.endsWith('/')) {
          altArgs = { ...args, url: `${url}/` } as FetchArgs;
        }
      }

      if (altArgs) {
        const retryResult = await staggeredBaseQuery(altArgs, api, extraOptions);
        return retryResult.error ? result : retryResult;
      }
    } catch (e) {
      // swallow and return original result
      return result;
    }
  }

  return result;
};

export const baseApi = createApi({
  baseQuery: baseQueryWithErrorHandling,
  endpoints: () => ({}),
});
