import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { repoSlice } from "../../store/slices";
import { Provider } from "react-redux";
import { render } from "@testing-library/react";
import { TRepoState } from "../../store/slices/repo/types";

const rootReducer = combineReducers({
    repo: repoSlice.reducer,
});

const createReduxStore = (initialState = {}) => {
    return configureStore({
        reducer: rootReducer,
        preloadedState: initialState,
    });
};

export const renderWithRedux = (
    component,
    initialState: { repo: TRepoState } = {
        repo: {
            repos: [],
            loading: false,
            totalCount: 0,
            requestError: null,
        },
    }
) => {
    const store = createReduxStore(initialState);

    return render(<Provider store={store}>{component}</Provider>);
};
