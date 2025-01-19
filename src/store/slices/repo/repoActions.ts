import { createAsyncThunk } from "@reduxjs/toolkit";
import { TGetReposRequestData } from "./types";
import axios from "axios";

export const getRepos = createAsyncThunk(
    "repos/get",
    async ({
        page,
        searchQuery = "javascript",
        sortQuery = "forks",
    }: TGetReposRequestData) => {
        const response = await axios.get(
            `https://api.github.com/search/repositories?per_page=40&sort=${sortQuery}&page=${page}&q=${searchQuery}`
        );

        console.log(response.data);

        return response.data;
    }
);
