import { ENDPOINTS } from '@/services/api/endpoints';
import { baseApi } from '@/redux/baseApiSlice';

const exportApiWithTag = baseApi.enhanceEndpoints({
  addTagTypes: ['Export'],
});

export const exportApi = exportApiWithTag.injectEndpoints({
  endpoints: (builder) => ({
    exportCsv: builder.query<Blob, string>({
      query: (jobId) => ({
        url: ENDPOINTS.EXPORT_CSV(jobId),
        responseHandler: (response) => response.blob(),
      }),
      providesTags: ['Export'],
    }),
  }),
});

export const { useExportCsvQuery } = exportApi;
