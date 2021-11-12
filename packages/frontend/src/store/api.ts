import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Bulb } from '../api/bulb';
import { LoginPost, LoginResult } from '../api/login';
import { AppState } from './store';

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as AppState;
      const token = state.auth.token;

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      return headers;
    },
  }),
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
  }),
});

export const { useLoginMutation, useGetAllBulbsQuery } = api;
