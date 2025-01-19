import { TRepo } from "../../store/slices/repo/types";

export interface TEditRepoFormProps {
    handleEdit: (values) => void;
    repo: TRepo;
}
