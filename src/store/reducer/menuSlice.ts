import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/store';
import { PURGE } from 'redux-persist';
import { menus, type MenuItem } from '@/config/menuConfig';
import { getUserMenu, type UserId } from '@/services/login';

export interface MenuState {
  menuItems: string[];
  menuTree: MenuItem[];
}

const initialState: MenuState = {
  menuItems: [],
  menuTree: []
};

export const loadMenus = createAsyncThunk(
  'menu/getUserMenu',
  async (params: UserId) => {
    const response = await getUserMenu(params);
    return response;
  }
);

const checkMenuItem = (target: string[], source: MenuItem[]) => {
  let arr = source
    .map((i: MenuItem) => {
      let obj = { ...i };
      if (i?.children && i?.children?.length > 0) {
        let child = i.children.filter((j) => {
          return target.includes(j.code ?? '-');
        });

        if (child.length > 0) {
          obj.children = child;
          return obj;
        }
        return undefined;
      } else if (target.includes(i.code ?? '-')) {
        delete obj.children;
        return obj;
      } else {
        return undefined;
      }
    })
    .filter(Boolean) as MenuItem[];

  return arr;
};

export const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    setMenu: (state, action: PayloadAction<string[]>) => {
      state.menuItems = action.payload;
      state.menuTree = checkMenuItem(state.menuItems, menus);
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(loadMenus.fulfilled, (state, action) => {
        const MenuItems = action.payload.data;
        state.menuItems = MenuItems;
        state.menuTree = checkMenuItem(MenuItems, menus);
      })
      .addCase(loadMenus.rejected, (state) => {
        state.menuItems = [];
        state.menuTree = [];
      })
      .addCase(PURGE, (state) => {
        state.menuItems = [];
        state.menuTree = [];
      });
  }
});

export const { setMenu } = menuSlice.actions;

export const selectMenuItem = (state: RootState) => state.menu.menuItems;
export const selectMenuTree = (state: RootState) => state.menu.menuTree;

export default menuSlice.reducer;
