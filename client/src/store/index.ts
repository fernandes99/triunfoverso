import { combineReducers, configureStore } from '@reduxjs/toolkit';
import gameReducer from './reducers/game';

const reducer = combineReducers({
  game: gameReducer
});

const store = configureStore({
  reducer
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
