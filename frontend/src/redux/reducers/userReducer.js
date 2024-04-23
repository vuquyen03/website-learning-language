import { createReducer } from "@reduxjs/toolkit";

const initialState = { 
  loggedIn: false,
  userRole: localStorage.getItem('userRole') || null
};

export const userReducer = createReducer(initialState, (builder) => {
  builder
    .addCase("SET_LOGGED_IN", (state, action) => {
      state.loggedIn = action.payload;
    })
    .addCase("SET_USER_ROLE", (state, action) => {
      state.userRole = action.payload;
    });
});