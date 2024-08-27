import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/store';
import { getUserInfo, type UserInfo } from '@/services/login';
import { PURGE } from 'redux-persist';

export interface UserState {
  userInfo: UserInfo;
  isLogin: boolean;
  isIdleTimeout: boolean;
  dateFormat: string;
}

const initialState: UserState = {
  userInfo: {},
  isLogin: false,
  isIdleTimeout: false,
  dateFormat: 'YYYY-MM-DD HH:mm:ss'
};

export const login = createAsyncThunk('user/getUserInfo', async () => {
  const response = await getUserInfo();
  return response;
});

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setIsLogin: (state, action: PayloadAction<boolean>) => {
      state.isLogin = action.payload;
    },
    setUserInfo: (state, action: PayloadAction<UserInfo>) => {
      state.userInfo = action.payload;
    },
    setDateFormat: (state, action: PayloadAction<string>) => {
      state.dateFormat = action.payload;
    },
    setIsIdleTimeout: (state, action: PayloadAction<boolean>) => {
      state.isIdleTimeout = action.payload;
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        const UserInfo = action.payload;
        if (UserInfo) {
          state.userInfo = {
            ...UserInfo,
            userId: UserInfo.id
          };
        }
      })
      .addCase(login.rejected, (state) => {
        state.isLogin = false;
      })
      .addCase(PURGE, (state) => {
        // 不能用这种赋值为一个新对象的方式更新state，因为state是一个Immutable对象。
        // state = {
        //   userInfo: {} as User,
        //   token: undefined,
        //   isLogin: false
        // };
        // 可以用这种方式更新
        // state.userInfo = {};
        state.isLogin = false;
      });
  }
});

export const { setUserInfo, setDateFormat, setIsIdleTimeout, setIsLogin } =
  userSlice.actions;

export const selectIsIdleTimeout = (state: RootState) =>
  state.user.isIdleTimeout;
export const selectUserInfo = (state: RootState) => state.user.userInfo;
export const selectDateFormat = (state: RootState) =>
  state.user.dateFormat.split(' ')[0];
export const selectTimeFormat = (state: RootState) => state.user.dateFormat;
export const selectIsLogin = (state: RootState) => state.user.isLogin;

export default userSlice.reducer;
