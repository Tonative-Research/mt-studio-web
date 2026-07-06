import { ENDPOINTS } from '@/services/api/endpoints';
import { baseApi } from '@/redux/baseApiSlice';
import { IUploadedFile } from '@/services/types/upload';

const uploadApiWithTag = baseApi.enhanceEndpoints({
  addTagTypes: ['Upload'],
});

interface UploadCsvResponse {
  id?: string;
  fileId?: string;
  file_name?: string;
  filename?: string;
  name?: string;
}

export const uploadApi = uploadApiWithTag.injectEndpoints({
  endpoints: (builder) => ({
    uploadCsv: builder.mutation<UploadCsvResponse, FormData>({
      query: (formData) => ({
        url: ENDPOINTS.UPLOAD_CSV,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Upload'],
    }),
    uploadFile: builder.mutation<IUploadedFile, FormData>({
      query: (formData) => ({
        url: ENDPOINTS.UPLOAD_CSV,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Upload'],
    }),
  }),
});

export const { useUploadCsvMutation, useUploadFileMutation } = uploadApi;
