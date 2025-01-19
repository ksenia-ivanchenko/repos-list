import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getRepos } from "./repoActions";
import { TEditRepo, TRepoRequest, TRepoState } from "./types";

export const initialState: TRepoState = {
    repos: [],
    totalCount: 0,
    loading: false,
    requestError: null,
};

export const repoSlice = createSlice({
    name: "repo",
    initialState,
    reducers: {
        deleteRepo: (state, action: PayloadAction<number>) => {
            state.repos = state.repos.filter(
                (item) => item.id !== action.payload
            );
        },
        editRepo: (state, action: PayloadAction<TEditRepo>) => {
            const index = state.repos.findIndex(
                (repo) => repo.id === action.payload.id
            );
            if (index !== -1) {
                state.repos[index] = {
                    ...state.repos[index],
                    name: action.payload.name,
                    owner: {
                        ...state.repos[index].owner,
                        login: action.payload.owner,
                    },
                };
            }
        },
        clearRepos: (state) => {
            state.repos = [];
            state.totalCount = 0;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getRepos.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(
            getRepos.fulfilled,
            (state, action: PayloadAction<TRepoRequest>) => {
                state.totalCount = action.payload.total_count;
                state.loading = false;
                state.repos = state.repos.concat(action.payload.items);
                state.requestError = null;
            }
        );
        builder.addCase(getRepos.rejected, (state, action) => {
            state.loading = false;
            state.requestError = action.error.message;
        });
    },
});

export const { deleteRepo, editRepo, clearRepos } = repoSlice.actions;
export const repoReducer = repoSlice.reducer;
