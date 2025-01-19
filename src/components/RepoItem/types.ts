import { TRepo } from "../../store/slices/repo/types";

export type TRepoItemProps = {
    repo: TRepo;
};

export type FieldType = {
    repo?: string;
    owner?: string;
};
