import { describe, expect, it } from "vitest";
import { ApiError } from "@/lib/api";

describe("ApiError", () => {
  it("stores status and message", () => {
    const error = new ApiError(422, "Validation failed", { email: ["invalid"] });

    expect(error).toBeInstanceOf(Error);
    expect(error.status).toBe(422);
    expect(error.message).toBe("Validation failed");
    expect(error.errors?.email).toEqual(["invalid"]);
  });

  it("uses default message when omitted", () => {
    const error = new ApiError(503);
    expect(error.message).toBe("API Error 503");
  });
});
