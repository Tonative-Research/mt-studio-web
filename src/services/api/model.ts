import { ENDPOINTS } from '@/services/api/endpoints';
import { baseApi } from '@/redux/baseApiSlice';
import { IGeminiModel } from '@/services/types/model';

const modelApiWithTag = baseApi.enhanceEndpoints({
  addTagTypes: ['Models'],
});

export const modelApi = modelApiWithTag.injectEndpoints({
  endpoints: (builder) => ({
    getModels: builder.query<IGeminiModel[], void>({
      query: () => ENDPOINTS.MODELS,
      providesTags: ['Models'],
    }),
  }),
});

export const { useGetModelsQuery } = modelApi;
