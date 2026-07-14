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
      query: (data) => {
        const payload = {
          source_lang: data.sourceLanguage,
          target_lang: data.targetLanguage,
          inference_mode: data.inferenceMode ?? 'fast',
          model_name: data.modelId,
          file_id: data.fileId,
          email: data.email ?? '',
          target_column_index: Number(data.targetColumnIndex),
        };

        console.log('translate.request', {
          url: ENDPOINTS.TRANSLATE,
          method: 'POST',
          body: payload,
        });

        return {
          url: ENDPOINTS.TRANSLATE,
          method: 'POST',
          body: payload,
        };
      },
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
