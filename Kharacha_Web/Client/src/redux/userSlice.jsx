import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const userSlice = createSlice({
    name: 'user',
    initialState: { user: null },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        updateUser: (state, action) => {
            state.user = {
                ...state.user,
                ...action.payload,
            };
        },
    },
});

export const { setUser, updateUser } = userSlice.actions;

export default userSlice.reducer;
