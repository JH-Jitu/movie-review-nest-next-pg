// src/common/guards/entity-owner.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class EntityOwnerGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.id;
    const entityId = request.params.id;

    if (!userId || !entityId) {
      return false;
    }

    // Get the entity type from metadata
    const entityType = this.reflector.get<string>(
      'entityType',
      context.getHandler(),
    );
    if (!entityType) {
      return false;
    }

    // Check ownership based on entity type
    const entity = await this.prisma[entityType].findUnique({
      where: { id: entityId },
      select: { userId: true },
    });

    return entity?.userId === userId;
  }
}
