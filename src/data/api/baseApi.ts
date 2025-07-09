import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import env from '../../config/env';

// Create the base API with RTK Query
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: env.API_URL,
    prepareHeaders: headers => {
      return headers;
    },
  }),
  tagTypes: ['Workouts', 'Weather'],
  endpoints: () => ({}),
});
