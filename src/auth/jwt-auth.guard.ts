import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context) as Promise<boolean>;
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    if (err) {
      console.error('JWT Error:', err);
      throw err || new UnauthorizedException('Token inválido ou expirado');
    }
    
    if (!user) {
      console.error('JWT Info:', info);
      console.error('No user found');
      
      if (info?.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token expirado');
      }
      if (info?.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Token inválido: ' + info.message);
      }
      if (info?.name === 'NotBeforeError') {
        throw new UnauthorizedException('Token ainda não válido');
      }
      
      throw new UnauthorizedException('Token inválido ou expirado: ' + (info?.message || 'Unknown error'));
    }
    
    return user;
  }
}
