export class EntityNotFoundException extends Error {
  constructor(entity: string, id: string | number) {
    super(`${entity} with ID ${id} not found`);
  }
}

export class DuplicateEntityException extends Error {
  constructor(entity: string, field: string) {
    super(`${entity} with this ${field} already exists`);
  }
}
