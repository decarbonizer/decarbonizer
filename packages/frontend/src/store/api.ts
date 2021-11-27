import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Bulb } from '../api/bulb';
import { RealEstate } from '../api/realEstate';
import { LoginPost, LoginResult } from '../api/login';
import { AppState } from './store';
import { SurveyAnswer, SurveyAnswerCreate, SurveyAnswerUpdate } from '../api/surveyAnswer';

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.API_BASE_URL ?? 'http://localhost:3000',
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as AppState;
      const token = state.auth.token;

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: ['RealEstate', 'SurveyAnswer'],
  endpoints: (builder) => ({
    login: builder.mutation<LoginResult, LoginPost>({
      query: (body) => ({
        url: 'auth/login',
        method: 'POST',
        body,
      }),
    }),

    getAllBulbs: builder.query<Array<Bulb>, void>({
      query: () => ({
        url: 'api/v1/bulbs',
      }),
    }),

    getAllRealEstates: builder.query<Array<RealEstate>, void>({
      query: () => ({
        url: 'api/v1/realEstates',
      }),
      providesTags: ['RealEstate'],
    }),
    createRealEstate: builder.mutation({
      query: (body) => ({
        url: 'api/v1/realEstates',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['RealEstate'],
    }),

    getAllSurveyAnswersForRealEstateAndSurvey: builder.query<
      Array<SurveyAnswer>,
      { realEstateId: string; surveyId: string }
    >({
      query: ({ realEstateId, surveyId }) => ({
        url: `/api/v1/realEstates/${realEstateId}/surveys/${surveyId}/surveyAnswers`,
      }),
      providesTags: ['SurveyAnswer'],
    }),
    getAllSurveyAnswersForRealEstate: builder.query<Array<SurveyAnswer>, { realEstateId: string }>({
      query: ({ realEstateId }) => ({
        url: `/api/v1/realEstates/${realEstateId}/surveyAnswers`,
      }),
      providesTags: ['SurveyAnswer'],
    }),
    getSurveyAnswer: builder.query<SurveyAnswer, { id: string }>({
      query: ({ id }) => ({
        url: `/api/v1/surveyAnswers/${id}`,
      }),
      providesTags: ['SurveyAnswer'],
    }),
    getAllSurveyAnswers: builder.query<Array<SurveyAnswer>, void>({
      query: () => ({
        url: `/api/v1/surveyAnswers`,
      }),
      providesTags: ['SurveyAnswer'],
    }),
    createSurveyAnswer: builder.mutation<
      SurveyAnswer,
      { realEstateId: string; surveyId: string; body: SurveyAnswerCreate }
    >({
      query: ({ realEstateId, surveyId, body }) => ({
        url: `/api/v1/realEstates/${realEstateId}/surveys/${surveyId}/surveyAnswers`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['SurveyAnswer'],
    }),
    updateSurveyAnswer: builder.mutation<SurveyAnswer, { id: string; body: SurveyAnswerUpdate }>({
      query: ({ id, body }) => ({
        url: `/api/v1/surveyAnswers/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['SurveyAnswer'],
    }),
    deleteSurveyAnswer: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `/api/v1/surveyAnswers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['SurveyAnswer'],
    }),
  }),
});

export const {
  useLoginMutation,

  useGetAllBulbsQuery,

  useGetAllRealEstatesQuery,
  useCreateRealEstateMutation,

  useGetAllSurveyAnswersQuery,
  useGetAllSurveyAnswersForRealEstateAndSurveyQuery,
  useGetAllSurveyAnswersForRealEstateQuery,
  useGetSurveyAnswerQuery,
  useCreateSurveyAnswerMutation,
  useUpdateSurveyAnswerMutation,
  useDeleteSurveyAnswerMutation,
} = api;
