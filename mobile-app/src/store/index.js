import { configureStore } from '@reduxjs/toolkit';
import journalReducer from './journalSlice';
import userReducer from './userSlice';

// Root reducer that handles logout action
const rootReducer = (state, action) => {
  // Clear all state on logout
  if (action.type === 'user/logout') {
    state = undefined;
  }

  return {
    journal: journalReducer(state?.journal, action),
    user: userReducer(state?.user, action),
  };
};

export const store = configureStore({
  reducer: rootReducer,
});

export default store;
