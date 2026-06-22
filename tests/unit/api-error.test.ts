import { describe, expect, it } from "vitest";
import { ApiError, getApiErrorMessage } from "@/lib/api-error";

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

describe("getApiErrorMessage", () => {
  it("prefers field error messages", () => {
    const error = new ApiError(422, "The given data was invalid.", {
      email: ["このメールアドレスは既に登録されています。"],
    });

    expect(getApiErrorMessage(error)).toBe("このメールアドレスは既に登録されています。");
  });

  it("maps generic server errors to Japanese", () => {
    const error = new ApiError(500, "Server Error");

    expect(getApiErrorMessage(error)).toBe(
      "サーバーでエラーが発生しました。しばらくしてから再度お試しください。",
    );
  });

  it("translates common English validation messages", () => {
    const error = new ApiError(422, "The given data was invalid.", {
      image: ["The image field must be an image."],
    });

    expect(getApiErrorMessage(error)).toBe(
      "JPEG・PNG・GIF・WebP形式の画像を選択してください。",
    );
  });

  it("uses fallback for unknown errors", () => {
    expect(getApiErrorMessage(new Error("boom"), "登録に失敗しました")).toBe("登録に失敗しました");
  });
});
