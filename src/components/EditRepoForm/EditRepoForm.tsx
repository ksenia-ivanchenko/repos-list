import { Button, Form, Input } from "antd";
import { TEditRepoFormProps } from "./types";
import { FC } from "react";
import styles from "./EditRepoForm.module.css";

export const EditRepoForm: FC<TEditRepoFormProps> = ({ repo, handleEdit }) => (
    <Form
        data-testid="edit-form"
        name="edit"
        onFinish={handleEdit}
        className={styles.form}
        initialValues={{ repo: repo.name, owner: repo.owner.login }}
    >
        <Form.Item label="Название репозитория" name="repo">
            <Input />
        </Form.Item>

        <Form.Item label="Имя владельца" name="owner">
            <Input />
        </Form.Item>

        <Form.Item label={null} className={styles.submit}>
            <Button type="primary" htmlType="submit">
                Сохранить
            </Button>
        </Form.Item>
    </Form>
);
