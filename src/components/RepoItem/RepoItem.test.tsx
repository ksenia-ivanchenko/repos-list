import { RepoItem } from "./RepoItem";
import { fireEvent, render, act, cleanup } from "@testing-library/react";
import * as reduxHooks from "react-redux";
import { deleteRepo } from "../../store/slices";
import { mockGetRepo } from "../../tests/mock/mockGetRepos";
import { screen } from "@testing-library/react";

jest.mock("react-redux");
jest.mock("../../store/slices", () => ({
    ...jest.requireActual("../../store/slices"),
    deleteRepo: jest.fn(),
}));

const mockedUseDispatch = jest.spyOn(reduxHooks, "useDispatch");
const mockedUseSelector = jest.spyOn(reduxHooks, "useSelector");

describe("RepoItem", () => {
    afterEach(() => cleanup());

    beforeEach(() => {
        mockedUseSelector.mockReturnValue(jest.fn());
    });

    it("should create RepoItem", () => {
        mockedUseDispatch.mockReturnValue(jest.fn());

        const component = render(
            <RepoItem repo={mockGetRepo.items[0]}></RepoItem>
        );

        expect(component).toMatchSnapshot();
    });

    it("should correctly render RepoItem", () => {
        mockedUseDispatch.mockReturnValue(jest.fn());

        render(<RepoItem repo={mockGetRepo.items[0]}></RepoItem>);

        expect(screen.getByTestId("avatar")).toBeInTheDocument();
        expect(screen.getByTestId("owner")).toBeInTheDocument();
        expect(screen.getByTestId("delete-button")).toBeInTheDocument();
        expect(screen.getByTestId("repo-link")).toBeInTheDocument();
        expect(screen.getByTestId("repo-description")).toBeInTheDocument();
        expect(screen.getByTestId("forks")).toBeInTheDocument();
        expect(screen.getByTestId("update")).toBeInTheDocument();
    });
});

describe("delete RepoItem", () => {
    it("should dispatch deleteRepo on button click only after 5 seconds", () => {
        jest.useFakeTimers();
        const dispatch = jest.fn();
        mockedUseDispatch.mockReturnValue(dispatch);

        render(<RepoItem repo={mockGetRepo.items[0]}></RepoItem>);

        fireEvent.click(screen.getByTestId("delete-button"));

        act(() => {
            jest.advanceTimersByTime(3000);
        });

        expect(dispatch).not.toHaveBeenCalled();

        act(() => {
            jest.advanceTimersByTime(5000);
        });

        expect(dispatch).toHaveBeenCalledTimes(1);
        expect(deleteRepo).toHaveBeenCalledWith(2126244);
        expect(screen.queryByTestId("repo-description")).toBeNull();
    });

    it("should render cancel button after delete button is clicked", () => {
        jest.useFakeTimers();
        mockedUseDispatch.mockReturnValue(jest.fn());

        render(<RepoItem repo={mockGetRepo.items[0]}></RepoItem>);

        fireEvent.click(screen.getByTestId("delete-button"));

        expect(
            screen.getByRole("button", { name: /Вернуть/i })
        ).toBeInTheDocument();
    });

    it("should not dispatch deleteRepo if cancel button was clicked and should render deleted element again", () => {
        jest.useFakeTimers();
        const dispatch = jest.fn();
        mockedUseDispatch.mockReturnValue(dispatch);

        render(<RepoItem repo={mockGetRepo.items[0]}></RepoItem>);

        fireEvent.click(screen.getByTestId("delete-button"));
        fireEvent.click(screen.getByRole("button", { name: /Вернуть/i }));

        act(() => {
            jest.advanceTimersByTime(5000);
        });

        expect(dispatch).not.toHaveBeenCalled();
        expect(screen.getByTestId("repo-description")).toBeInTheDocument();
    });
});

describe("edit RepoItem", () => {
    it("should render modal with edit form when edit button is clicked", () => {
        mockedUseDispatch.mockReturnValue(jest.fn());

        render(<RepoItem repo={mockGetRepo.items[0]}></RepoItem>);

        fireEvent.click(screen.getByTestId("edit-button"));

        expect(screen.getByTestId("edit-modal")).toBeInTheDocument();
        expect(screen.getByTestId("edit-form")).toBeInTheDocument();
    });

    it("should close modal", () => {
        mockedUseDispatch.mockReturnValue(jest.fn());

        render(<RepoItem repo={mockGetRepo.items[0]}></RepoItem>);

        fireEvent.click(screen.getByTestId("edit-button"));

        const closeButton = screen
            .getByTestId("edit-modal")
            .querySelector(".ant-modal-close");

        fireEvent.click(closeButton);
        expect(screen.queryByTestId("edit-modal")).not.toBeInTheDocument();
    });
});
