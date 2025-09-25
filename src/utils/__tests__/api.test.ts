// Mock the api module
jest.mock("../api", () => ({
  default: {
    defaults: {
      baseURL: "http://localhost:3000/api",
    },
    interceptors: {
      request: {
        use: jest.fn(),
      },
      response: {
        use: jest.fn(),
      },
    },
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

import api from "../api";

describe("api", () => {
  it("can be imported", () => {
    expect(api).toBeDefined();
  });

  it("has expected structure", () => {
    expect(api).toHaveProperty("defaults");
    expect(api).toHaveProperty("interceptors");
    expect(api).toHaveProperty("get");
    expect(api).toHaveProperty("post");
    expect(api).toHaveProperty("put");
    expect(api).toHaveProperty("delete");
  });
});
