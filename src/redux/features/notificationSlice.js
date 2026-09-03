import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notification: null,
};
const notificationSlice = createSlice({
  name: 'layout',
  initialState,
  reducers: {
    setNotification: (state, action) => {
      state.notification = action.payload;
    },
  },
});
export const { setNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
