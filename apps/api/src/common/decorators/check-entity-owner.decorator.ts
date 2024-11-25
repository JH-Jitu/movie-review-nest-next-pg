// src/common/decorators/check-entity-owner.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const CheckEntityOwner = (entityType: string) =>
  SetMetadata('entityType', entityType);
