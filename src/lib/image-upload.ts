import { IMAGE_UPLOAD_MAX_BYTES, IMAGE_UPLOAD_MAX_LABEL } from "@/lib/constants";

export function validateImageFileSize(file: File): string | null {
  if (file.size > IMAGE_UPLOAD_MAX_BYTES) {
    return `画像サイズは${IMAGE_UPLOAD_MAX_LABEL}以下にしてください。`;
  }
  return null;
}
