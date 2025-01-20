import { createAsyncThunk } from "@reduxjs/toolkit";
import { TGetReposRequestData, TGetReposResponse } from "./types";
import axios from "axios";

export const getRepos = createAsyncThunk<
    TGetReposResponse,
    TGetReposRequestData
>(
    "repos/get",
    async ({
        page,
        searchQuery = "javascript",
        sortQuery = "forks",
    }: TGetReposRequestData) => {
        const response = await axios.get<TGetReposResponse>(
            `https://api.github.com/search/repositories?per_page=40&sort=${sortQuery}&page=${page}&q=${searchQuery}`
        );
        return response.data;
    }
);
