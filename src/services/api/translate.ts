import { ENDPOINTS } from '@/services/api/endpoints';
import { baseApi } from '@/redux/baseApiSlice';
import {
  ITranslateRequest,
  ITranslationJob,
  ITranslationResult,
  ITranslationResultResponse,
  ITranslationStartResponse,
  ITranslationStatus,
  ITranslationStatusResponse,
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
      // Backend returns { job_id, status, source_lang, target_lang, inference_mode,
      // model_name, message } — critically `job_id`, not `id`. Without this mapping,
      // ITranslationJob.id ends up undefined and EngineConfigForm falls back to a
      // fabricated timestamp, which then 404s ("job ID not found") when polled.
      transformResponse: (response: ITranslationStartResponse): ITranslationJob => ({
        id: response.job_id,
        fileName: '',
        textColumn: '',
        sourceLanguage: response.source_lang,
        targetLanguage: response.target_lang,
        modelId: response.model_name,
        status: response.status,
        totalRows: 0,
        translatedRows: 0,
        createdAt: '',
      }),
      invalidatesTags: ['Translation'],
    }),
    getTranslationStatus: builder.query<ITranslationStatus, string>({
      query: (jobId) => ENDPOINTS.TRANSLATE_STATUS(jobId),
      // See ITranslationStatusResponse for why this reads from two possible
      // locations — the backend nests progress fields under `data` (and adds
      // `results`) only once the job is completed; before that they're flat
      // on the response root.
      transformResponse: (response: ITranslationStatusResponse): ITranslationStatus => {
        const nested = response.data;
        const results = response.results;

        return {
          jobId: response.job_id,
          status: response.status,
          targetLanguage: response.target_lang ?? nested?.target_lang ?? '',
          inferenceMode: response.inference_mode ?? nested?.inference_mode ?? '',
          totalRows: response.total ?? nested?.total ?? 0,
          completedRows: response.completed ?? nested?.completed ?? 0,
          failedRows: response.failed ?? nested?.failed ?? 0,
          percent: response.percent ?? nested?.percent ?? 0,
          message: results?.message,
          outputFile: results?.output_file,
          expiresAt: results?.expires_at,
          hasErrors: results?.has_errors,
        };
      },
      providesTags: ['Translation'],
    }),
    getTranslationResult: builder.query<ITranslationResult, string>({
      query: (jobId) => ENDPOINTS.GET_TRANSLATION_RESULT(jobId),
      transformResponse: (response: ITranslationResultResponse): ITranslationResult => {
        const rows = response.preview ?? [];
        const columns = rows.length > 0 ? Object.keys(rows[0]) : [];
        const mayBeTruncated =
          response.total_rows == null || rows.length < (response.total_rows ?? rows.length);

        return {
          jobId: response.job_id,
          status: response.status,
          columns,
          rows,
          expiresAt: response.expires_at,
          rowsProcessed: response.rows_processed,
          totalRows: response.total_rows,
          mayBeTruncated,
        };
      },
      providesTags: ['Translation'],
    }),
  }),
});

export const {
  useStartTranslationMutation,
  useGetTranslationStatusQuery,
  useGetTranslationResultQuery,
} = translateApi;