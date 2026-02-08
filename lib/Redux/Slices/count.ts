import { createSlice } from '@reduxjs/toolkit';

const count = {
  count: 30,
};

const counters = createSlice({
  name: 'counter',
  initialState: count,
  reducers: {
    increaseOne: (state) => {
      state.count++;
    },
    increase: (state, action) => {
      state.count += action.payload;
    },
    decreaseOne: (state) => {
      state.count--;
    },
  },
});

export const counter = counters.reducer;

export const { increaseOne, increase, decreaseOne } = counters.actions;
