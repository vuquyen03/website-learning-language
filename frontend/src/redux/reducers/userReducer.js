import { createReducer } from "@reduxjs/toolkit";

const initialState = { 
  loggedIn: false,
};

export const userReducer = createReducer(initialState, (builder) => {
  builder
    .addCase("SET_LOGGED_IN", (state, action) => {
      state.loggedIn = action.payload;
    });
});