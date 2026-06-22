import { ENDPOINTS } from '@/services/api/endpoints';
import { baseApi } from '@/redux/baseApiSlice';
import {
  ITranslateRequest,
  ITranslationJob,
  ITranslationStatus,
} from '@/services/types/translate';

const translateApiWithTag = baseApi.enhanceEndpoints({
  addTagTypes: ['Translation'],
});

export const translateApi = translateApiWithTag.injectEndpoints({
  endpoints: (builder) => ({
    startTranslation: builder.mutation<ITranslationJob, ITranslateRequest>({
      query: (data) => ({
        url: ENDPOINTS.TRANSLATE,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Translation'],
    }),
    getTranslationStatus: builder.query<ITranslationStatus, string>({
      query: (jobId) => ENDPOINTS.TRANSLATE_STATUS(jobId),
      providesTags: ['Translation'],
    }),
  }),
});

export const {
  useStartTranslationMutation,
  useGetTranslationStatusQuery,
} = translateApi;
