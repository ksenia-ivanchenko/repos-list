import { EditRepoForm } from "./EditRepoForm";
import {
    fireEvent,
    render,
    screen,
    act,
    cleanup,
} from "@testing-library/react";
import * as reduxHooks from "react-redux";
import { mockGetRepo } from "../../tests/mock/mockGetRepos";

jest.mock("react-redux");

const mockedUseDispatch = jest.spyOn(reduxHooks, "useDispatch");

describe("EditRepoForm", () => {
    afterEach(() => cleanup());

    it("should create EditRepoForm", () => {
        const component = render(
            <EditRepoForm repo={mockGetRepo.items[0]} handleEdit={jest.fn()} />
        );

        expect(component).toMatchSnapshot();
    });

    it("should correctly render EditRepoForm", () => {
        render(
            <EditRepoForm repo={mockGetRepo.items[0]} handleEdit={jest.fn()} />
        );

        expect(screen.getByTestId("edit-form")).toBeInTheDocument();
        expect(document.getElementById("edit_repo")).toBeInTheDocument();
        expect(document.getElementById("edit_owner")).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /сохранить/i })
        ).toBeInTheDocument();
    });

    it("should dispatch when submit and call handleEdit", async () => {
        const handleEditMock = jest.fn();
        mockedUseDispatch.mockReturnValue(jest.fn());

        render(
            <EditRepoForm
                repo={mockGetRepo.items[0]}
                handleEdit={handleEditMock}
            />
        );

        fireEvent.change(screen.getByLabelText(/название репозитория/i), {
            target: { value: "новое название" },
        });
        fireEvent.change(screen.getByLabelText(/имя владельца/i), {
            target: { value: "новый владелец" },
        });

        await act(async () => {
            fireEvent.submit(screen.getByTestId("edit-form"));
        });

        expect(handleEditMock).toHaveBeenCalledTimes(1);
        expect(handleEditMock).toHaveBeenCalledWith({
            repo: "новое название",
            owner: "новый владелец",
        });
    });

    it("should close modal after successful submit", async () => {
        const handleEditMock = jest.fn().mockResolvedValueOnce(true);

        render(
            <EditRepoForm
                repo={mockGetRepo.items[0]}
                handleEdit={handleEditMock}
            />
        );

        fireEvent.change(screen.getByLabelText(/название репозитория/i), {
            target: { value: "новое название" },
        });

        fireEvent.submit(screen.getByTestId("edit-form"));

        await act(async () => {
            await handleEditMock();
        });

        expect(screen.queryByTestId("edit-modal")).toBeNull();
    });
});
