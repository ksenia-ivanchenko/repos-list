import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { repoSlice } from "./slices";
import {
    TypedUseSelectorHook,
    useDispatch as dispatchHook,
    useSelector as selectorHook,
} from "react-redux";

type RootState = ReturnType<typeof rootReducer>;
type AppDispatch = typeof store.dispatch;

const rootReducer = combineReducers({
    [repoSlice.name]: repoSlice.reducer,
});

export const store = configureStore({ reducer: rootReducer });

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;
