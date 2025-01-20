import { screen, waitFor } from "@testing-library/react";
import App from "./App";
import { renderWithRedux } from "./tests/helpers/renderWithRedux";
import { mockGetRepo } from "./tests/mock/mockGetRepos";

describe("App", () => {
    it("should create App", () => {
        const component = renderWithRedux(<App />);
        expect(component).toMatchSnapshot();
    });

    it("should render App correctly with default state", () => {
        renderWithRedux(<App />, {
            repo: {
                repos: [],
                totalCount: 0,
                loading: false,
                requestError: null,
            },
        });

        expect(screen.getByText(/отсортировать по:/i)).toBeInTheDocument();
    });

    it("should render repos after fetching", async () => {
        renderWithRedux(<App />, {
            repo: {
                repos: mockGetRepo.items,
                totalCount: mockGetRepo.total_count,
                loading: false,
                requestError: null,
            },
        });

        await waitFor(() => {
            expect(screen.getByText(/bootstrap/i)).toBeInTheDocument();
        });
    });

    it("should show loading spinner when loading", async () => {
        renderWithRedux(<App />, {
            repo: {
                repos: [],
                totalCount: 0,
                loading: true,
                requestError: null,
            },
        });
        await waitFor(() =>
            expect(
                screen.getByRole("img", { name: /loading/i })
            ).toBeInTheDocument()
        );
    });

    it("should display error message if there is a request error", () => {
        renderWithRedux(<App />, {
            repo: {
                repos: [],
                totalCount: 0,
                loading: false,
                requestError: "Ошибка загрузки",
            },
        });

        expect(screen.getByText(/что-то пошло не так.../i)).toBeInTheDocument();
    });
});
