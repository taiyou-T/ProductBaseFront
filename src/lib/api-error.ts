import type { ApiErrorBody } from "@/types";

const GENERIC_SERVER_MESSAGES = new Set([
  "Server Error",
  "Internal Server Error",
  "The given data was invalid.",
  "Too Many Attempts.",
]);

const STATUS_MESSAGES: Record<number, string> = {
  401: "ログインが必要です。再度ログインしてください。",
  403: "この操作を行う権限がありません。",
  404: "データが見つかりませんでした。",
  422: "入力内容に誤りがあります。確認してください。",
  429: "リクエストが多すぎます。しばらくしてから再度お試しください。",
  500: "サーバーでエラーが発生しました。しばらくしてから再度お試しください。",
  503: "現在サービスを利用できません。しばらくしてから再度お試しください。",
};

const ENGLISH_VALIDATION_PATTERNS: Array<[RegExp, string]> = [
  [/The image field must be an image\.?/i, "JPEG・PNG・GIF・WebP形式の画像を選択してください。"],
  [/The .+ field must be an image\.?/i, "JPEG・PNG・GIF・WebP形式の画像を選択してください。"],
  [/must be a file of type/i, "許可されていない画像形式です。"],
  [/must be a file\.?/i, "有効なファイルを選択してください。"],
  [/may not be greater than (\d+) kilobytes/i, "ファイルサイズは$1KB以下にしてください。"],
  [/failed to upload/i, "アップロードに失敗しました。もう一度お試しください。"],
  [/must be a valid URL/i, "有効なURLを入力してください。"],
  [/field is required/i, "必須項目が入力されていません。"],
];

function translateEnglishValidationMessage(message: string): string {
  for (const [pattern, japanese] of ENGLISH_VALIDATION_PATTERNS) {
    if (pattern.test(message)) {
      return japanese;
    }
  }
  return message;
}

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(status: number, message?: string, errors?: Record<string, string[]>) {
    super(message ?? `API Error ${status}`);
    this.status = status;
    this.errors = errors;
  }

  displayMessage(fallback = "エラーが発生しました"): string {
    return getApiErrorMessage(this, fallback);
  }
}

export function getApiErrorMessage(error: unknown, fallback = "エラーが発生しました"): string {
  if (!(error instanceof ApiError)) {
    return fallback;
  }

  if (error.errors) {
    const first = Object.values(error.errors).flat().find(Boolean);
    if (first) {
      return translateEnglishValidationMessage(first);
    }
  }

  const message = error.message?.trim();
  if (message && !GENERIC_SERVER_MESSAGES.has(message) && !/^API Error \d+$/.test(message)) {
    return translateEnglishValidationMessage(message);
  }

  return STATUS_MESSAGES[error.status] ?? fallback;
}

export function apiErrorFromBody(status: number, body: ApiErrorBody): ApiError {
  return new ApiError(status, body.message, body.errors);
}
