import { repoReducer, deleteRepo, editRepo, clearRepos } from "./repoSlice";
import { mockGetRepo } from "../../../tests/mock/mockGetRepos";
import { getRepos } from "./repoActions";

const initialState = {
    repos: mockGetRepo.items,
    loading: false,
    totalCount: mockGetRepo.total_count,
    requestError: null,
};

describe("repoSlice reducer", () => {
    it("deleteRepo should delete repo from store", () => {
        const state = repoReducer(
            initialState,
            deleteRepo(mockGetRepo.items[0].id)
        );
        expect(state).toEqual({
            ...initialState,
            repos: [mockGetRepo.items[1], mockGetRepo.items[2]],
        });
    });
    it("editRepo should set received fields to store", () => {
        const state = repoReducer(
            initialState,
            editRepo({ id: 2126244, owner: "owner", name: "name" })
        );
        expect(state.repos[0]).toEqual({
            ...state.repos[0],
            owner: { ...state.repos[0].owner, login: "owner" },
            name: "name",
        });
    });
    it("clearRepos should delete all repos from store", () => {
        const state = repoReducer(initialState, clearRepos());
        expect(state).toEqual({
            ...state,
            totalCount: 0,
            repos: [],
        });
    });
    it("getRepos should set received data to store", () => {});
});

describe("getRepos extra reducer", () => {
    it("should switch loading while getRepos.pending", () => {
        const action = { type: getRepos.pending.type };
        const state = repoReducer(initialState, action);
        expect(state).toEqual({ ...initialState, loading: true });
    });

    it("should set repo data to store while getRepos.fulfilled", () => {
        const action = {
            type: getRepos.fulfilled.type,
            payload: {
                total_count: mockGetRepo.total_count,
                items: mockGetRepo.items,
            },
        };
        const state = repoReducer(initialState, action);
        expect(state).toEqual({
            totalCount: action.payload.total_count,
            repos: initialState.repos.concat(action.payload.items),
            loading: false,
            requestError: null,
        });
    });

    it("should correctly return errors", () => {
        const action = {
            type: getRepos.rejected.type,
            error: { message: "request rejected" },
        };
        const state = repoReducer(initialState, action);
        expect(state).toEqual({
            ...initialState,
            requestError: "request rejected",
        });
    });
});
