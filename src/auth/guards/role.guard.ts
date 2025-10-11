import { User } from '@clerk/backend';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user as User;

    return matchRoles(requiredRoles, user?.privateMetadata.roles as Role[]);
  }
}

function matchRoles(requiredRoles: Role[], userRoles: Role[] | undefined): boolean {
  return requiredRoles.some((role) => userRoles?.includes(role));
}
