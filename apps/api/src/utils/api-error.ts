export class ApiError extends Error {
  status: number;
  code: string;
  details?: Record<string, unknown>;

  constructor(status: number, code: string, message: string, details?: Record<string, unknown>) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }

  static badRequest(message: string, details?: Record<string, unknown>): ApiError {
    return new ApiError(400, "BAD_REQUEST", message, details);
  }

  static unauthorized(message = "Autentikasi diperlukan.", code = "UNAUTHORIZED"): ApiError {
    return new ApiError(401, code, message);
  }

  static forbidden(message = "Anda tidak memiliki akses untuk melakukan tindakan ini."): ApiError {
    return new ApiError(403, "FORBIDDEN", message);
  }

  static notFound(message = "Data tidak ditemukan.", code = "NOT_FOUND"): ApiError {
    return new ApiError(404, code, message);
  }

  static conflict(message: string, code = "CONFLICT"): ApiError {
    return new ApiError(409, code, message);
  }

  static validation(message: string, details?: Record<string, unknown>): ApiError {
    return new ApiError(422, "VALIDATION_ERROR", message, details);
  }
}
