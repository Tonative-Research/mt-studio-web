import { ENDPOINTS } from '@/services/api/endpoints';
import { baseApi } from '@/redux/baseApiSlice';
import { ILanguageOption } from '@/services/types/language';

const languageApiWithTag = baseApi.enhanceEndpoints({
  addTagTypes: ['Languages'],
});

export const languageApi = languageApiWithTag.injectEndpoints({
  endpoints: (builder) => ({
    getLanguages: builder.query<ILanguageOption[], void>({
      query: () => ENDPOINTS.LANGUAGES,
      transformResponse: (response: { languages: ILanguageOption[]; total?: number }) => response.languages,
      providesTags: ['Languages'],
    }),
  }),
});

export const { useGetLanguagesQuery } = languageApi;
