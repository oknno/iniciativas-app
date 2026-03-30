export class FunctionalError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode = 400,
    public readonly details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = 'FunctionalError';
  }
}

export class NotFoundError extends FunctionalError {
  constructor(entity: string, id: string) {
    super(`${entity} ${id} não encontrado.`, 'NOT_FOUND', 404, { entity, id });
  }
}
