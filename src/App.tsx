import { FC, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "./store";
import { clearRepos, getRepos } from "./store/slices";
import { RepoItem } from "./components";
import { LoadingOutlined } from "@ant-design/icons";
import { Select, Spin } from "antd";
import { TSortParams } from "./store/slices/repo/types";
import styles from "./app.module.css";
import "./styles/reset.module.css";

export const App: FC = () => {
    const dispatch = useDispatch();
    const { repos, loading, totalCount, requestError } = useSelector(
        (state) => state.repo
    );
    const [currentPage, setCurrentPage] = useState(1);
    const [getNewRepos, setGetNewRepos] = useState(true);
    const [sortValue, setSortValue] = useState<TSortParams>("forks");

    useEffect(() => {
        if (getNewRepos) {
            dispatch(getRepos({ page: currentPage, sortQuery: sortValue }))
                .then(() => {
                    setCurrentPage((prev) => prev + 1);
                })
                .finally(() => {
                    setGetNewRepos(false);
                });
        }
    }, [getNewRepos]);

    const handleSelectSort = (value: TSortParams) => {
        dispatch(clearRepos());
        setSortValue(value);
        setGetNewRepos(true);
        setCurrentPage(1);
    };

    const handleScroll = useCallback(
        (e) => {
            const needNewRepos =
                e.target.documentElement.scrollHeight -
                    (e.target.documentElement.scrollTop + window.innerHeight) <
                100;

            if (needNewRepos && repos.length < totalCount) {
                setGetNewRepos(true);
            }
        },
        [repos, totalCount]
    );

    useEffect(() => {
        document.addEventListener("scroll", handleScroll);

        return () => document.removeEventListener("scroll", handleScroll);
    }, [handleScroll]);

    return (
        <main className={styles.main}>
            <span>Отсортировать по: </span>
            <Select
                defaultValue="количеству форков"
                onChange={handleSelectSort}
                className={styles.select}
                options={[
                    { value: "forks", label: "количеству форков" },
                    { value: "stars", label: "количеству звезд" },
                    {
                        value: "updated",
                        label: "времени обновления",
                    },
                ]}
            />
            <ul className={styles.list}>
                {repos.map((repo) => (
                    <RepoItem repo={repo} key={repo.id}></RepoItem>
                ))}
                {loading && (
                    <Spin indicator={<LoadingOutlined spin />} size="large" />
                )}
                {requestError && <span>Что-то пошло не так...</span>}
            </ul>
        </main>
    );
};

export default App;
