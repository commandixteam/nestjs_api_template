import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { CurrentUser } from './auth/decorators/current-user.decorator';
import type { CurrentUserPayload } from './auth/decorators/current-user.decorator';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(JwtAuthGuard)
  @Get('protected')
  @ApiBearerAuth('JWT-auth')
  getProtected(@CurrentUser() user: CurrentUserPayload) {
    return {
      message: 'Este é um endpoint protegido',
      user: user,
    };
  }
}
