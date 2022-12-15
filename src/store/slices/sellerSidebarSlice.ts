import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

type SidebarState = {
  sidebar: {
    marketing: boolean;
  };
};

const slice = createSlice({
  name: 'sellerSidebar',
  initialState: {
    sidebar: {
      marketing: true,
    },
  } as SidebarState,
  reducers: {
    setMarketingSidebar: (
      state,
      {
        payload: { marketingSidebar },
      }: PayloadAction<{ marketingSidebar: boolean }>
    ) => {
      state.sidebar.marketing = marketingSidebar;
    },
  },
});

export const selectSidebar = (state: RootState) => state.sellerSidebar.sidebar;

export const { setMarketingSidebar } = slice.actions;

export default slice.reducer;
