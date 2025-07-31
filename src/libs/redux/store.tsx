
import { configureStore } from '@reduxjs/toolkit';
import { ocrApi } from './rtk/ocr'; 

export const store = configureStore({
    reducer: {
        [ocrApi.reducerPath]: ocrApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(ocrApi.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;