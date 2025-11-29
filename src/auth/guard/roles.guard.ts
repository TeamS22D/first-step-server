import { 
    Injectable, 
    CanActivate, 
    ExecutionContext, 
    ForbiddenException 
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../../user/types/user-role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();

        if (!user || !user.role) {
            throw new ForbiddenException('접근 권한이 없습니다.');
        }

        const hasRole = requiredRoles.some((role) => user.role === role);
        
        if (!hasRole) {
            throw new ForbiddenException('이 기능은 관리자만 사용할 수 있습니다.');
        }

        return true;
    }
}