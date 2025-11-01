import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    const secret = process.env.JWT_SECRET || 'your-secret-key';
    
    // Extração de token com fallback para diferentes formatos de header
    const extractToken = (req: any) => {
      // Método 1: Tentar o método padrão do Passport JWT
      const defaultExtractor = ExtractJwt.fromAuthHeaderAsBearerToken();
      let token = defaultExtractor(req);
      
      if (token) {
        return token;
      }
      
      // Método 2: Extração customizada para casos onde o header não está no formato esperado
      let authHeader: string | undefined = undefined;
      
      // Verificar req.headers (Express normaliza para minúsculas)
      if (req?.headers) {
        for (const key of Object.keys(req.headers)) {
          if (key.toLowerCase() === 'authorization') {
            authHeader = req.headers[key] as string;
            break;
          }
        }
      }
      
      // Verificar rawHeaders se não encontrou
      if (!authHeader && req?.rawHeaders && Array.isArray(req.rawHeaders)) {
        for (let i = 0; i < req.rawHeaders.length; i += 2) {
          const headerName = req.rawHeaders[i];
          const headerValue = req.rawHeaders[i + 1];
          if (headerName && typeof headerName === 'string' && 
              headerName.toLowerCase() === 'authorization') {
            authHeader = headerValue as string;
            break;
          }
        }
      }
      
      // Extrair token do header encontrado
      if (authHeader && typeof authHeader === 'string') {
        const parts = authHeader.trim().split(/\s+/);
        
        if (parts.length >= 2 && parts[0].toLowerCase() === 'bearer') {
          token = parts.slice(1).join(' ');
          return token;
        }
      }
      
      return null;
    };
    
    super({
      jwtFromRequest: extractToken,
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: any) {
    if (!payload.sub) {
      throw new UnauthorizedException('Token inválido: sub não encontrado');
    }
    
    const user = await this.authService.findById(payload.sub);
    
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }
    
    return { id: user.id, email: user.email, name: user.name, role: user.role || 'user' };
  }
}
