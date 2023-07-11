import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ISignInResponse } from '../../types/Auth';
import { IUser } from '../../types/User';

const initialState: Partial<
  Omit<ISignInResponse, 'accessToken' | 'refreshToken'>
> = {
  user: undefined,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload;
    },
    resetUser: (state) => {
      state.user = undefined;
    },
  },
});

export const { setUser, resetUser } = userSlice.actions;
export default userSlice.reducer;
