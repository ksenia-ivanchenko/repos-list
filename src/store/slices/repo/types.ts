export type TGetReposRequestData = {
    page: number;
    searchQuery?: string;
    sortQuery?: TSortParams;
};

export type TRepo = {
    id: number;
    name: string;
    owner: { login: string; avatar_url: string };
    forks_count: number;
    updated_at: string;
    description: string;
    html_url: string;
};

export type TRepoState = {
    repos: TRepo[];
    totalCount: number;
    loading: boolean;
    requestError: null | string;
};

export type TRepoRequest = {
    total_count: number;
    items: TRepo[];
};

export type TEditRepo = {
    id: number;
    owner: string;
    name: string;
};

export type TSortParams = "forks" | "stars" | "help-wanted-issues" | "updated";
