import { configureStore } from '@reduxjs/toolkit';
import { counter } from './Slices/count';

export const store = configureStore({
  reducer: {
    counter,
  },
});

export type State = ReturnType<typeof store.getState>;
