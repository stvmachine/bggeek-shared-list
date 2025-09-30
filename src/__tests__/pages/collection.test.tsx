import React from "react";
import { ChakraProvider, createSystem, defaultConfig } from "@chakra-ui/react";
import { render } from "@testing-library/react";
import { useRouter } from "next/router";
import { ApolloProvider } from "@apollo/client/react";
import { apolloClient } from "../../lib/graphql/client";
import { vi } from "vitest";

import Collection from "../../pages/collection";

// Mock Next.js router
vi.mock("next/router", () => ({
  useRouter: vi.fn(),
}));

// Mock the hooks to return mock data
vi.mock("../../hooks/useCollections", () => ({
  useCollections: vi.fn().mockReturnValue({
    data: {
      boardgames: [
        {
          objectId: "1",
          name: { text: "Test Game" },
          thumbnail: "test.jpg",
          owners: [{ username: "testuser", status: {}, collid: "1" }],
        },
      ],
      collections: [{ totalitems: 1, pubdate: "2023-01-01" }],
    },
    isLoading: false,
    hasErrors: false,
    errors: [],
  }),
}));

// Mock the ImprovedSearchSidebar component
vi.mock("../../components/ImprovedSearchSidebar", () => ({
  default: () => <div data-testid="improved-search-sidebar">ImprovedSearchSidebar</div>
}));

// Mock the permalink utilities
vi.mock("../../utils/permalink", () => ({
  parseUsernamesFromUrl: vi.fn().mockReturnValue(["testuser"]),
  generatePermalink: vi.fn().mockReturnValue("/"),
  copyToClipboard: vi.fn().mockResolvedValue(true),
}));

// Mock fetch for API calls
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ item: [] }),
  })
) as any;

// Mock all the components to simplify testing
vi.mock("../../components/Layout/Navbar", () => ({
  default: () => <div data-testid="navbar">Navbar</div>
}));
vi.mock("../../components/Layout/Footer", () => ({
  default: () => <div data-testid="footer">Footer</div>
}));
vi.mock("../../components/Results", () => ({
  default: () => <div data-testid="results">Results</div>
}));
// Removed mocks for deleted components: SearchSidebar and MobileDrawer

const renderWithProviders = (component: React.ReactElement) => {
  const system = createSystem(defaultConfig);
  return render(
    <ApolloProvider client={apolloClient}>
      <ChakraProvider value={system}>{component}</ChakraProvider>
    </ApolloProvider>
  );
};

describe("Collection Page - Pending Usernames Logic", () => {
  const mockRouter = {
    query: { usernames: "testuser" },
    push: vi.fn(),
    replace: vi.fn(),
  };

  beforeEach(() => {
    (useRouter as vi.Mock).mockReturnValue(mockRouter);
    vi.clearAllMocks();
  });

  // Removed test for deleted SearchSidebar component

  // Removed tests for deleted components: SearchSidebar and MobileDrawer

  it("should render without errors", () => {
    expect(() => renderWithProviders(<Collection />)).not.toThrow();
  });

  it("should render ImprovedSearchSidebar component", () => {
    const { getAllByTestId } = renderWithProviders(<Collection />);
    const sidebars = getAllByTestId("improved-search-sidebar");
    expect(sidebars).toHaveLength(2); // Desktop and mobile versions
  });

  it("should render Results component when data is available", () => {
    const { getByTestId } = renderWithProviders(<Collection />);
    expect(getByTestId("results")).toBeInTheDocument();
  });
});
