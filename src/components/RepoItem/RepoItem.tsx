import { FC, useEffect, useState } from "react";
import { FieldType, TRepoItemProps } from "./types";
import { useDispatch, useSelector } from "../../store";
import { deleteRepo, editRepo } from "../../store/slices";
import { Spin, Modal, Button, FormProps, Avatar } from "antd";
import { DeleteOutlined, ForkOutlined, FormOutlined } from "@ant-design/icons";
import { EditRepoForm } from "../EditRepoForm/EditRepoForm";
import styles from "./RepoItem.module.css";

export const RepoItem: FC<TRepoItemProps> = ({ repo }) => {
    const dispatch = useDispatch();
    const [deleting, setDeleting] = useState(false);
    const [progressBarPercent, setProgressBarPercent] = useState(100);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { requestError } = useSelector((state) => state.repo);
    useEffect(() => {
        if (deleting) {
            const timeout = setTimeout(() => {
                dispatch(deleteRepo(repo.id));
            }, 5000);

            const interval = setInterval(() => {
                setProgressBarPercent((prev) => prev - 1);
            }, 50);

            return () => {
                clearTimeout(timeout);
                clearInterval(interval);
                setProgressBarPercent(100);
            };
        }
    }, [deleting]);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleEdit: FormProps<FieldType>["onFinish"] = (values) => {
        dispatch(
            editRepo({
                ...repo,
                owner: values.owner,
                name: values.repo,
            })
        );
        setIsModalOpen(false);
    };

    return (
        <>
            {!deleting && (
                <li className={styles.repoCard}>
                    <div className={styles.repo}>
                        <div className={styles.cardHeader}>
                            <div className={styles.ownerInfo}>
                                <Avatar
                                    src={repo.owner.avatar_url}
                                    alt="owner avatar"
                                    size="large"
                                    data-testid="avatar"
                                />
                                <h3 data-testid="owner">{repo.owner.login}</h3>
                            </div>
                            <div className={styles.buttons}>
                                <Button
                                    data-testid="edit-button"
                                    icon={<FormOutlined />}
                                    onClick={showModal}
                                />
                                <Button
                                    data-testid="delete-button"
                                    icon={<DeleteOutlined />}
                                    onClick={() => setDeleting(true)}
                                />
                            </div>
                        </div>
                        <p data-testid="repo-link">
                            Посмотреть репозиторий:{" "}
                            <a
                                className={styles.repoName}
                                href={repo.html_url}
                                target="_blank"
                            >
                                {repo.name}
                            </a>
                        </p>

                        <p data-testid="repo-description">{repo.description}</p>
                        <div className={styles.cardFooter}>
                            <div className={styles.forks} data-testid="forks">
                                <ForkOutlined />
                                <span>{repo.forks_count}</span>
                            </div>
                            <span data-testid="update">
                                обновлено{" "}
                                {new Date(repo.updated_at).toLocaleString()}
                            </span>
                        </div>
                    </div>
                </li>
            )}
            {deleting && (
                <div className={styles.cancel}>
                    <Button onClick={() => setDeleting(false)}>Вернуть</Button>
                    <Spin percent={progressBarPercent} size="default" />
                </div>
            )}
            {requestError && <span>Что-то пошло не так...</span>}
            <Modal
                title="Редактировать"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                destroyOnClose={true}
                data-testid="edit-modal"
            >
                <EditRepoForm handleEdit={handleEdit} repo={repo} />
            </Modal>
        </>
    );
};
