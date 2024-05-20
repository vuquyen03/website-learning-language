import { createReducer } from "@reduxjs/toolkit";

const initialState = { 
  loggedIn: false,
  userRole: null,
  expirationTime: localStorage.getItem("expirationTime") || null,
};

export const userReducer = createReducer(initialState, (builder) => {
  builder
    .addCase("SET_LOGGED_IN", (state, action) => {
      state.loggedIn = action.payload;
    })
    .addCase("SET_USER_ROLE", (state, action) => {
      state.userRole = action.payload;
    })
    .addCase("SET_EXPIRATION_TIME", (state, action) => {
      state.expirationTime = action.payload;
    })
    .addCase("SET_USER_DATA", (state, action) => {
      state.userData = action.payload;
    });
});