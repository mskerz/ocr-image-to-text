import { TextResponse } from "@/type/text";
import { createApi } from "@reduxjs/toolkit/query";
import axiosBaseQuery from "../axios";

export const ocrApi = createApi({
  reducerPath: "ocrApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Text"],
  endpoints: (builder) => ({
    getTextFromImage: builder.mutation<TextResponse, { file: File }>({
      query: (body) => ({
        url: "/image-to-text",
        method: "POST",
        data: body,
      }),
    }),
  }),
});
