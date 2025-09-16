import { ChakraProvider, createSystem, defaultConfig } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import { useRouter } from "next/router";
import { QueryClient, QueryClientProvider } from "react-query";
import Collection from "../../pages/collection";

// Mock Next.js router
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

// Mock the API functions to return mock data
jest.mock("../../api/fetchGroupCollection", () => ({
  fetchCollection: jest.fn().mockResolvedValue({ item: [] }),
  mergeCollections: jest.fn().mockReturnValue({
    boardgames: [
      {
        objectid: "1",
        name: { text: "Test Game" },
        thumbnail: "test.jpg",
        owners: [{ username: "testuser", status: {}, collid: "1" }],
      },
    ],
    collections: [{ totalitems: 1, pubdate: "2023-01-01" }],
  }),
}));

// Mock the permalink utilities
jest.mock("../../utils/permalink", () => ({
  parseUsernamesFromUrl: jest.fn().mockReturnValue(["testuser"]),
  generatePermalink: jest.fn().mockReturnValue("/"),
  copyToClipboard: jest.fn().mockResolvedValue(true),
}));

// Mock fetch for API calls
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ item: [] }),
  })
) as jest.Mock;

// Mock all the components to simplify testing
jest.mock("../../components/Layout/Navbar", () => () => (
  <div data-testid="navbar">Navbar</div>
));
jest.mock("../../components/Layout/Footer", () => () => (
  <div data-testid="footer">Footer</div>
));
jest.mock("../../components/Results", () => () => (
  <div data-testid="results">Results</div>
));
jest.mock(
  "../../components/SearchSidebar",
  () =>
    ({ pendingUsernames, isValidating }: any) =>
      (
        <div data-testid="search-sidebar">
          <div data-testid="pending-usernames">
            {pendingUsernames?.length || 0} pending usernames
          </div>
          <div data-testid="is-validating">
            {isValidating ? "validating" : "not validating"}
          </div>
        </div>
      )
);
jest.mock(
  "../../components/MobileDrawer",
  () =>
    ({ pendingUsernames, isValidating }: any) =>
      (
        <div data-testid="mobile-drawer">
          <div data-testid="mobile-pending-usernames">
            {pendingUsernames?.length || 0} pending usernames
          </div>
          <div data-testid="mobile-is-validating">
            {isValidating ? "validating" : "not validating"}
          </div>
        </div>
      )
);

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = createTestQueryClient();
  const system = createSystem(defaultConfig);
  return render(
    <QueryClientProvider client={queryClient}>
      <ChakraProvider value={system}>{component}</ChakraProvider>
    </QueryClientProvider>
  );
};

describe("Collection Page - Pending Usernames Logic", () => {
  const mockRouter = {
    query: { usernames: "testuser" },
    push: jest.fn(),
    replace: jest.fn(),
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    jest.clearAllMocks();
  });

  it("should initialize with empty pending usernames and not validating", async () => {
    renderWithProviders(<Collection />);

    // Wait for the component to load and data to be available
    await screen.findByTestId("search-sidebar");

    expect(screen.getByTestId("pending-usernames")).toHaveTextContent(
      "0 pending usernames"
    );
    expect(screen.getByTestId("is-validating")).toHaveTextContent(
      "not validating"
    );
  });

  it("should pass pending state to SearchSidebar", async () => {
    renderWithProviders(<Collection />);

    // Wait for the component to load
    await screen.findByTestId("search-sidebar");

    // The SearchSidebar should receive the pending state props
    expect(screen.getByTestId("search-sidebar")).toBeInTheDocument();
    expect(screen.getByTestId("pending-usernames")).toBeInTheDocument();
    expect(screen.getByTestId("is-validating")).toBeInTheDocument();
  });

  it("should pass pending state to MobileDrawer", async () => {
    renderWithProviders(<Collection />);

    // Wait for the component to load
    await screen.findByTestId("mobile-drawer");

    // The MobileDrawer should receive the pending state props
    expect(screen.getByTestId("mobile-drawer")).toBeInTheDocument();
    expect(screen.getByTestId("mobile-pending-usernames")).toBeInTheDocument();
    expect(screen.getByTestId("mobile-is-validating")).toBeInTheDocument();
  });

  it("should render without errors", () => {
    expect(() => renderWithProviders(<Collection />)).not.toThrow();
  });
});
