class HttpError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
  }
}

class BadRequestException extends HttpError {
  constructor(message = "errors.bad_request") {
    super(message, 400);
  }
}

class UnauthorizedAccess extends HttpError {
  constructor(message = "errors.unauthorized_access") {
    super(message, 401);
  }
}

class ForbiddenException extends HttpError {
  constructor(message = "errors.forbidden_access") {
    super(message, 403);
  }
}

class NotFoundException extends HttpError {
  constructor(message = "errors.not_found") {
    super(message, 404);
  }
}

class ConflictException extends HttpError {
  constructor(message = "errors.conflict") {
    super(message, 409);
  }
}

class ServerError extends HttpError {
  constructor(message = "errors.server") {
    super(message, 500);
  }
}

module.exports = {
  HttpError,
  BadRequestException,
  UnauthorizedAccess,
  ForbiddenException,
  NotFoundException,
  ConflictException,
  ServerError,
};
