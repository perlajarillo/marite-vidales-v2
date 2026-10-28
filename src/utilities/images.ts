import {
  ALLOWED_EXTENSIONS,
  ALLOWED_TYPES,
  MAX_FILE_SIZE_MB,
  MAX_IMAGE_SIZE,
} from "../constants/images";

export const validateFile = (file: File): string | null => {
  // 1. Check file size
  if (file.size > MAX_IMAGE_SIZE) {
    return `"${file.name}" exceeds the ${MAX_FILE_SIZE_MB}MB size limit.`;
  }

  // 2. Check MIME type
  const isValidMime = ALLOWED_TYPES.includes(file.type);

  // 3. Check extension as a fallback
  const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
  const isValidExtension = ALLOWED_EXTENSIONS.includes(fileExtension);

  if (!isValidMime && !isValidExtension) {
    return `"${file.name}" is not a supported image type (Allowed: JPG, PNG, jpeg).`;
  }

  return null; // Valid file
};
