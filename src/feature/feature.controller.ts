import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import type { CurrentUserPayload } from 'src/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';

@ApiTags('feature')
@Controller('feature')
export class FeatureController {
    @Get('public')
    getPublicFeature() {
        return {
            message: 'This is a public feature',
        };
    }

    @Get('private')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    getProtectedFeature(@CurrentUser() user: CurrentUserPayload) {
        return {
            message: `This is a protected feature for user ${user.name}`,
            user: user,
        };
    }

    @Get('admin-only')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @ApiBearerAuth('JWT-auth')
    getAdminOnlyFeature(@CurrentUser() user: CurrentUserPayload) {
        return {
            message: `This is an admin-only feature`,
            user: user,
        };
    }
}
