import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Bulb } from '../api/bulb';
import { RealEstate } from '../api/realEstate';
import { LoginPost, LoginResult } from '../api/login';
import { AppState } from './store';

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
  tagTypes: ['RealEstate'],
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
        body: body,
      }),
      invalidatesTags: ['RealEstate'],
    }),
  }),
});

export const { useLoginMutation, useGetAllBulbsQuery, useGetAllRealEstatesQuery, useCreateRealEstateMutation } = api;
