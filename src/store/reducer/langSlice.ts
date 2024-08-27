import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/store';
import config from '@/config';

export const langSlice = createSlice({
  name: 'language',
  initialState: {
    lang: localStorage.getItem('i18nextLng') ?? config.lang
  },
  reducers: {
    setLanguage: (state, action: PayloadAction<string>) => {
      state.lang = action.payload;
    }
  }
});

export const { setLanguage } = langSlice.actions;

export const selectLanguage = (state: RootState) => state.language.lang;

export default langSlice.reducer;
