import { render, screen } from "@testing-library/react";
import Home from "@/pages/index";
import * as usePostsHook from "@/hooks/usePosts";
import * as useAuthHook from "@/hooks/useAuth";

jest.mock("next/router", () => ({ useRouter: () => ({ push: jest.fn() }) }));

describe("Blog list page", () => {
  beforeEach(() => {
    jest.spyOn(useAuthHook, "useAuthCheck").mockReturnValue({
      data: true,
      isLoading: false,
    } as any);
  });

  it("renders posts and filters by title", () => {
    jest.spyOn(usePostsHook, "usePosts").mockReturnValue({
      data: {
        pages: [
          {
            posts: [
              { id: "1", title: "Hello World", content: "c", likes: 0 },
              { id: "2", title: "Another Post", content: "c", likes: 0 },
            ],
            total: 2,
          },
        ],
      },
      fetchNextPage: jest.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    } as any);

    render(<Home />);
    expect(screen.getByText(/Blog Posts/)).toBeInTheDocument();
    expect(screen.getByText(/Hello World/)).toBeInTheDocument();
  });
});

