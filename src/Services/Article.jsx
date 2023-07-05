import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const rapidApiKey = import.meta.env.VITE_X_RapidAPI_Article_Key;

export const articleApi = createApi({
    reducerPath: 'articleApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://article-extractor-and-summarizer.p.rapidapi.com/',
        prepareHeaders: (headers) => {
            headers.set('X-RapidAPI-Key',rapidApiKey);
            headers.set('X-RapidAPI-Host', 'article-extractor-and-summarizer.p.rapidapi.com');

            return headers;
        },
    }),
    endpoints: (builder) => ({
        getSummary: builder.query({
            query: (params) => `summarize?url=${encodeURIComponent(params.articleUrl)}&length=${params.articleLength}`,
        }),
    }),
})

export const { useLazyGetSummaryQuery } = articleApi