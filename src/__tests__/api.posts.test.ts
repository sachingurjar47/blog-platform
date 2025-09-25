import type { NextApiRequest, NextApiResponse } from "next";
import postsHandler from "@/pages/api/posts/index";
import { signToken } from "@/lib/jwt";

function createMockRes() {
  const res: Partial<NextApiResponse> = {};
  res.statusCode = 200;
  res.status = (code: number) => {
    res.statusCode = code;
    return res as NextApiResponse;
  };
  res.json = (data: unknown) => ({ statusCode: res.statusCode, data });
  // @ts-expect-error - Mock implementation for testing
  res.setHeader = () => {};
  // @ts-expect-error - Mock implementation for testing
  res.end = () => {};
  return res as NextApiResponse;
}

describe("GET /api/posts", () => {
  it("requires authentication", () => {
    const req = { method: "GET", headers: {} } as unknown as NextApiRequest;
    const res = createMockRes();
    const result = postsHandler(req, res) as unknown as {
      statusCode: number;
      data: unknown;
    };
    expect(result.statusCode).toBe(401);
  });

  it("paginates results", () => {
    const token = signToken({ id: "u1", email: "a@b.com" });
    const req = {
      method: "GET",
      headers: { authorization: `Bearer ${token}` },
      query: { page: "1", limit: "10" },
    } as unknown as NextApiRequest;
    const res = createMockRes();
    const result = postsHandler(req, res) as unknown as {
      statusCode: number;
      data: { posts: unknown[]; total: number };
    };
    expect(result.statusCode).toBe(200);
    expect(Array.isArray(result.data.posts)).toBe(true);
    expect(result.data.posts.length).toBeLessThanOrEqual(10);
    expect(typeof result.data.total).toBe("number");
  });
});
