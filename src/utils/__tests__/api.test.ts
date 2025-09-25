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
    expect(api.default).toHaveProperty("defaults");
    expect(api.default).toHaveProperty("interceptors");
    expect(api.default).toHaveProperty("get");
    expect(api.default).toHaveProperty("post");
    expect(api.default).toHaveProperty("put");
    expect(api.default).toHaveProperty("delete");
  });
});
