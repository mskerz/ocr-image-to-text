import { TextResponse } from "@/type/text";
import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../axios";

export const ocrApi = createApi({
  reducerPath: "ocrApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Text"],
  endpoints: (builder) => ({
    getTextFromImage: builder.mutation<TextResponse, { file: File }>({
      query: ({ file }) => {
        const formData = new FormData();
        formData.append("file", file);

        return {
          url: "/ocr-image",
          method: "POST",
          data: formData,
       
        };
      },
    }),
  }),
});


export const { useGetTextFromImageMutation } = ocrApi;