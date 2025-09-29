import { ChakraProvider, createSystem, defaultConfig } from "@chakra-ui/react";
import { render } from "@testing-library/react";
import { useRouter } from "next/router";
import { QueryClient, QueryClientProvider } from "react-query";

import Collection from "../../pages/collection";

// Mock Next.js router
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

// Mock the API functions to return mock data
jest.mock("../../api/fetchGroupCollectionGraphQL", () => ({
  fetchCollectionsGraphQL: jest.fn().mockResolvedValue([{ items: [] }]),
  mergeCollectionsGraphQL: jest.fn().mockReturnValue({
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
// Removed mocks for deleted components: SearchSidebar and MobileDrawer

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

  // Removed test for deleted SearchSidebar component

  // Removed tests for deleted components: SearchSidebar and MobileDrawer

  it("should render without errors", () => {
    expect(() => renderWithProviders(<Collection />)).not.toThrow();
  });
});
