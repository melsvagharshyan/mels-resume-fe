import { api } from '../api';
import type { HrContactDto, HrContactsResponse } from './types';

const base = '/api/hr-emails';

const hrEmailsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getHrContacts: build.query<HrContactDto[], void>({
      // Absolute URL so the request hits this Next.js app instead of NEXT_PUBLIC_API_BASE_URL.
      query: () => ({
        url: new URL(base, window.location.origin).toString(),
        method: 'GET',
      }),
      transformResponse: (response: HrContactsResponse) => response.data,
      keepUnusedDataFor: 0,
    }),
  }),
});

export const { useLazyGetHrContactsQuery } = hrEmailsApi;

/** @deprecated Use useLazyGetHrContactsQuery */
export const useLazyGetDjinniHrContactsQuery = useLazyGetHrContactsQuery;
