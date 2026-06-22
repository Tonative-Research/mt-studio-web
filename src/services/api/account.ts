import { ENDPOINTS } from '@/services/api/endpoints';
import { baseApi } from '@/redux/baseApiSlice';
import {
  IUser,
  IUpdateProfileRequest,
  IChangePasswordRequest,
} from '@/services/types/account';

const accountApiWithTag = baseApi.enhanceEndpoints({
  addTagTypes: ['Account'],
});

export const accountApi = accountApiWithTag.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<IUser, void>({
      query: () => ENDPOINTS.ACCOUNT_PROFILE,
      providesTags: ['Account'],
    }),
    updateProfile: builder.mutation<IUser, IUpdateProfileRequest>({
      query: (data) => ({
        url: ENDPOINTS.ACCOUNT_PROFILE,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Account'],
    }),
    changePassword: builder.mutation<void, IChangePasswordRequest>({
      query: (data) => ({
        url: `${ENDPOINTS.ACCOUNT}/change-password`,
        method: 'PUT',
        body: data,
      }),
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} = accountApi;
